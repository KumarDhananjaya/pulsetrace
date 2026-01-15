import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Configure local storage for artifacts
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // We'll organize by project ID and release later in the handler
            // For now, dump to a temp dir or handle directory creation in config
            // Better: use a temp dir here and move it after validation
            const uploadDir = path.join(__dirname, '../../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    })
});

router.post('/artifacts', (upload.single('file') as any), async (req: any, res: any) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    const { release: releaseVersion, filename } = req.body;
    const file = req.file;

    if (!apiKey || !releaseVersion || !file) {
        return res.status(400).json({ error: 'Missing required fields: api_key, release, file' });
    }

    try {
        // 1. Validate API Key
        const project = await prisma.project.findUnique({
            where: { apiKey: String(apiKey) },
        });

        if (!project) {
            return res.status(403).json({ error: 'Invalid API Key' });
        }

        // 2. Find or Create Release
        // Upsert wouldn't work easily with the relation, so we do find/create
        let release = await prisma.release.findUnique({
            where: {
                projectId_version: {
                    projectId: project.id,
                    version: String(releaseVersion),
                }
            }
        });

        if (!release) {
            release = await prisma.release.create({
                data: {
                    projectId: project.id,
                    version: String(releaseVersion),
                }
            });
        }

        // 3. Move File to Permanent Location structure
        // uploads/<projectId>/<release>/<filename>
        const finalDir = path.join(__dirname, '../../uploads', project.id, release.version);
        if (!fs.existsSync(finalDir)) {
            fs.mkdirSync(finalDir, { recursive: true });
        }

        // Use provided filename or original filename if not provided
        // The filename (e.g., "~/static/js/main.js") is crucial for matching
        const targetFilename = String(filename || file.originalname);
        // We use a safe basename for storage to avoid path traversal
        const safeStorageName = path.basename(targetFilename) + (targetFilename.endsWith('.map') ? '.map' : '');

        const finalPath = path.join(finalDir, safeStorageName);
        fs.renameSync(file.path, finalPath);

        // 4. Create Artifact Record
        const artifact = await prisma.artifact.create({
            data: {
                releaseId: release.id,
                filename: targetFilename, // This is the identifier in the stacktrace
                filepath: finalPath,
                type: targetFilename.endsWith('.map') ? 'source_map' : 'minified_source',
                size: file.size,
            }
        });

        res.status(201).json({ status: 'ok', artifactId: artifact.id });

    } catch (err) {
        console.error('Artifact upload failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
