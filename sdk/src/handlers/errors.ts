import { PulseTrace } from '../core';

export function setupErrorHandlers() {
    if (typeof window === 'undefined') return;

    window.onerror = (msg, src, line, col, error) => {
        PulseTrace.captureException(error || new Error(String(msg)), {
            extra: { src, line, col }
        });
        return false;
    };

    window.onunhandledrejection = (event) => {
        const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
        PulseTrace.captureException(error, { level: 'error' });
    };
}
