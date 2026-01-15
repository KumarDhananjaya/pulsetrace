import { prisma } from '../db';
import fetch from 'node-fetch';

export const startUptimeWorker = () => {
    console.log('[UptimeWorker] Started 🚀');

    // Check every 30 seconds (or 10s for demo)
    setInterval(runChecks, 30000);
    // request immediately
    runChecks();
};

const runChecks = async () => {
    try {
        const monitors = await prisma.monitor.findMany({
            where: { status: { not: 'paused' } } // don't check paused monitors
        });

        for (const monitor of monitors) {
            checkMonitor(monitor);
        }
    } catch (e) {
        console.error('[UptimeWorker] Failed to fetch monitors', e);
    }
};

const checkMonitor = async (monitor: any) => {
    const start = Date.now();
    let status = 'down';
    let statusCode = 0;
    let message = '';

    try {
        const res = await fetch(monitor.url, { timeout: 5000 });
        statusCode = res.status;

        if (res.ok) {
            status = 'up';
        } else {
            status = 'down';
            message = res.statusText;
        }
    } catch (e: any) {
        status = 'down';
        message = e.message;
    }

    const latency = Date.now() - start;

    // Record Check
    await prisma.monitorCheck.create({
        data: {
            monitorId: monitor.id,
            status,
            statusCode,
            latency,
            message
        }
    });

    // Update Monitor Status
    await prisma.monitor.update({
        where: { id: monitor.id },
        data: {
            status,
            lastCheck: new Date()
        }
    });
};
