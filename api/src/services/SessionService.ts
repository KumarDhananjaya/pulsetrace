import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export interface SessionInfo {
    userAgent?: string;
    ipAddress?: string;
    deviceInfo?: any;
}

export class SessionService {
    async createSession(userId: string, info: SessionInfo) {
        const refreshToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

        const session = await prisma.session.create({
            data: {
                token: refreshToken,
                userId,
                userAgent: info.userAgent,
                ipAddress: info.ipAddress,
                deviceInfo: info.deviceInfo,
                expiresAt
            }
        });

        const accessToken = this.generateAccessToken(userId);

        return { accessToken, refreshToken, session };
    }

    generateAccessToken(userId: string) {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    }

    async refreshSession(refreshToken: string) {
        const session = await prisma.session.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date()) {
            if (session) await prisma.session.delete({ where: { id: session.id } });
            throw new Error('Invalid or expired refresh token');
        }

        // Refresh token rotation
        const newToken = uuidv4();
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

        const updatedSession = await prisma.session.update({
            where: { id: session.id },
            data: {
                token: newToken,
                expiresAt: newExpiresAt,
                lastUsedAt: new Date()
            }
        });

        const accessToken = this.generateAccessToken(session.userId);

        return { accessToken, refreshToken: newToken, user: session.user };
    }

    async revokeSession(refreshToken: string) {
        await prisma.session.deleteMany({
            where: { token: refreshToken }
        });
    }

    async revokeAllUserSessions(userId: string) {
        await prisma.session.deleteMany({
            where: { userId }
        });
    }
}

export const sessionService = new SessionService();
