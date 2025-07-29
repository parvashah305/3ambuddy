const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

const send_to_gpt = async (text, systemPrompt = null, temperature = 0.7) => {
    try {
        const messages = [];
        
        if (systemPrompt) {
            messages.push({ role: "system", content: systemPrompt });
        }
        
        messages.push({ role: "user", content: text });
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: temperature
        });
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error in send_to_gpt:", error);
        throw error;
    }
};

module.exports = send_to_gpt;

// (async () => {
//     try {
//         const result = await send_to_gpt("તારા messages આવે છે તો મારો phone પણ blush કરે છે... imagine હું કેવી કરતી હોઈશ!");
//         console.log(result);
//     } catch (error) {
//         console.error("Error in example usage:", error);
//     }
// })();