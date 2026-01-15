import axios from 'axios';
import { BaseOAuthProvider } from './BaseOAuthProvider';
import { OAuthUserInfo } from '../services/AuthService';

export class GitHubProvider extends BaseOAuthProvider {
    protected clientId = process.env.GITHUB_CLIENT_ID || '';
    protected clientSecret = process.env.GITHUB_CLIENT_SECRET || '';
    protected redirectUri = process.env.GITHUB_REDIRECT_URI || '';

    getAuthorizationUrl(state: string): string {
        const rootUrl = 'https://github.com/login/oauth/authorize';
        const options = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: 'read:user user:email',
            state,
        };

        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    }

    async exchangeCode(code: string) {
        const url = 'https://github.com/login/oauth/access_token';
        const res = await axios.post(url, {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            redirect_uri: this.redirectUri,
        }, {
            headers: { Accept: 'application/json' },
        });

        return {
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token, // GitHub refresh tokens are optional but supported
            expiresAt: res.data.expires_in ? new Date(Date.now() + res.data.expires_in * 1000) : undefined,
        };
    }

    async getUserInfo(accessToken: string): Promise<OAuthUserInfo> {
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const emailRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const primaryEmail = emailRes.data.find((e: any) => e.primary) || emailRes.data[0];

        return {
            id: userRes.data.id.toString(),
            email: primaryEmail?.email,
            name: userRes.data.name || userRes.data.login,
            avatarUrl: userRes.data.avatar_url,
            emailVerified: primaryEmail?.verified || false,
        };
    }
}

export const githubProvider = new GitHubProvider();
