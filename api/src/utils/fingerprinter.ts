import crypto from 'crypto';

export const generateFingerprint = (message: string, stacktrace?: string): string => {
    // If no stacktrace, use the message
    if (!stacktrace) {
        return crypto.createHash('md5').update(message).digest('hex');
    }

    // Senior approach: Clean stacktrace to remove line/col numbers (which change often)
    // e.g. "at AuthController.js:42:10" -> "at AuthController.js"
    const cleanStack = stacktrace
        .split('\n')
        .map(line => line.replace(/:\d+:\d+/g, '').trim())
        .join('\n');

    return crypto.createHash('md5').update(cleanStack).digest('hex');
};
