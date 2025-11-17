
import { GoogleGenAI } from "@google/genai";
import { ActivityType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateIcebreaker = async (activity: ActivityType): Promise<string> => {
  if (!API_KEY) {
    return "AI is sleeping... Looks like the API key is missing!";
  }

  try {
    const prompt = `Generate a short, fun, and engaging icebreaker question for a group of friends who are currently enjoying a virtual hangout. They are focused on ${activity.toLowerCase()}. The question should be one sentence.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating icebreaker:", error);
    return "Couldn't think of anything witty... maybe ask 'what's everyone's favorite snack?'";
  }
};
