import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { prisma } from '../db';
import { scrubPII } from '../utils/scrubber';
import { generateFingerprint } from '../utils/fingerprinter';
import { resolveStacktrace } from '../utils/sourcemaps';
import { EVENT_QUEUE_NAME } from '../queues/eventQueue';

// Using prisma imported from ../db

export const eventWorker = new Worker(
    EVENT_QUEUE_NAME,
    async (job: Job) => {
        const rawEvents = Array.isArray(job.data.events) ? job.data.events : [job.data.events];
        const { projectId } = job.data;

        for (const rawEvent of rawEvents) {
            try {
                // 1. Scrub PII
                const event = scrubPII(rawEvent);

                // 2. Resolve Source Maps (if Exception)
                if (event.exception && event.exception.stacktrace && event.release) {
                    try {
                        const resolvedStack = await resolveStacktrace(
                            event.exception.stacktrace,
                            event.release,
                            projectId
                        );
                        if (resolvedStack) {
                            event.exception.stacktrace = resolvedStack;
                        }
                    } catch (e) {
                        console.error('Source map resolution failed:', e);
                    }
                }

                // 3. Handle Exceptions/Fingerprinting
                let issueId: string | undefined;
                if (event.exception) {
                    const fingerprint = generateFingerprint(event.message, event.exception.stacktrace);

                    // Find or create Issue
                    // Multi-tenancy: Uniqueness is (projectId + fingerprint)
                    const issue = await prisma.issue.upsert({
                        where: {
                            projectId_fingerprint: {
                                projectId,
                                fingerprint
                            }
                        },
                        update: { lastSeen: new Date(), eventsCount: { increment: 1 } },
                        create: {
                            fingerprint,
                            title: event.message,
                            type: event.exception.type || 'Error',
                            projectId,
                            eventsCount: 1
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
                        exception: (event.exception || undefined) as any,
                        breadcrumbs: (event.breadcrumbs || undefined) as any,
                        metrics: (event.metrics || undefined) as any,
                        network: (event.network || undefined) as any,
                        contexts: (event.contexts || undefined) as any,
                        environment: event.environment || undefined,
                        release: event.release || undefined,
                        issueId: issueId || undefined,
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
eventWorker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: `, err));
