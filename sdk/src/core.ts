import { PulseConfig, PulseEvent, Severity, Metric, NetworkRequest } from './types';
import { Transport } from './transport';
import { setupConsoleHandlers } from './handlers/console';
import { setupErrorHandlers } from './handlers/errors';
import { setupDomHandlers } from './handlers/dom';
import { setupNavigationHandlers } from './handlers/navigation';
import { setupPerformanceHandlers } from './handlers/performance';
import { setupFetchHandlers } from './handlers/fetch';
import { BreadcrumbManager } from './breadcrumb';
import { getContexts } from './metadata';
import { setupVitals } from './vitals';

export class PulseTrace {
    private static instance: PulseTrace;
    private initialized = false;
    private config!: PulseConfig;
    public transport!: Transport;
    private breadcrumbs!: BreadcrumbManager;

    public static init(config: PulseConfig) {
        const pt = this.getInstance();
        if (pt.initialized) return;
        pt.config = {
            capturePerformance: true,
            maxBreadcrumbs: 20,
            ...config
        };
        // Re-initialize the singleton transport with real config
        // Assuming we modify Transport to allow re-init, or just create new one (but we need to keep the reference the same if Vitals uses it)
        // Actually, Vitals imports 'transport' variable. We need to update that object or expose a way to set it.
        // Better: let's expose a method on the exported instance.

        // For now, let's just assign it to the instance prop
        pt.transport = new Transport(config.dsn, config.flushInterval, config.maxBatchSize);
        // AND update the exported singleton? No, that's messy.
        // Let's change vitals.ts to use PulseTrace.sendEvent
        pt.breadcrumbs = new BreadcrumbManager(pt.config.maxBreadcrumbs);
        pt.initialized = true;

        setupConsoleHandlers();
        setupErrorHandlers();
        setupDomHandlers();
        setupNavigationHandlers();
        setupFetchHandlers();

        if (pt.config.capturePerformance) {
            setupPerformanceHandlers();
            setupVitals();
        }

        if (config.debug) console.log('PulseTrace SDK Initialized');
    }

    public static addBreadcrumb(breadcrumb: any) {
        const pt = this.getInstance();
        if (!pt.initialized) return;
        pt.breadcrumbs.addBreadcrumb(breadcrumb);
    }

    public static captureMetric(metric: Metric) {
        const pt = this.getInstance();
        if (!pt.initialized) return;

        pt.sendEvent({
            level: 'info',
            message: `Metric: ${metric.name}`,
            metrics: { [metric.name]: metric.value },
        });
    }

    public static captureMetricEvent(metric: any) {
        const pt = this.getInstance();
        if (!pt.initialized) return;

        pt.sendEvent({
            level: 'info',
            type: 'perf',
            message: `Web Vital: ${metric.name}`,
            metrics: { [metric.name]: metric },
        });
    }

    public static captureNetworkRequest(request: NetworkRequest) {
        const pt = this.getInstance();
        if (!pt.initialized) return;

        pt.sendEvent({
            level: 'info',
            message: `Network: ${request.method} ${request.url}`,
            network: request,
        });
    }

    public static captureException(error: Error, options: any = {}) {
        const pt = this.getInstance();
        if (!pt.initialized) return;

        pt.sendEvent({
            level: options.level || 'error',
            message: error.message,
            exception: {
                type: error.name,
                value: error.message,
                stacktrace: error.stack
            },
            extra: options.extra
        });
    }

    private sendEvent(partialEvent: Partial<PulseEvent>) {
        const event: PulseEvent = {
            event_id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            timestamp: Date.now(),
            platform: 'javascript',
            level: partialEvent.level || 'error',
            message: partialEvent.message || '',
            breadcrumbs: this.breadcrumbs.getBreadcrumbs(),
            contexts: getContexts(),
            environment: this.config.environment,
            release: this.config.release,
            ...partialEvent
        };

        this.transport.sendEvent(event);
    }

    private static getInstance() {
        if (!this.instance) this.instance = new PulseTrace();
        return this.instance;
    }
}
