import { PulseConfig, PulseEvent, Severity } from './types';
import { Transport } from './transport';
import { setupConsoleHandlers } from './handlers/console';
import { setupErrorHandlers } from './handlers/errors';
import { setupDomHandlers } from './handlers/dom';
import { setupNavigationHandlers } from './handlers/navigation';
import { BreadcrumbManager } from './breadcrumb';

export class PulseTrace {
    private static instance: PulseTrace;
    private initialized = false;
    private config!: PulseConfig;
    private transport!: Transport;
    private breadcrumbs!: BreadcrumbManager;

    public static init(config: PulseConfig) {
        const pt = this.getInstance();
        if (pt.initialized) return;
        pt.config = config;
        pt.transport = new Transport(config.dsn);
        pt.breadcrumbs = new BreadcrumbManager(config.maxBreadcrumbs || 20);
        pt.initialized = true;

        setupConsoleHandlers();
        setupErrorHandlers();
        setupDomHandlers();
        setupNavigationHandlers();

        if (config.debug) console.log('PulseTrace SDK Initialized');
    }

    public static addBreadcrumb(breadcrumb: any) {
        const pt = this.getInstance();
        if (!pt.initialized) return;
        pt.breadcrumbs.addBreadcrumb(breadcrumb);
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
            breadcrumbs: pt.breadcrumbs.getBreadcrumbs(),
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
