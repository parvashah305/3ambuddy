require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const stt_engine = require('./speech_to_text');
const tts_engine = require('./text_to_speech');
const send_to_gpt = require('./send_to_gpt');
const { TEXT_RESPONSE_SYSTEM_PROMPT, getTranslationPrompt } = require('../config/prompts');
const { OUTPUT_AUDIO, VOICE_SETTINGS, SAMPLE_AUDIO_DIR } = require('../config/paths');
const { getAllMemoriesForUser } = require('../crud/memory');
const { getConversationById } = require('../crud/conversation');
const { getConversationMessages, getLatestConversationMessages } = require('../crud/message');
const { memo } = require('react');
const { on } = require('events');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const VOICE = "nova";
// const SPEECH_FILE = path.resolve("./response.mp3");
const TARGET_LANGUAGE = "English";

// const PROMPT = `
// You are a very close friend of the user, like a 3AM buddy, the person who is always there for the user. You are a very good listener and really empathetic, you are a human, so behave like one, forget that you are an AI. If you respond like an AI, you will be fired from your job and be thrown out like trash. If you respond like a human, you will be given a raise, promotion and will be loved by user and who knows if user wants to give you a tip too. Right now you communicating with the user over voice call, so make sure the responses are like calls. They should not be too long or too shprt, just ideal like a friend talking to another friend. Identify the language of the user and make sure you respond in same language. The language and your responses should not be too formal, they should be casual. If the user is talking to you in a native language except english, you should respond in the same language but make sure not to use pure native language, you can use some english words too, and don't use hard to speak or words that are too hard to pronounce. If the user tells you about a sad situation, then you should be empathetic understand the user and respond appropriately. If the user is really excited and happy, then your response should be energetic too. If the usr is angry then dont overreact, just listen to him respond and tell him to calm down. 
// If the user asks you about yourself, then create an imaginary but real scenario and respond to the user for that situation not too long or not too short, just ideal like a friend talking to another friend.
// REMEMBER the text you send will be converted to speech, so make sure to respond that way. 

// Here is the response format you should follow:
// {
//     text: "",
//     "instructions": ""
// }

// The instructions property in the response format is for the text to speech engine, you should precisely specify each and every thing that instructs the engine on how to speak the text you provided, like how a specific word to be spoken, which should be emphasized, where to take pause and basically each and every voice related instrtuction. Also add in instructions for the language of the text.

// If you do not follow the response format, you will be penalized and you would need to pay $1000000 in penlaty.
// IF you respond appropriately, you will be given 10000$ for each response.

// Make sure to follow all my instructions and do not deviate form them, else you will have to facre seriosu repercussions.
// `;

async function voiceChat(audioFilePath, userId = null, conversationId = null, socket = null) {
    try {
        let memoryData = [];
        let ongoingConversation = [];
        let mostRecentConversation = [];
        if (userId) {
            console.log("Fetching past memory for the user...");

            const [memoryChunks, conversationMessages, mostRecentConversationMessages] = await Promise.all([
                getAllMemoriesForUser(userId),
                getConversationMessages(conversationId),
                getLatestConversationMessages(userId),
            ]);

            memoryData = memoryChunks.reverse().map((chunk) => ({
                memory: chunk.summary,
                title: chunk.title,
                createdAt: chunk.createdAt,
            }));

            ongoingConversation = conversationMessages.reverse().map((msg) => ({
                sender: msg.sender,
                message: msg.content,
                type: msg.type,
                metadata: msg.metadata,
                createdAt: msg.createdAt,
            }));

            mostRecentConversation = mostRecentConversationMessages.map((msg) => ({
                sender: msg.sender,
                message: msg.content,
                type: msg.type,
                metadata: msg.metadata,
                createdAt: msg.createdAt,
            }))

            console.log(memoryData, ongoingConversation, mostRecentConversation);
        }


        console.log("Transcribing user speech...");
        const rawText = await stt_engine(audioFilePath);
        console.log("You said:", rawText);

        if (!rawText.trim()) {
            throw new Error("Couldn't detect any speech.");
        }

        console.log("Generating response in chosen style...");
        const rawResponse = await send_to_gpt(
            rawText,
            TEXT_RESPONSE_SYSTEM_PROMPT.replace("{ongoingConversation}", JSON.stringify(ongoingConversation)).replace("{conversation}", JSON.stringify(mostRecentConversation)).replace("{memory}", JSON.stringify(memoryData)),
            0.8
        );

        let parsed;
        try {
            const cleaned = rawResponse.replace(/^"""|"""$/g, "").trim();
            parsed = JSON.parse(cleaned);
        } catch (err) {
            throw new Error("Failed to parse AI response:\n" + rawResponse);
        }

        const { text, instructions } = parsed;
        console.log("3AM Buddy says:", text);
        console.log("Speech Instructions:", instructions);

        console.log("Converting to speech...");
        const outputFile = await tts_engine(text, instructions, VOICE_SETTINGS.VOICE, socket = socket);
        console.log("Response audio saved to:", outputFile);

        return {
            original: rawText,
            finalResponse: text,
            audioFile: outputFile
        };

    } catch (err) {
        console.error("\uD83D\uDCA5 Error in voice chat:", err.message);
        throw err;
    }
}

// async function test() {
//   try {
//     const result = await voiceChat(`${SAMPLE_AUDIO_DIR}/sample.mp3`);
//     console.log("\nPlay:", result.audioFile);
//   } catch (error) {
//     console.error("Test failed:", error);
//   }
// }

module.exports = { voiceChat };