export const scrubPII = (data: any): any => {
    const SENSITIVE_PATTERNS = [
        { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL_REDACTED]' }, // Email
        { pattern: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[CARD_REDACTED]' }, // Credit Card
        { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN_REDACTED]' }, // SSN
    ];

    let jsonString = JSON.stringify(data);

    SENSITIVE_PATTERNS.forEach(({ pattern, replacement }) => {
        jsonString = jsonString.replace(pattern, replacement);
    });

    return JSON.parse(jsonString);
};
