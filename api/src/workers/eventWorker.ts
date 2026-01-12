import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { PrismaClient } from '@prisma/client';
import { scrubPII } from '../utils/scrubber';
import { generateFingerprint } from '../utils/fingerprinter';
import { EVENT_QUEUE_NAME } from '../queues/eventQueue';

const prisma = new PrismaClient();

export const eventWorker = new Worker(
    EVENT_QUEUE_NAME,
    async (job: Job) => {
        const rawEvents = Array.isArray(job.data.events) ? job.data.events : [job.data.events];
        const { projectId } = job.data;

        for (const rawEvent of rawEvents) {
            try {
                // 1. Scrub PII
                const event = scrubPII(rawEvent);

                // 2. Handle Exceptions/Fingerprinting
                let issueId: string | undefined;
                if (event.exception) {
                    const fingerprint = generateFingerprint(event.message, event.exception.stacktrace);

                    // Find or create Issue
                    const issue = await prisma.issue.upsert({
                        where: { fingerprint },
                        update: { lastSeen: new Date() },
                        create: {
                            fingerprint,
                            title: event.message,
                            type: event.exception.type || 'Error',
                            projectId,
                        },
                    });
                    issueId = issue.id;
                }

                // 3. Store Event
                await prisma.event.create({
                    data: {
                        eventId: event.event_id,
                        timestamp: new Date(event.timestamp),
                        level: event.level,
                        message: event.message,
                        exception: event.exception || undefined,
                        breadcrumbs: event.breadcrumbs || undefined,
                        metrics: event.metrics || undefined,
                        network: event.network || undefined,
                        environment: event.environment,
                        release: event.release,
                        issueId,
                    },
                });
            } catch (err) {
                console.error('Error processing event:', err);
                throw err; // Allow BullMQ to retry
            }
        }
    },
    { connection: redis }
);

eventWorker.on('completed', (job) => console.log(`Job ${job.id} completed`));
eventWorker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err));
