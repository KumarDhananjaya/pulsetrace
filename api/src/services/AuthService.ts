import { prisma } from '../db';

export interface OAuthUserInfo {
    id: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
}

export class AuthService {
    async handleOAuthCallback(provider: string, userInfo: OAuthUserInfo, providerTokens: { accessToken?: string, refreshToken?: string, expiresAt?: Date }) {
        // 1. Find identity
        const existingIdentity = await prisma.userIdentity.findUnique({
            where: {
                provider_providerId: {
                    provider,
                    providerId: userInfo.id
                }
            },
            include: { user: true }
        });

        if (existingIdentity) {
            // Update tokens if provided
            await prisma.userIdentity.update({
                where: { id: existingIdentity.id },
                data: {
                    accessToken: providerTokens.accessToken,
                    refreshToken: providerTokens.refreshToken,
                    expiresAt: providerTokens.expiresAt,
                    updatedAt: new Date()
                }
            });

            return { user: existingIdentity.user, isNewUser: false };
        }

        // 2. Link by email if possible
        if (userInfo.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: userInfo.email },
                include: { identities: true }
            });

            if (existingUser) {
                // Create new identity for existing user
                await prisma.userIdentity.create({
                    data: {
                        provider,
                        providerId: userInfo.id,
                        email: userInfo.email,
                        accessToken: providerTokens.accessToken,
                        refreshToken: providerTokens.refreshToken,
                        expiresAt: providerTokens.expiresAt,
                        userId: existingUser.id
                    }
                });

                // Auto-verify email if trusted provider
                if (userInfo.emailVerified && !existingUser.emailVerified) {
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { emailVerified: new Date() }
                    });
                }

                return { user: existingUser, isNewUser: false };
            }
        }

        // 3. Create new user
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: userInfo.email || `${userInfo.id}@${provider}.placeholder`,
                    name: userInfo.name,
                    avatarUrl: userInfo.avatarUrl,
                    emailVerified: userInfo.emailVerified ? new Date() : null,
                    identities: {
                        create: {
                            provider,
                            providerId: userInfo.id,
                            email: userInfo.email,
                            accessToken: providerTokens.accessToken,
                            refreshToken: providerTokens.refreshToken,
                            expiresAt: providerTokens.expiresAt
                        }
                    }
                }
            });

            // Create Personal Workspace for new user
            const workspaceName = `${user.name || 'User'}'s Workspace`;
            const slug = (user.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 10000);

            const org = await tx.organization.create({
                data: {
                    name: workspaceName,
                    slug: slug,
                    isPersonal: true,
                    members: {
                        create: {
                            userId: user.id,
                            role: 'OWNER'
                        }
                    }
                }
            });

            // Default project
            await tx.project.create({
                data: {
                    name: 'My First Project',
                    platform: 'web',
                    orgId: org.id
                }
            });

            return user;
        });

        return { user: newUser, isNewUser: true };
    }

    async logEvent(userId: string | null, event: string, description?: string, metadata?: any) {
        await prisma.auditLog.create({
            data: {
                userId,
                event,
                description,
                metadata: metadata || {}
            }
        });
    }
}

export const authService = new AuthService();
