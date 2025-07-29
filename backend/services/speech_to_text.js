require('dotenv').config();
const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const stt_engine = async (audioPath) => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: 'gpt-4o-mini-transcribe',
            task: "transcribe"
        });
        return transcription.text;
    } catch (error) {
        console.error("Error in speech-to-text:", error);
        throw error;
    }
}

module.exports = stt_engine;

// (async () => {
//   try {
//     const result = await stt_engine("./speech.mp3");
//     console.log("Transcription:", result);
//   } catch (error) {
//     console.error("Failed to process audio:", error);
//   }
// })();