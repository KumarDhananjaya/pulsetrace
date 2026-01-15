import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create a User (The Freelancer)
    const user = await prisma.user.upsert({
        where: { email: 'demo@pulsetrace.com' },
        update: {
            password: hashedPassword
        },
        create: {
            email: 'demo@pulsetrace.com',
            name: 'Demo User',
            avatarUrl: 'https://github.com/shadcn.png',
            password: hashedPassword,
        },
    });
    console.log('User created:', user.email);

    // 2. Create the Personal Organization (Simulate 'My Workspace')
    // We check if it exists or create it
    // Logic: User should have a personal organization
    const personalOrgSlug = 'demo-workspace';

    let personalOrg = await prisma.organization.findUnique({
        where: { slug: personalOrgSlug }
    });

    if (!personalOrg) {
        personalOrg = await prisma.organization.create({
            data: {
                name: "Demo's Workspace",
                slug: personalOrgSlug,
                isPersonal: true,
                members: {
                    create: {
                        userId: user.id,
                        role: 'OWNER'
                    }
                }
            }
        });
        console.log('Personal Org created:', personalOrg.name);
    }

    // 3. Create a Demo Project
    const project = await prisma.project.create({
        data: {
            name: 'My First React App',
            platform: 'web',
            orgId: personalOrg.id,
        }
    });

    console.log('Project created:', project.name);
    console.log('API KEY:', project.apiKey);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
