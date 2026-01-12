import { PulseTrace } from '../core';

export function setupConsoleHandlers() {
    const originalError = console.error;
    console.error = (...args: any[]) => {
        originalError.apply(console, args);
        try {
            const message = args.map(a => a instanceof Error ? a.message : String(a)).join(' ');
            const error = args.find(a => a instanceof Error);
            PulseTrace.captureException(error || new Error(message), { level: 'error' });
        } catch (e) { }
    };
}
