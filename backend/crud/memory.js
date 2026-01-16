const prisma = require('../lib/prisma');

async function createMemory({ userId, conversationId, summary, title }) {

    let userIntId = userId;
    if (typeof userId === 'string') {
        const user = await prisma.user.findUnique({ where: { uuid: userId } });
        if (!user) throw new Error('User not found');
        userIntId = user.id;
    }
    const result = await prisma.memory.create({
        data: {
            userId: userIntId,
            conversationId,
            summary,
            title
        },
    }).catch(err => {
        if (err.code === 'P2002') return null; // Unique constraint violation
        throw err;
    });
    return !!result;
}

async function getAllMemoriesForUser(userId) {
    const user = await prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) throw new Error('User not found');
    return prisma.memory.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' }
    });
}

async function getMemoryByConversationId(conversationId) {
    return prisma.memory.findFirst({
        where: { conversationId }
    });
}

async function getLatestMemoryForUser(userId) {
    let userIntId = userId;
    if (typeof userId === 'string') {
        const user = await prisma.user.findUnique({ where: { uuid: userId } });
        if (!user) throw new Error('User not found');
        userIntId = user.id;
    }
    return prisma.memory.findFirst({
        where: { userId: userIntId },
        orderBy: { createdAt: 'desc' }
    });
}

async function upsertMemory({ userId, conversationId, summary, title }) {
    let userIntId = userId;
    if (typeof userId === 'string') {
        const user = await prisma.user.findUnique({ where: { uuid: userId } });
        if (!user) throw new Error('User not found');
        userIntId = user.id;
    }

    return prisma.memory.upsert({
        where: { conversationId: conversationId || "" },
        update: {
            summary,
            title,
            createdAt: new Date()
        },
        create: {
            userId: userIntId,
            conversationId,
            summary,
            title
        }
    });
}

module.exports = { createMemory, getAllMemoriesForUser, getMemoryByConversationId, getLatestMemoryForUser, upsertMemory }; 