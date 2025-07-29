const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { SUMMARIZE_CONVERSATION_PROMPT } = require('../config/prompts');
const send_to_gpt = require('./send_to_gpt');
const { getConversationMessages } = require('../crud/message');
const { upsertMemory, getMemoryByConversationId } = require('../crud/memory');

async function summarizeConversation(messages) {
    const conversationText = messages.map(
        msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n');

    const prompt = SUMMARIZE_CONVERSATION_PROMPT.replace('{conversation}', conversationText);

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful assistant that summarizes conversations.' },
            { role: 'user', content: prompt }
        ],
    });

    return completion.choices[0].message.content.trim();
}

async function createMemoryFromConversation(conversationId, userId, systemPrompt) {

    const messages = await getConversationMessages(conversationId);

    const conversationText = messages.map(
        msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n');

    const llmResponse = await send_to_gpt(conversationText, systemPrompt);

    let title = 'Summary for call on ' + new Date().toLocaleString();
    let summary = llmResponse;
    try {
        const parsed = JSON.parse(llmResponse);
        if (parsed.title) title = parsed.title;
        if (parsed.summary) summary = parsed.summary;
    } catch (e) {
        // fallback: use raw response as summary
    }

    await upsertMemory({
        userId,
        conversationId,
        summary,
        title
    });
    return true;
}

module.exports = { summarizeConversation, createMemoryFromConversation }; 