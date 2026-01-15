import { PulseTrace } from '../core';

export function setupErrorHandlers() {
    if (typeof window === 'undefined') return;

    // 1. Capture Global Runtime Errors
    const oldOnerror = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
        PulseTrace.captureException(error instanceof Error ? error : new Error(String(message)), {
            level: 'error',
            extra: {
                source,
                lineno,
                colno
            }
        });

        if (oldOnerror) return oldOnerror(message, source, lineno, colno, error);
        return false;
    };

    // 2. Capture Unhandled Promise Rejections
    const oldOnUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
        let error = event.reason;

        // Normalize reason to Error
        if (!(error instanceof Error)) {
            error = new Error(typeof event.reason === 'string' ? event.reason : 'Unhandled Promise Rejection');
        }

        PulseTrace.captureException(error, {
            level: 'error',
            extra: {
                type: 'unhandledrejection'
            }
        });

        if (oldOnUnhandledRejection) return oldOnUnhandledRejection.call(window, event);
    };
}
