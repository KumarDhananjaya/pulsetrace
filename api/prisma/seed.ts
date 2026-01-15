import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create a User (The Freelancer)
    const user = await prisma.user.upsert({
        where: { email: 'demo@pulsetrace.com' },
        update: {},
        create: {
            email: 'demo@pulsetrace.com',
            name: 'Demo User',
            avatarUrl: 'https://github.com/shadcn.png',
        },
    });

    console.log(`👤 Created User: ${user.name} (${user.id})`);

    // 2. Create their Personal Organization
    const org = await prisma.organization.upsert({
        where: { slug: 'demo-workspace' },
        update: {},
        create: {
            name: "Demo's Workspace",
            slug: 'demo-workspace',
            isPersonal: true,
            plan: 'FREE',
            members: {
                create: {
                    userId: user.id,
                    role: 'OWNER',
                },
            },
            projects: {
                create: {
                    name: 'My First React App',
                    platform: 'web',
                },
            },
        },
        include: {
            projects: true,
        },
    });

    console.log(`🏢 Created Org: ${org.name} (${org.id})`);
    const project = org.projects[0];
    console.log(`🚀 Created Project: ${project.name}`);
    console.log(`🔑 API Key (DSN): ${project.apiKey}`);
    console.log('✅ Seed successful!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
