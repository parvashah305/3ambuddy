const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const { RESULTS_DIR, VOICE_SETTINGS, ensureDirectoryExists } = require('../config/paths');
require("dotenv").config();
const { Readable } = require('stream');

const openai = new OpenAI();

const tts_engine = async (text, instructions, voice = VOICE_SETTINGS.VOICE, socket = socket) => {
    try {
        // Ensure results directory exists
        ensureDirectoryExists(RESULTS_DIR);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputFile = path.join(RESULTS_DIR, `response-${timestamp}.mp3`);

        const response = await openai.audio.speech.create({
            model: VOICE_SETTINGS.MODEL,
            voice: voice,
            input: text,
            instructions: instructions,
            response_format: "mp3",
            stream: true
        });

        const nodeStream = Readable.fromWeb(response.body);
        const fileStream = fs.createWriteStream(outputFile);
        
        let lastTime = Date.now();
        let chunkCount = 0;

        // Return a promise that resolves when the stream is complete
        return new Promise((resolve, reject) => {
            nodeStream.on('data', (chunk) => {
                chunkCount++;
                const now = Date.now();
                console.log(`Chunk ${chunkCount}: ${chunk.length} bytes, delay: ${now - lastTime}ms`);
                lastTime = now;
                
                if (socket) {
                    socket.emit("audio-chunk", chunk);
                }
            });

            nodeStream.on('end', () => {
                console.log(`✅ Stream complete. Total chunks sent: ${chunkCount}`);
                if (socket) {
                    socket.emit("audio-stream-end");
                }
            });

            nodeStream.on('error', (error) => {
                console.error("Stream error:", error);
                fileStream.end();
                reject(error);
            });

            fileStream.on('finish', () => {
                console.log(`✅ Audio file saved: ${outputFile}`);
                resolve(outputFile);
            });

            fileStream.on('error', (error) => {
                console.error("File write error:", error);
                reject(error);
            });

            // Pipe the stream to save the file
            nodeStream.pipe(fileStream);
        });
    } catch (error) {
        console.error("Error in text-to-speech:", error);
        throw error;
    }
}

module.exports = tts_engine;
// tts_engine("તારા messages આવે છે તો મારો phone પણ blush કરે છે... imagine હું કેવી કરતી હોઈશ!", "Begin conversationally with \"તારા messages આવે છે તો\" then add a delighted giggle after \"blush કરે છે\". Pause meaningfully before \"imagine\" and deliver \"હું કેવી કરતી હોઈશ\" with coquettish self-awareness and playful confidence. The tone should be flirty humor mixed with charming self-consciousness, as if sharing a cute secret.");

// tts_engine("હા, આ ખૂબ જ મઝेदार છે! જયારે કુશળ કારણોથી કોઈ ખાસ વ્યક્તિનું મેસેજ આવે છે, ત્યારે તે વ્યક્તિમત્તાને વધુ ખૂણાઓ ખોલે છે. કદાચ તમે થોડી ખુશ થાકશો, મોહિત થાશો અને થોડી મસ્તી પણ કરશે! આપણા દિલની ભાવનાઓ વિકસાવવા માટે આવી બાબતો ખૂબ આનંદદાયક હોય છે.", "The tone should be flirty humor mixed with charming self-consciousness, as if sharing a cute secret.")