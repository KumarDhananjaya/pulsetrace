import { PulseEvent } from './types';

export class Transport {
    private queue: PulseEvent[] = [];
    private flushTimer: any = null;
    private readonly dsn: string;
    private readonly apiKey: string;
    private readonly endpoint: string;
    private readonly flushInterval: number;
    private readonly maxBatchSize: number;
    private readonly STORAGE_KEY = 'pulsetrace_queue';

    constructor(dsn: string, flushInterval: number = 5000, maxBatchSize: number = 10) {
        this.dsn = dsn;
        const { apiKey, endpoint } = this.parseDsn(dsn);
        this.apiKey = apiKey;
        this.endpoint = endpoint;
        this.flushInterval = flushInterval;
        this.maxBatchSize = maxBatchSize;

        // Restore any failed events from previous session
        this.restoreQueue();
        this.setupUnloadHandler();

        // Listen for online status to flush immediately
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => this.flush());
        }
    }

    private parseDsn(dsn: string): { apiKey: string, endpoint: string } {
        try {
            const url = new URL(dsn);
            const apiKey = url.username; // Extract user part as API Key
            // Construct endpoint: origin + /api/collect
            return {
                apiKey,
                endpoint: `${url.origin}/api/collect`
            };
        } catch (e) {
            console.warn('[PulseTrace] Invalid DSN provided');
            return { apiKey: '', endpoint: '' };
        }
    }

    public sendEvent(event: PulseEvent): void {
        this.queue.push(event);
        this.persistQueue(); // Save to local storage immediately in case of crash

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

        // Take a snapshot of queue to send
        const batch = [...this.queue];
        // Optimistically clear main queue, but keep in storage until success
        this.queue = [];

        try {
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                throw new Error('Offline');
            }

            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey
                },
                body: JSON.stringify(batch),
                keepalive: true,
            });

            if (!response.ok) {
                // If 4xx (Bad Request), throw away. If 5xx (Server), keep.
                if (response.status >= 500 || response.status === 429) {
                    throw new Error(`Server Error ${response.status}`);
                }
                console.warn('[PulseTrace] Failed to send batch:', response.statusText);
            } else {
                // Success! Clear storage.
                this.clearStorage();
            }
        } catch (e) {
            // Failed to send. Put back in queue (or leave in storage)
            // For now, we put back in memory queue to try again later
            this.queue = [...batch, ...this.queue];
            this.persistQueue();
        }
    }

    private persistQueue() {
        if (typeof localStorage === 'undefined') return;
        try {
            // Cap the size to prevent quota errors
            const safeQueue = this.queue.slice(-50);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(safeQueue));
        } catch (e) {
            // Quota exceeded or disabled
        }
    }

    private restoreQueue() {
        if (typeof localStorage === 'undefined') return;
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    this.queue = parsed;
                }
            }
        } catch (e) { }
    }

    private clearStorage() {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(this.STORAGE_KEY);
    }

    private setupUnloadHandler() {
        if (typeof window === 'undefined') return;
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flush(); // Try to send before backgrounding
            }
        });
    }
}
