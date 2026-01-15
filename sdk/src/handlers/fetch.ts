import { PulseTrace } from '../core';

export function setupFetchHandlers() {
    if (typeof window === 'undefined' || !window.fetch) return;

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
        const startTime = Date.now();
        const [resource, config] = args;

        let method = 'GET';
        if (config?.method) method = config.method;
        if (resource instanceof Request) method = resource.method;

        const url = resource instanceof Request ? resource.url : String(resource);

        try {
            const response = await originalFetch(...args);

            const duration = Date.now() - startTime;

            // 1. Add Breadcrumb
            PulseTrace.addBreadcrumb({
                type: 'http',
                category: 'fetch',
                message: `${method} ${url}`,
                data: {
                    status: response.status,
                    statusText: response.statusText,
                    duration
                },
                level: response.ok ? 'info' : 'warning'
            });

            // 2. Capture Metric
            if (response.ok) {
                PulseTrace.captureNetworkRequest({
                    url,
                    method,
                    status: response.status,
                    duration,
                    timestamp: startTime
                });
            }

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;

            PulseTrace.addBreadcrumb({
                type: 'http',
                category: 'fetch',
                message: `${method} ${url} [FAILED]`,
                data: {
                    error: String(error),
                    duration
                },
                level: 'error'
            });

            throw error;
        }
    };
}
