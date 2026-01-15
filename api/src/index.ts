import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { collectionRateLimiter } from './middleware/rateLimiter';
import { addEventToQueue } from './queues/eventQueue';
import { BatchEventSchema } from './validators/event';
import { logRoutes } from './routes/logs';
import { uptimeRoutes } from './routes/uptime';
import { prisma } from './db';
import { authenticate } from './middleware/auth';
import { startUptimeWorker } from './workers/uptimeWorker';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import './workers/eventWorker'; // Start the worker

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser() as any);
app.use(express.json());

// Public Routes
app.use('/auth', authRoutes);

// Protected Routes
app.use('/api/projects', projectRoutes);
app.use('/api', uptimeRoutes);
app.use('/api/logs', logRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'pulsetrace-api' });
});

app.post('/api/collect', collectionRateLimiter, async (req, res) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (!apiKey) return res.status(401).json({ error: 'Missing API Key' });

    try {
        const project = await prisma.project.findUnique({
            where: { apiKey: String(apiKey) },
            select: { id: true },
        });

        if (!project) return res.status(403).json({ error: 'Invalid API Key' });

        const result = BatchEventSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({ error: 'Invalid Payload' });

        await addEventToQueue({
            projectId: project.id,
            events: result.data,
        });

        res.status(202).json({ status: 'accepted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/issues', authenticate, async (req, res) => {
    try {
        const issues = await prisma.issue.findMany({
            include: { _count: { select: { events: true } } },
            orderBy: { lastSeen: 'desc' }
        });
        res.json(issues.map((i: any) => ({ ...i, events: i._count.events })));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
});

app.get('/api/issues/:id', authenticate, async (req, res) => {
    try {
        const issue = await prisma.issue.findUnique({
            where: { id: req.params.id },
            include: { events: { take: 1, orderBy: { timestamp: 'desc' } } }
        });
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch issue details' });
    }
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
    startUptimeWorker();
});
