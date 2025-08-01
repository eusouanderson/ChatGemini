import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_VERSION = process.env.GEMINI_VERSION || 'gemini-2.5-pro';

if (!GEMINI_API_KEY || !GEMINI_VERSION) {
  throw new Error('GEMINI_API_KEY not set');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_VERSION });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    throw new Error(`Erro send Gemini API: ${error.message}`);
  }
}
