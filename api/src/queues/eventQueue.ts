import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const EVENT_QUEUE_NAME = 'event-processing';

export const eventQueue = new Queue(EVENT_QUEUE_NAME, {
    connection: redis,
});

export const addEventToQueue = async (data: any) => {
    await eventQueue.add('process-event', data, {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
    });
};
