import { PulseConfig, PulseEvent, Severity } from './types';
import { Transport } from './transport';
import { setupConsoleHandlers } from './handlers/console';
import { setupErrorHandlers } from './handlers/errors';

export class PulseTrace {
    private static instance: PulseTrace;
    private initialized = false;
    private config!: PulseConfig;
    private transport!: Transport;

    public static init(config: PulseConfig) {
        const pt = this.getInstance();
        if (pt.initialized) return;
        pt.config = config;
        pt.transport = new Transport(config.dsn);
        pt.initialized = true;

        setupConsoleHandlers();
        setupErrorHandlers();

        if (config.debug) console.log('PulseTrace SDK Initialized');
    }

    public static captureException(error: Error, options: any = {}) {
        const pt = this.getInstance();
        if (!pt.initialized) return;

        const event: PulseEvent = {
            event_id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
            timestamp: Date.now(),
            platform: 'javascript',
            level: options.level || 'error',
            message: error.message,
            exception: {
                type: error.name,
                value: error.message,
                stacktrace: error.stack
            },
            environment: pt.config.environment,
            release: pt.config.release,
            extra: options.extra
        };

        pt.transport.sendEvent(event);
    }

    private static getInstance() {
        if (!this.instance) this.instance = new PulseTrace();
        return this.instance;
    }
}
