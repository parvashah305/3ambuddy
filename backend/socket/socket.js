const lamejs = require("lamejs");
const fs = require("fs");
const { voiceChat } = require("../services/voiceChat");
const { verifyToken } = require('@clerk/clerk-sdk-node');
const { getConversationMessages, createMessage } = require('../crud/message');
const { getLatestMemoryForUser } = require('../crud/memory');
const { findOrCreateConversation, createConversation, updateConversationEndTime, getConversationById } = require('../crud/conversation');
const { createMemoryFromConversation } = require('../services/summarizeConversation');
const { SUMMARIZE_CONVERSATION_PROMPT } = require('../config/prompts');
const chat_engine = require("../services/chat_engine");
const prisma = require('../lib/prisma');
const tts_engine = require("../services/text_to_speech");
const path = require('path');
const { UPLOADS_DIR, ensureDirectoryExists } = require('../config/paths');

function initializeSocket(io) {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
            socket.userId = payload.sub; 
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    const processedConversations = new Set();

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}, Clerk UUID: ${socket.userId}`);

        let currentConversationId = null;

        socket.on('message', (message) => {
            console.log(`[${socket.id}] Received message event:`, message);
            io.emit('message', 'Hello from server');
        })

        socket.on("audio", async ({ wavBuffer, conversationId }) => {
            try {
                console.log(`[${socket.id}] Received audio event for conversationId: ${conversationId}`);

                // Ensure directory exists at runtime as well, just in case
                ensureDirectoryExists(UPLOADS_DIR);

                const filename = path.join(UPLOADS_DIR, `audio_${Date.now()}_${socket.userId}.wav`);
                fs.writeFileSync(filename, Buffer.from(wavBuffer));
                console.log(`[${socket.id}] Audio file saved: ${filename}`);

                const result = await voiceChat(filename, userId = socket.userId, conversationId = conversationId, socket = socket);
                console.log(`[${socket.id}] Audio transcribed. User: ${result.original}`);

                await Promise.all([
                    createMessage({
                        conversationId,
                        sender: 'user',
                        content: result.original,
                        type: 'voice',
                        metadata: { audioFile: filename }
                    }),
                    createMessage({
                        conversationId,
                        sender: 'ai',
                        content: result.finalResponse,
                        type: 'voice',
                        metadata: { audioFile: result.audioFile }
                    })
                ]);
                console.log(`[${socket.id}] User and AI messages created for conversationId: ${conversationId}`);

                const aiAudioBuffer = fs.readFileSync(result.audioFile);
                socket.emit("audio-response", aiAudioBuffer);
                console.log(`[${socket.id}] Sent audio-response to client.`);

                currentConversationId = conversationId;

            } catch (err) {
                console.error(`[${socket.id}] Error in audio event:`, err);
                socket.emit('error', { message: err.message });
            }
        });

        socket.on("user-voice-message", async (data) => {
            try {
                const userId = socket.userId;
                console.log(`[${socket.id}] Received user-voice-message event.`);
                const conversationId = await handleUserVoiceMessage({ ...data, userId }, socket);
                socket.emit('conversation-id', conversationId);
                console.log(`[${socket.id}] Sent conversation-id: ${conversationId}`);
            } catch (err) {
                console.error(`[${socket.id}] Error in user-voice-message event:`, err);
                socket.emit('error', { message: err.message });
            }
        });


        socket.on('start-call', async (data) => {
            try {
                console.log(`[${socket.id}] Received start-call event.`);
                const conversation = await createConversation({ userId: socket.userId, type: 'voice' });
                currentConversationId = conversation.id;

                const user = await prisma.user.findUnique({ where: { uuid: socket.userId } });
                let greeting;
                if (user && user.name) {
                    greeting = `Hey ${user.name}, how's it going?`;
                } else {
                    greeting = `Hey there, how's it going?`;
                }
               
                socket.emit('call-started', { conversationId: conversation.id });
                console.log(`[${socket.id}] Call started. ConversationId: ${conversation.id}`);

                const aiAudioFile = await tts_engine(greeting, '', undefined, socket);
                await createMessage({
                    conversationId: conversation.id,
                    sender: 'ai',
                    content: greeting,
                    type: 'voice',
                    metadata: { audioFile: aiAudioFile }
                });
                const aiAudioBuffer = fs.readFileSync(aiAudioFile);
                socket.emit('audio-response', aiAudioBuffer);
            } catch (err) {
                console.error(`[${socket.id}] Error in start-call event:`, err);
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('end-call', async (data) => {
            const conversationId = data?.conversationId || currentConversationId;
            if (!conversationId || processedConversations.has(conversationId)) {
                return;
            }
            processedConversations.add(conversationId);
            try {
                console.log(`[${socket.id}] Received end-call event for conversationId: ${conversationId}`);
                await updateConversationEndTime(conversationId);
                console.log(`[${socket.id}] Conversation end time updated (end-call).`);

                (async () => {
                    try {
                        const created = await createMemoryFromConversation(conversationId, socket.userId, SUMMARIZE_CONVERSATION_PROMPT);
                        if (created) {
                            console.log(`[${socket.id}] Memory processed for conversationId: ${conversationId}`);
                        }
                    } catch (err) {
                        console.error(`[${socket.id}] Error creating memory (end-call):`, err);
                    }
                })();
            } catch (err) {
                console.error(`[${socket.id}] Error in end-call event:`, err);
            }
        });

      
        socket.on('start-chat', async (data) => {
            try {
                console.log(`[${socket.id}] Received start-chat event.`);
                const conversation = await createConversation({ userId: socket.userId, type: 'chat' });
                currentConversationId = conversation.id;
                socket.emit('chat-started', { conversationId: conversation.id });
                console.log(`[${socket.id}] Chat started. ConversationId: ${conversation.id}`);
            } catch (err) {
                console.error(`[${socket.id}] Error in start-chat event:`, err);
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('chat-message', async (data) => {
            try {
                const userId = socket.userId;
                const { conversationId, message } = data;
                console.log(`[${socket.id}] Received chat-message:`, { conversationId, message });

                await createMessage({
                    conversationId,
                    sender: 'user',
                    content: message,
                    type: 'chat',
                    metadata: {}
                });

                const conversationMessages = await getConversationMessages(conversationId);

                const conversation = await getConversationById(conversationId);
                const userIntId = conversation.userId;
                const lastConversation = await prisma.conversation.findFirst({
                    where: {
                        userId: userIntId,
                        endedAt: { not: null },
                        id: { not: conversationId },
                    },
                    orderBy: { endedAt: 'desc' },
                    include: { messages: true },
                });

                const memory = await getLatestMemoryForUser(userId);

                const aiResponse = await chat_engine({
                    message,
                    conversationMessages,
                    lastConversation,
                    memory
                });
                console.log(`[${socket.id}] AI chat response:`, aiResponse);

                await createMessage({
                    conversationId,
                    sender: 'ai',
                    content: aiResponse,
                    type: 'chat',
                    metadata: {}
                });

                socket.emit('chat-response', { text: aiResponse });
                console.log(`[${socket.id}] Sent chat-response to client.`);
            } catch (err) {
                console.error(`[${socket.id}] Error in chat-message:`, err);
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('end-chat', async (data) => {
            const conversationId = data?.conversationId || currentConversationId;
            if (!conversationId) {
                console.warn(`[${socket.id}] end-chat event received but no conversationId found.`);
                return;
            }
            try {
                console.log(`[${socket.id}] Received end-chat event for conversationId: ${conversationId}`);
                await updateConversationEndTime(conversationId);
                console.log(`[${socket.id}] Conversation end time updated (end-chat).`);

                (async () => {
                    try {
                        const created = await createMemoryFromConversation(conversationId, socket.userId, SUMMARIZE_CONVERSATION_PROMPT);
                        if (created) {
                            console.log(`[${socket.id}] Memory created successfully for conversationId: ${conversationId}`);
                        } else {
                            console.log(`[${socket.id}] Memory already existed for conversationId: ${conversationId}`);
                        }
                    } catch (err) {
                        console.error(`[${socket.id}] Error creating memory (end-chat):`, err);
                    }
                })();
            } catch (err) {
                console.error(`[${socket.id}] Error in end-chat event:`, err);
            }
        });


        socket.on('get-latest-chat', async () => {
            try {
                const userId = socket.userId;
                
                const user = await prisma.user.findUnique({ where: { uuid: userId } });
                if (!user) {
                    socket.emit('latest-chat', { conversationId: null, messages: [] });
                    return;
                }
                const latestChat = await prisma.conversation.findFirst({
                    where: {
                        userId: user.id,
                        type: 'chat',
                    },
                    orderBy: { startedAt: 'desc' },
                });
                if (!latestChat) {
                    socket.emit('latest-chat', { conversationId: null, messages: [] });
                    return;
                }
                const messages = await prisma.message.findMany({
                    where: { conversationId: latestChat.id },
                    orderBy: { createdAt: 'asc' },
                });
                socket.emit('latest-chat', {
                    conversationId: latestChat.id,
                    messages: messages.map(m => ({
                        id: m.id,
                        text: m.content,
                        sender: m.sender,
                        timestamp: m.createdAt,
                    })),
                });
            } catch (err) {
                console.error(`[${socket.id}] Error in get-latest-chat:`, err);
                socket.emit('latest-chat', { conversationId: null, messages: [] });
            }
        });

        socket.on('get-all-chats', async () => {
            try {
                const userId = socket.userId;
               
                const user = await prisma.user.findUnique({ where: { uuid: userId } });
                if (!user) {
                    socket.emit('all-chats', []);
                    return;
                }
                
                const conversations = await prisma.conversation.findMany({
                    where: {
                        userId: user.id,
                        type: 'chat',
                    },
                    orderBy: { startedAt: 'desc' },
                    include: {
                        messages: { orderBy: { createdAt: 'asc' } },
                    },
                });
                
                const formatted = conversations.map(conv => ({
                    id: conv.id,
                    startedAt: conv.startedAt,
                    endedAt: conv.endedAt,
                    title: conv.title,
                    messages: conv.messages.map(m => ({
                        id: m.id,
                        text: m.content,
                        sender: m.sender,
                        timestamp: m.createdAt,
                    })),
                }));
                socket.emit('all-chats', formatted);
            } catch (err) {
                console.error(`[${socket.id}] Error in get-all-chats:`, err);
                socket.emit('all-chats', []);
            }
        });

        socket.on("disconnect", async () => {
            console.log(`[${socket.id}] User disconnected.`);
            if (currentConversationId && !processedConversations.has(currentConversationId)) {
                processedConversations.add(currentConversationId);
                try {
                    console.log(`[${socket.id}] Ending conversationId: ${currentConversationId}`);
                    await updateConversationEndTime(currentConversationId);
                    console.log(`[${socket.id}] Conversation end time updated.`);
                    (async () => {
                        try {
                            const created = await createMemoryFromConversation(currentConversationId, socket.userId, SUMMARIZE_CONVERSATION_PROMPT);
                            if (created) {
                                console.log(`[${socket.id}] Memory created successfully for conversationId: ${currentConversationId}`);
                            }
                        } catch (err) {
                            console.error(`[${socket.id}] Error creating memory:`, err);
                        }
                    })();
                } catch (err) {
                    console.error(`[${socket.id}] Error ending conversation or summarizing:`, err);
                }
            }
        });
    })
}

function wavToMp3(wavBuffer) {
    const wav = lamejs.WavHeader.readHeader(new DataView(wavBuffer.buffer));
    const samples = new Int16Array(wavBuffer.buffer, 44);
    const mp3enc = new lamejs.Mp3Encoder(1, wav.sampleRate, 128);
    const mp3Data = [];

    let sampleBlockSize = 1152;
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
        let sampleChunk = samples.subarray(i, i + sampleBlockSize);
        let mp3buf = mp3enc.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) mp3Data.push(Buffer.from(mp3buf));
    }

    let endBuf = mp3enc.flush();
    if (endBuf.length > 0) mp3Data.push(Buffer.from(endBuf));

    return Buffer.concat(mp3Data);
}

function float32ToWav(float32Array, sampleRate = 44100) {
    const buffer = new ArrayBuffer(44 + float32Array.length * 2);
    const view = new DataView(buffer);

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    const length = float32Array.length;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return Buffer.from(buffer);
}

function wavToMp3(wavBuffer) {
    const wav = lamejs.WavHeader.readHeader(new DataView(wavBuffer.buffer));
    const samples = new Int16Array(wavBuffer.buffer, 44);
    const mp3enc = new lamejs.Mp3Encoder(1, wav.sampleRate, 128);
    const mp3Data = [];

    let sampleBlockSize = 1152;
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
        let sampleChunk = samples.subarray(i, i + sampleBlockSize);
        let mp3buf = mp3enc.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) mp3Data.push(Buffer.from(mp3buf));
    }

    let endBuf = mp3enc.flush();
    if (endBuf.length > 0) mp3Data.push(Buffer.from(endBuf));

    return Buffer.concat(mp3Data);
}

module.exports = initializeSocket