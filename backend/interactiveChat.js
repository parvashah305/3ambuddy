const chatEngine = require('./services/chat_engine')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat() {
  try {
    readline.question('You: ', async (message) => {
      if (message.toLowerCase() === 'exit') {
        readline.close();
        return;
      }
      
      const response = await chatEngine(message);
      console.log(`AI: ${response}\n`);
      chat(); // Repeat
    });
  } catch (error) {
    console.error("Error:", error.message);
    readline.close();
  }
}

console.log("Type your message (or 'exit' to quit):");
chat();