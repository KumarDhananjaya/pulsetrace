import rateLimit from 'express-rate-limit';
import { redis } from '../config/redis';

// Simplified rate limiter for the project
// In a real 'Sentry Clone', we would use a more advanced Redis-based token bucket per API key.
export const collectionRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
