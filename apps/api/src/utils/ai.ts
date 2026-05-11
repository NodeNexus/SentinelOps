import { GoogleGenAI } from "@google/genai";

export async function runModel(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "Gemini key not configured. This is a simulated response for local demo.";
  }
  const client = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const response = await client.models.generateContent({ model, contents: prompt });
  return response.text ?? "No response text returned.";
}
