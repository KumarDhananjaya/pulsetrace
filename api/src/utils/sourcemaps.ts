import fs from 'fs';
import path from 'path';
import { SourceMapConsumer } from 'source-map';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface StackFrame {
    filename?: string;
    lineno?: number;
    colno?: number;
    function?: string;
}

export async function resolveStacktrace(stacktrace: string, release: string, projectId: string): Promise<string> {
    const frames = parseStacktrace(stacktrace);
    if (frames.length === 0) return stacktrace;

    // 1. Fetch artifacts for this release
    const artifacts = await prisma.artifact.findMany({
        where: {
            release: {
                version: release,
                projectId: projectId
            },
            type: 'source_map'
        }
    });

    if (artifacts.length === 0) return stacktrace;

    // 2. Create consumers map
    // We cache consumers for the duration of this function call
    // In a real prod env, we'd need a more robust caching strategy
    const consumers: Record<string, SourceMapConsumer> = {};

    let resolvedStack = '';

    for (const frame of frames) {
        if (!frame.filename || !frame.lineno || !frame.colno) {
            resolvedStack += formatFrame(frame) + '\n';
            continue;
        }

        // Find matching artifact
        // Frame filename might be "http://localhost:3000/assets/index-D567.js"
        // Artifact filename might be "~/assets/index-D567.js" or just "index-D567.js"
        // Heuristic: check if artifact filename ends with the frame filename basename
        const artifact = artifacts.find(a => {
            // Very basic matching for MVP
            return frame.filename!.endsWith(path.basename(a.filename).replace('.map', ''));
        });

        if (artifact) {
            try {
                if (!consumers[artifact.id]) {
                    const rawMap = fs.readFileSync(artifact.filepath, 'utf8');
                    const parsedMap = JSON.parse(rawMap);
                    consumers[artifact.id] = await new SourceMapConsumer(parsedMap);
                }

                const consumer = consumers[artifact.id];
                const originalPos = consumer.originalPositionFor({
                    line: frame.lineno,
                    column: frame.colno
                });

                if (originalPos.source && originalPos.line) {
                    resolvedStack += `at ${originalPos.name || frame.function || '?'} (${originalPos.source}:${originalPos.line}:${originalPos.column})\n`;
                    // Ideally we also extract source context here (surrounding lines) 
                    continue;
                }
            } catch (e) {
                console.warn('Failed to resolve frame with map:', e);
            }
        }

        resolvedStack += formatFrame(frame) + '\n';
    }

    // Cleanup consumers
    Object.values(consumers).forEach(c => (c as any).destroy());

    return resolvedStack.trim();
}

// Rudimentary stack parser for V8 format
function parseStacktrace(stack: string): StackFrame[] {
    const lines = stack.split('\n');
    const frames: StackFrame[] = [];

    for (const line of lines) {
        // Regex for "at FunctionName (FileName:Line:Column)"
        const match = line.match(/^\s*at (?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+))\)?/);
        if (match) {
            frames.push({
                function: match[1],
                filename: match[2],
                lineno: parseInt(match[3]),
                colno: parseInt(match[4])
            });
        } else {
            // Keep raw text if we can't parse, but for now we essentially skip/reconstruct
            frames.push({ function: line.trim() });
        }
    }
    return frames;
}

function formatFrame(frame: StackFrame): string {
    if (frame.filename) {
        return `at ${frame.function || '?'} (${frame.filename}:${frame.lineno}:${frame.colno})`;
    }
    return frame.function || '';
}
