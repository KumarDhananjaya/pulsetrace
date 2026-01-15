import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
    },
    sessionToken?: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies?.session) {
        token = req.cookies.session;
    }

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        (req as AuthRequest).user = {
            id: decoded.userId,
        };
        (req as AuthRequest).sessionToken = token;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }
};
