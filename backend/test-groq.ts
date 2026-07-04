import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });
    console.log("Testing Groq API key...", process.env.GROQ_API_KEY?.substring(0, 5) + '...');
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Hello, world!' }],
    });
    console.log("Response:", response.choices[0]?.message?.content);
  } catch (error: any) {
    console.error("Failed to generate content:");
    console.error(error.message || error);
    console.error(error.stack);
  }
}
test();
