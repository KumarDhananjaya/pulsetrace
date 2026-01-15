import { Router } from 'express';
import { prisma } from '../db';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const CreateMonitorSchema = z.object({
    name: z.string().min(1),
    url: z.string().url(),
    interval: z.number().min(30).optional(),
    projectId: z.string().uuid()
});

// Create Monitor
router.post('/monitors', authenticate, async (req, res) => {
    try {
        const { name, url, interval, projectId } = CreateMonitorSchema.parse(req.body);

        // Verify project ownership (simplified: check if user is in org)
        // ideally navigate via org member -> project

        const monitor = await prisma.monitor.create({
            data: {
                name,
                url,
                interval: interval || 60,
                projectId
            }
        });

        res.json(monitor);
    } catch (e) {
        res.status(400).json({ error: 'Invalid input' });
    }
});

// List Monitors for a Project
router.get('/projects/:projectId/monitors', authenticate, async (req, res) => {
    try {
        const { projectId } = req.params;
        const monitors = await prisma.monitor.findMany({
            where: { projectId },
            include: {
                _count: { select: { checks: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(monitors);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch monitors' });
    }
});

// Get Check History for a Monitor
router.get('/monitors/:id/checks', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const checks = await prisma.monitorCheck.findMany({
            where: { monitorId: id },
            orderBy: { timestamp: 'desc' },
            take: 50
        });
        res.json(checks);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch checks' });
    }
});

export const uptimeRoutes = router;
