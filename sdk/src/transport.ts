import { PulseEvent } from './types';

export class Transport {
    private queue: PulseEvent[] = [];
    private flushTimer: any = null;
    private readonly dsn: string;
    private readonly flushInterval: number;
    private readonly maxBatchSize: number;

    constructor(dsn: string, flushInterval: number = 10000, maxBatchSize: number = 5) {
        this.dsn = dsn;
        this.flushInterval = flushInterval;
        this.maxBatchSize = maxBatchSize;
        this.setupUnloadHandler();
    }

    public sendEvent(event: PulseEvent): void {
        this.queue.push(event);

        if (this.queue.length >= this.maxBatchSize) {
            this.flush();
        } else if (!this.flushTimer) {
            this.flushTimer = setTimeout(() => this.flush(), this.flushInterval);
        }
    }

    private async flush() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }

        if (this.queue.length === 0) return;

        const batch = [...this.queue];
        this.queue = [];

        try {
            if (typeof fetch !== 'undefined') {
                const response = await fetch(this.dsn, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(batch),
                    keepalive: true, // Hint to browser to keep request alive if page navigates
                });
                if (!response.ok && console) {
                    console.warn('[PulseTrace] Failed to send event batch:', response.statusText);
                }
            }
        } catch (e) {
            // Background failure, don't crash the host app
        }
    }

    private setupUnloadHandler() {
        if (typeof window === 'undefined') return;

        // Use visibilitychange to capture page exit/backgrounding (better than unload)
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flushSync();
            }
        });

        // Fallback for older browsers
        window.addEventListener('pagehide', () => this.flushSync());
    }

    private flushSync() {
        if (this.queue.length === 0) return;

        const batch = JSON.stringify(this.queue);
        this.queue = [];

        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon(this.dsn, batch);
        } else {
            // Minimal fallback if beacon is unavailable (rare in modern browsers)
            this.flush();
        }
    }
}
