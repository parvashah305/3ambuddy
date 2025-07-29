const prisma = require('../lib/prisma');

async function findOrCreateConversation({ userId, conversationId, type = 'voice', forceNew = false }) {
    const user = await prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) throw new Error('User not found');

    if (!forceNew && conversationId) {
        const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (conversation) return conversation;
    }
    return prisma.conversation.create({
        data: { userId: user.id, type }
    });
}

async function createConversation({ userId, type = 'voice', overallMood = null, sentiment = null, metadata = null, title = null }) {
    const user = await prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) throw new Error('User not found');
    return prisma.conversation.create({
        data: {
            userId: user.id,
            type,
            overallMood,
            sentiment,
            metadata,
            title
        }
    });
}

async function getConversationById(conversationId) {
    return prisma.conversation.findUnique({ where: { id: conversationId } });
}

async function updateConversationEndTime(conversationId) {
    return prisma.conversation.update({
        where: { id: conversationId },
        data: { endedAt: new Date() }
    });
}

module.exports = { findOrCreateConversation, createConversation, getConversationById, updateConversationEndTime };