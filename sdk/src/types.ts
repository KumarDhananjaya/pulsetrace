export interface PulseConfig {
    dsn: string;
    debug?: boolean;
    sampleRate?: number;
    environment?: string;
    release?: string;
    maxBreadcrumbs?: number;
    flushInterval?: number;
    maxBatchSize?: number;
    capturePerformance?: boolean;
}

export type Severity = 'info' | 'warning' | 'error' | 'fatal';

export interface Breadcrumb {
    type: string;
    category?: string;
    message?: string;
    data?: Record<string, any>;
    level?: Severity;
    timestamp: number;
}

export interface Metric {
    name: string;
    value: number;
    rating?: 'good' | 'needs-improvement' | 'poor';
    extra?: Record<string, any>;
}

export interface NetworkRequest {
    url: string;
    method: string;
    status: number;
    duration: number;
    timestamp: number;
}

export interface PulseEvent {
    event_id: string;
    timestamp: number;
    platform: string;
    level: Severity;
    message: string;
    exception?: {
        type: string;
        value: string;
        stacktrace?: string;
    };
    breadcrumbs?: Breadcrumb[];
    metrics?: Record<string, any>;
    network?: NetworkRequest;
    contexts?: Record<string, any>;
    type?: string; // 'error' | 'perf' | 'transaction'
    environment?: string;
    release?: string;
    extra?: Record<string, any>;
}
