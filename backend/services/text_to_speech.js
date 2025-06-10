const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();
const speechFile = path.resolve("./speech.mp3");

const tts_engine = async (text, instructions, voice="sage")=>{

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice,
      input: text,
      instructions: instructions,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
}

module.exports = tts_engine;
// tts_engine("તારા messages આવે છે તો મારો phone પણ blush કરે છે... imagine હું કેવી કરતી હોઈશ!", "Begin conversationally with \"તારા messages આવે છે તો\" then add a delighted giggle after \"blush કરે છે\". Pause meaningfully before \"imagine\" and deliver \"હું કેવી કરતી હોઈશ\" with coquettish self-awareness and playful confidence. The tone should be flirty humor mixed with charming self-consciousness, as if sharing a cute secret.");