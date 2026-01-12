import { PulseTrace } from '../core';

export function setupConsoleHandlers() {
    const levels: ('error' | 'warn' | 'log' | 'info')[] = ['error', 'warn', 'log', 'info'];

    levels.forEach((level) => {
        const originalMethod = (console as any)[level];
        (console as any)[level] = (...args: any[]) => {
            // Call original method
            originalMethod.apply(console, args);

            try {
                const message = args
                    .map((arg) => (arg instanceof Error ? arg.message : String(arg)))
                    .join(' ');

                // Record breadcrumb
                PulseTrace.addBreadcrumb({
                    type: 'console',
                    category: `console.${level}`,
                    message,
                    level: (level === 'log' ? 'info' : level) as any,
                });

                // Auto-capture console.error as an exception
                if (level === 'error') {
                    const error = args.find((arg) => arg instanceof Error);
                    PulseTrace.captureException(error || new Error(message), {
                        level: 'error',
                    });
                }
            } catch (e) {
                // Prevent infinite loops if SDK fails
            }
        };
    });
}
