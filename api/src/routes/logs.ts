import { Router } from 'express';
import { prisma } from '../db';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const IngestLogSchema = z.object({
    level: z.enum(['debug', 'info', 'warn', 'error', 'fatal']),
    message: z.string().min(1),
    metadata: z.record(z.string(), z.any()).optional(),
    source: z.string().optional(),
    projectId: z.string().uuid()
});

// Ingest Log
router.post('/collect', async (req, res) => {
    try {
        const { level, message, metadata, source, projectId } = IngestLogSchema.parse(req.body);

        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const log = await prisma.log.create({
            data: {
                level,
                message,
                metadata: metadata || {},
                source,
                projectId
            }
        });

        res.json({ success: true, id: log.id });
    } catch (e) {
        res.status(400).json({ error: 'Invalid input' });
    }
});

// List Logs for a Project
router.get('/projects/:projectId/logs', authenticate, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { level, search, limit = '100' } = req.query as any;

        const where: any = { projectId };

        if (level) {
            where.level = level;
        }

        if (search) {
            where.message = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const logs = await prisma.log.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            take: parseInt(limit)
        });

        res.json(logs);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

export const logRoutes = router;
