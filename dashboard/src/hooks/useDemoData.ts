import { useState, useEffect } from 'react';

export interface PerformanceMetric {
    timestamp: string;
    value: number;
}

export interface DemoData {
    lcp: PerformanceMetric[];
    inp: PerformanceMetric[];
    cls: PerformanceMetric[];
    uptimeHistory: { status: 'up' | 'down'; latency: number; timestamp: string }[];
    recentLogs: any[];
    throughput: number;
}

export const useDemoData = (isDemo: boolean = true) => {
    const [data, setData] = useState<DemoData | null>(null);

    const generateSeries = (count: number, base: number, variance: number): PerformanceMetric[] => {
        return Array.from({ length: count }).map((_, i) => ({
            timestamp: new Date(Date.now() - (count - i) * 1000 * 60 * 15).toISOString(),
            value: base + (Math.random() - 0.5) * variance
        }));
    };

    useEffect(() => {
        if (!isDemo) return;

        const interval = setInterval(() => {
            setData(prev => {
                const now = new Date().toISOString();
                const newPerformancePoint = (base: number, varVal: number) => ({
                    timestamp: now,
                    value: base + (Math.random() - 0.5) * varVal
                });

                return {
                    lcp: [...(prev?.lcp || generateSeries(24, 1800, 400)).slice(-24), newPerformancePoint(1800, 400)],
                    inp: [...(prev?.inp || generateSeries(24, 150, 50)).slice(-24), newPerformancePoint(150, 50)],
                    cls: [...(prev?.cls || generateSeries(24, 0.05, 0.02)).slice(-24), newPerformancePoint(0.05, 0.02)],
                    uptimeHistory: [...(prev?.uptimeHistory || Array.from({ length: 48 }).map((_, i) => ({
                        status: Math.random() > 0.02 ? 'up' : 'down',
                        latency: 180 + Math.random() * 40,
                        timestamp: new Date(Date.now() - (48 - i) * 1000 * 60 * 30).toISOString()
                    }))).slice(-48), {
                        status: Math.random() > 0.01 ? 'up' : 'down',
                        latency: 180 + Math.random() * 40,
                        timestamp: now
                    }],
                    recentLogs: [
                        { id: Math.random().toString(), timestamp: now, level: 'info', source: 'demo-worker', message: 'Heartbeat signal received from US-EAST-1' },
                        ...(prev?.recentLogs || []).slice(0, 19)
                    ],
                    throughput: Math.floor(120 + Math.random() * 30)
                } as DemoData;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isDemo]);

    return data;
};
