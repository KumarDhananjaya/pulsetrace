import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { collectionRateLimiter } from './middleware/rateLimiter';
import { addEventToQueue } from './queues/eventQueue';
import { BatchEventSchema } from './validators/event';
import artifactRoutes from './routes/artifacts';
import authRoutes from './routes/auth';
import './workers/eventWorker'; // Start the worker

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public Routes
app.use('/auth', authRoutes);

// Register Artifact Upload Routes (Needs to handle multipart/form-data, so we mount it separately or ensure body parser doesn't conflict)
app.use('/api', artifactRoutes);

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

        // 2. Validate Payload
        const result = BatchEventSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: 'Invalid Payload',
                details: (result as any).error.issues
            });
        }

        const events = result.data;

        // 3. Queue for async processing
        // We return 202 immediately to keep the SDK non-blocking
        await addEventToQueue({
            projectId: project.id,
            events: events,
        });

        res.status(202).json({ status: 'accepted' });
    } catch (err) {
        console.error('Ingestion error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Dashboard Endpoints
 */

// 1. List all Issues with event counts
app.get('/api/issues', async (req, res) => {
    try {
        const issues = await prisma.issue.findMany({
            include: {
                _count: {
                    select: { events: true }
                }
            },
            orderBy: { lastSeen: 'desc' }
        });

        // Format for frontend
        const formatted = issues.map((issue: any) => ({
            id: issue.id,
            title: issue.title,
            type: issue.type,
            status: issue.status,
            lastSeen: issue.lastSeen,
            events: issue._count.events,
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
});

// 2. Get Single Issue with latest events
app.get('/api/issues/:id', async (req, res) => {
    try {
        const issue = await prisma.issue.findUnique({
            where: { id: req.params.id },
            include: {
                events: {
                    take: 1, // Get the latest event for context
                    orderBy: { timestamp: 'desc' }
                }
            }
        });

        if (!issue) return res.status(404).json({ error: 'Issue not found' });

        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch issue details' });
    }
});

app.listen(port, () => {
    console.log(`PulseTrace API listening at http://localhost:${port}`);
});
