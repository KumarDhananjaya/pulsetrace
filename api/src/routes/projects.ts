import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const prisma = new PrismaClient();

// List all projects for the current user's organizations
router.get('/', authenticate, async (req: any, res: any) => {
    const userId = req.user.id;

    try {
        // Find orgs where user is a member
        const memberships = await prisma.organizationMember.findMany({
            where: { userId },
            select: { orgId: true }
        });

        const orgIds = memberships.map(m => m.orgId);

        // Find projects in those orgs
        const projects = await prisma.project.findMany({
            where: {
                orgId: { in: orgIds }
            },
            include: {
                organization: {
                    select: { name: true, slug: true }
                },
                _count: {
                    select: { issues: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Create a new project
router.post('/', authenticate, async (req: any, res: any) => {
    const userId = req.user.id;
    const { name, platform, orgId } = req.body;

    if (!name || !platform) {
        return res.status(400).json({ error: 'Name and Platform are required' });
    }

    try {
        // Determine Org ID
        // If provided, check membership. If not, use user's personal org.
        let targetOrgId = orgId;

        if (!targetOrgId) {
            const personalOrg = await prisma.organization.findFirst({
                where: {
                    isPersonal: true,
                    members: { some: { userId } }
                }
            });
            if (!personalOrg) return res.status(400).json({ error: 'No organization found' });
            targetOrgId = personalOrg.id;
        } else {
            // Verify membership
            const membership = await prisma.organizationMember.findUnique({
                where: {
                    userId_orgId: {
                        userId,
                        orgId: targetOrgId
                    }
                }
            });
            if (!membership) return res.status(403).json({ error: 'Not a member of this organization' });
        }

        const project = await prisma.project.create({
            data: {
                name,
                platform,
                orgId: targetOrgId,
                apiKey: uuidv4(), // Generate a fresh API Key
            }
        });

        res.status(201).json(project);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Get single project details (for settings/onboarding)
router.get('/:id', authenticate, async (req: any, res: any) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: req.params.id }
        });

        // TODO: Add stricter permission check here ensuring user belongs to project's org

        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

export default router;
