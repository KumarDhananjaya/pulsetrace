import { OAuthUserInfo } from '../services/AuthService';

export abstract class BaseOAuthProvider {
    protected abstract clientId: string;
    protected abstract clientSecret: string;
    protected abstract redirectUri: string;

    abstract getAuthorizationUrl(state: string): string;
    abstract exchangeCode(code: string): Promise<{ accessToken: string, refreshToken?: string, expiresAt?: Date }>;
    abstract getUserInfo(accessToken: string): Promise<OAuthUserInfo>;
}
