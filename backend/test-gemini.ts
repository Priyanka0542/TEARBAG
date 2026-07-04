import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    console.log("Testing Gemini API key...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello, world!',
    });
    console.log("Response:", response.text);
  } catch (error: any) {
    console.error("Failed to generate content:");
    console.error(error.message || error);
    console.error(error.stack);
  }
}
test();
