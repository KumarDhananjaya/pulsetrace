export interface PulseConfig {
    dsn: string;
    debug?: boolean;
    sampleRate?: number;
    environment?: string;
    release?: string;
    maxBreadcrumbs?: number;
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
    environment?: string;
    release?: string;
    extra?: Record<string, any>;
}
