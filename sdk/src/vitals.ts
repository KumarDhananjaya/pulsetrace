import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';
import { PulseEvent } from './types';
import { PulseTrace } from './core'; // Use Core instead of Transport directly
import { getContexts } from './metadata';

// We throttle sending to avoid too many requests, but for Vitals, they happen once-ish page load (except CLS/INP which update)
// For MVP we will send them as individual "transaction" events or "info" events.

function sendMetric(metric: Metric) {
    // Determine rating
    // Google Vitals: LCP < 2500 (Good), < 4000 (Needs Improvement), > 4000 (Poor)
    // Metric object already has 'rating' from web-vitals lib!

    const metricPayload = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id
    };

    // Use PulseTrace core to send, ensuring it has all context/breadcrumbs if needed
    // We need a public static method on PulseTrace to accept raw events or metrics
    PulseTrace.captureMetricEvent(metricPayload);
}

export const setupVitals = () => {
    try {
        onCLS(sendMetric);
        onINP(sendMetric);
        onLCP(sendMetric);
        onFCP(sendMetric);
        onTTFB(sendMetric);
    } catch (e) {
        console.error('[PulseTrace] Failed to setup vitals', e);
    }
};
