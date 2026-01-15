import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key';

// REGISTER
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction: Create User + Personal Org + Organization Member
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name || email.split('@')[0],
                    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                }
            });

            // Create Personal Workspace
            const workspaceName = `${user.name || 'User'}'s Workspace`;
            const slug = (user.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 10000);

            const org = await tx.organization.create({
                data: {
                    name: workspaceName,
                    slug: slug,
                    isPersonal: true,
                    members: {
                        create: {
                            userId: user.id,
                            role: 'OWNER'
                        }
                    }
                }
            });

            /*
           ### Validation
1.  Create a Monitor for `google.com`.
2.  Wait for worker to run.
3.  Verify status is "Up".
4.  Create a Monitor for `http://non-existent-url.test`.
5.  Verify status is "Down".

---

## Phase 8: Log Management

### Goal
Provide a centralized platform for ingesting and searching application logs. This will allow users to send raw log strings or structured JSON to PulseTrace and view them in a searchable stream.

### Proposed Changes

#### Database Schema (`api/prisma/schema.prisma`)
1.  **New Model: `Log`**
    -   `id`, `projectId`
    -   `level` (debug, info, warn, error, fatal)
    -   `message` (String)
    -   `timestamp` (DateTime, default: now)
    -   `metadata` (Json) - for structured logging.
    -   `source` (string) - e.g. "backend", "frontend", "worker".

#### API (`api/src`)
1.  **Ingestion** (`routes/logs.ts`):
    -   `POST /api/logs`: Public/DSN-based ingestion (similar to events).
    -   For MVP, we will reuse the `authenticate` middleware or a `DSN` check.
2.  **Querying**:
    -   `GET /api/projects/:id/logs`: List logs with filtering by level and basic text search.

#### Dashboard (`dashboard/src`)
1.  **New Page**: `Logs.tsx`.
    -   **Log Stream**: A real-time (polling) list of logs.
    -   **Filters**: Level dropdown, search input.
    -   **Visuals**: Color-coded levels (Blue for Info, Yellow for Warn, Red for Error).

### Validation
1.  Send a test log via `curl`.
2.  Verify it appears in the Dashboard.
3.  Search for a specific keyword and verify filtering.
            */
            // Create a default project "My First Project"
            await tx.project.create({
                data: {
                    name: 'My First Project',
                    platform: 'web',
                    orgId: org.id
                }
            });

            return user;
        });

        const token = jwt.sign({ userId: result.id, email: result.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: result.id, email: result.email, name: result.name }
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ME (Protected)
router.get('/me', authenticate, async (req: any, res: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, avatarUrl: true }
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

export default router;
