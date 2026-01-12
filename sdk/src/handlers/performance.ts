import { PulseTrace } from '../core';

export function setupPerformanceHandlers() {
    if (typeof window === 'undefined') return;

    captureWebVitals();
    instrumentNetwork();
}

function captureWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    // 1. Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        PulseTrace.captureMetric({
            name: 'LCP',
            value: lastEntry.startTime,
            rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor',
        });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // 2. First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            const fid = (entry as any).processingStart - entry.startTime;
            PulseTrace.captureMetric({
                name: 'FID',
                value: fid,
                rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor',
            });
        });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // 3. Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
            }
        }
        PulseTrace.captureMetric({
            name: 'CLS',
            value: clsValue,
            rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
        });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
}

function instrumentNetwork() {
    // 1. Instrument Fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const start = performance.now();
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        const method = (args[1]?.method || (args[0] as Request).method || 'GET').toUpperCase();

        try {
            const response = await originalFetch(...args);
            const duration = performance.now() - start;

            PulseTrace.captureNetworkRequest({
                url,
                method,
                status: response.status,
                duration,
                timestamp: Date.now(),
            });

            return response;
        } catch (error) {
            const duration = performance.now() - start;
            PulseTrace.captureNetworkRequest({
                url,
                method,
                status: 0, // Failed
                duration,
                timestamp: Date.now(),
            });
            throw error;
        }
    };

    // 2. Instrument XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...args: any[]) {
        (this as any)._pt_method = method;
        (this as any)._pt_url = url.toString();
        (this as any)._pt_start = performance.now();
        return originalOpen.apply(this, [method, url, ...args] as any);
    };

    XMLHttpRequest.prototype.send = function (body?: any) {
        this.addEventListener('loadend', () => {
            const duration = performance.now() - (this as any)._pt_start;
            PulseTrace.captureNetworkRequest({
                url: (this as any)._pt_url,
                method: (this as any)._pt_method,
                status: this.status,
                duration,
                timestamp: Date.now(),
            });
        });
        return originalSend.call(this, body);
    };
}
