const prisma = require('../lib/prisma');

async function createMessage({ conversationId, sender, content, type = 'voice', metadata = {} }) {
    return prisma.message.create({
        data: { conversationId, sender, content, type, metadata }
    });
}

async function getMessageById(messageId) {
    return prisma.message.findUnique({ where: { id: messageId } });
}

async function getConversationMessages(conversationId) {

    return prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
    })
}

async function getLatestConversationMessages(userId){
    const user = await prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) throw new Error('User not found');
    const conversationId = (await prisma.conversation.findFirst({
        where: {userId: user.id, endedAt: { not: null }},
        orderBy: { endedAt: 'desc' }
    }))?.id;
    if (!conversationId) return [];
    // console.log("LATEST CONVERSATION: ", await getConversationMessages(conversationId), conversationId);
    return getConversationMessages(conversationId);

}

module.exports = { createMessage, getMessageById, getConversationMessages, getLatestConversationMessages };