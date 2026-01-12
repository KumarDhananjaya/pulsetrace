import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { collectionRateLimiter } from './middleware/rateLimiter';
import { addEventToQueue } from './queues/eventQueue';
import './workers/eventWorker'; // Start the worker

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'pulsetrace-api' });
});

/**
 * High-Throughput Ingestion Endpoint
 */
app.post('/api/collect', collectionRateLimiter, async (req, res) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKey) {
        return res.status(401).json({ error: 'Missing API Key' });
    }

    try {
        // 1. Validate API Key
        const project = await prisma.project.findUnique({
            where: { apiKey: String(apiKey) },
            select: { id: true },
        });

        if (!project) {
            return res.status(403).json({ error: 'Invalid API Key' });
        }

        // 2. Queue for async processing
        // We return 202 immediately to keep the SDK non-blocking
        await addEventToQueue({
            projectId: project.id,
            events: req.body,
        });

        res.status(202).json({ status: 'accepted' });
    } catch (err) {
        console.error('Ingestion error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`PulseTrace API listening at http://localhost:${port}`);
});
