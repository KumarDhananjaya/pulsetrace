import { z } from 'zod';

const BreadcrumbSchema = z.object({
    type: z.string(),
    category: z.string().optional(),
    message: z.string().optional(),
    data: z.record(z.any()).optional(),
    level: z.string().optional(),
    timestamp: z.number(),
});

const MetricSchema = z.object({
    name: z.string(),
    value: z.number(),
    rating: z.enum(['good', 'needs-improvement', 'poor']).optional(),
    extra: z.record(z.any()).optional(),
});

const NetworkRequestSchema = z.object({
    url: z.string(),
    method: z.string(),
    status: z.number(),
    duration: z.number(),
    timestamp: z.number(),
});

const ExceptionSchema = z.object({
    type: z.string(),
    value: z.string(),
    stacktrace: z.string().optional(),
});

export const EventSchema = z.object({
    event_id: z.string(),
    timestamp: z.number(),
    platform: z.string(),
    level: z.enum(['info', 'warning', 'error', 'fatal']),
    message: z.string(),
    exception: ExceptionSchema.optional(),
    breadcrumbs: z.array(BreadcrumbSchema).optional(),
    metrics: z.array(MetricSchema).optional(),
    network: NetworkRequestSchema.optional(),
    contexts: z.record(z.any()).optional(),
    environment: z.string().optional(),
    release: z.string().optional(),
    extra: z.record(z.any()).optional(),
});

// The SDK sends an array of events
export const BatchEventSchema = z.array(EventSchema);
