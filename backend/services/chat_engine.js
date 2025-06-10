require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chat_engine = async (message) => {
  if (!message) throw new Error("Message is required");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a friendly and supportive AI friend. Talk casually, like a close buddy.",
      },
      { role: "user", content: message },
    ],
    temperature: 0.8,
  });

  return response.choices[0].message.content;
};

module.exports = chat_engine;