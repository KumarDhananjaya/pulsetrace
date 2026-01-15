import axios from 'axios';
import { BaseOAuthProvider } from './BaseOAuthProvider';
import { OAuthUserInfo } from '../services/AuthService';

export class GoogleProvider extends BaseOAuthProvider {
    protected clientId = process.env.GOOGLE_CLIENT_ID || '';
    protected clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    protected redirectUri = process.env.GOOGLE_REDIRECT_URI || '';

    getAuthorizationUrl(state: string): string {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
            state,
        };

        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    }

    async exchangeCode(code: string) {
        const url = 'https://oauth2.googleapis.com/token';
        const values = {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code',
        };

        const res = await axios.post(url, new URLSearchParams(values), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return {
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
            expiresAt: new Date(Date.now() + res.data.expires_in * 1000),
        };
    }

    async getUserInfo(accessToken: string): Promise<OAuthUserInfo> {
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        return {
            id: res.data.sub,
            email: res.data.email,
            name: res.data.name,
            avatarUrl: res.data.picture,
            emailVerified: res.data.email_verified,
        };
    }
}

export const googleProvider = new GoogleProvider();
