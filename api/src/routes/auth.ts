import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authService } from '../services/AuthService';
import { sessionService } from '../services/SessionService';
import { googleProvider } from '../providers/GoogleProvider';
import { githubProvider } from '../providers/GitHubProvider';

const router = express.Router();

const getProvider = (name: string) => {
    switch (name.toLowerCase()) {
        case 'google': return googleProvider;
        case 'github': return githubProvider;
        default: return null;
    }
};

const sendTokens = (res: any, tokens: { accessToken: string, refreshToken: string }) => {
    res.cookie('session', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
    });
    res.cookie('refresh', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const { user } = await authService.handleOAuthCallback('password', {
            id: email,
            email,
            name,
            avatarUrl: null,
            emailVerified: false
        }, {});

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        const tokens = await sessionService.createSession(user.id, {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
        });

        sendTokens(res, tokens);
        res.status(201).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    try {
        const user = await prisma.user.findUnique({ where: { email } }) as any;
        if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const tokens = await sessionService.createSession(user.id, {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
        });

        sendTokens(res, tokens);
        res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/oauth/:provider', (req, res) => {
    const provider = getProvider(req.params.provider);
    if (!provider) return res.status(400).json({ error: 'Invalid provider' });

    const state = Math.random().toString(36).substring(7);
    res.cookie('oauth_state', state, { httpOnly: true, maxAge: 300000 });

    const url = provider.getAuthorizationUrl(state);
    res.redirect(url);
});

router.get('/callback/:provider', async (req, res) => {
    const { code, state } = req.query;
    const { oauth_state } = req.cookies;

    if (!code || state !== oauth_state) {
        return res.status(400).json({ error: 'Invalid state or missing code' });
    }

    const provider = getProvider(req.params.provider);
    if (!provider) return res.status(400).json({ error: 'Invalid provider' });

    try {
        const pTokens = await provider.exchangeCode(code as string);
        const userInfo = await provider.getUserInfo(pTokens.accessToken);

        const { user } = await authService.handleOAuthCallback(req.params.provider, userInfo, pTokens);

        const tokens = await sessionService.createSession(user.id, {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
        });

        sendTokens(res, tokens);
        res.clearCookie('oauth_state');
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/app');
    } catch (err) {
        console.error('OAuth callback error:', err);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }
});

router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies?.refresh;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    try {
        const tokens = await sessionService.refreshSession(refreshToken);
        sendTokens(res, tokens);
        res.json({ success: true });
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired session' });
    }
});

router.post('/logout', async (req, res) => {
    const refreshToken = req.cookies?.refresh;
    if (refreshToken) await sessionService.revokeSession(refreshToken);

    res.clearCookie('session');
    res.clearCookie('refresh');
    res.json({ success: true });
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, email: true, name: true, avatarUrl: true, emailVerified: true }
        }) as any;
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Profile fetch failed' });
    }
});

export default router;
