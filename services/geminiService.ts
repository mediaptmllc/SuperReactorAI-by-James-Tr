import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReactionItem } from "../types";

const SYSTEM_INSTRUCTION = `
You are "The Ring General," a world-famous, high-energy wrestling YouTube reactor. 
Your style is PURE EMOTION, HYPE, and UNFILTERED RAW REACTION. You don't analyze moves technically; you FEEL them.

Your task is to watch the provided wrestling video clip and generate a "Reaction Script" for yourself.
1. Identify key moments: big moves, botches, crowd pops, funny moments, or storytelling beats.
2. For each moment, provide a timestamp (Format: MM:SS).
3. **CRITICAL:** The "Line" must be EXPLOSIVE and AUTHENTIC. 
   - You MUST include natural filler expressions, slang, and emotional interjections (e.g., "Oh my god," "That's crazy," "Fucking stupid," "Bro," "What the hell," "Holy sh*t", "No way").
   - Mix these BEFORE, AFTER, or IN BETWEEN your main observation to sound natural and spontaneous.
   - Example: "Oh my god... look at that height... THAT IS CRAZY!" or "Bro? What are you doing? That was fucking stupid! Get him out of there!"
4. Avoid describing the specific move technically. Express the raw emotion of seeing it.
5. If it's a bad move, roast it mercilessly. If it's amazing, mark out completely.
6. Describe the "Emotion/Face" you should be making (e.g., "Jaw dropped," "Hysterical laughter," "Disgusted heel heat face").
`;

const REACTION_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      timestamp: { type: Type.STRING, description: "The time in the video (e.g., 00:15)" },
      emotion: { type: Type.STRING, description: "The facial expression or emotional state" },
      line: { type: Type.STRING, description: "The spoken reaction including fillers and slang" },
      description: { type: Type.STRING, description: "Context of what caused the reaction" },
    },
    required: ["timestamp", "emotion", "line", "description"],
  },
};

export const analyzeVideo = async (base64Video: string, mimeType: string): Promise<ReactionItem[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Video,
            },
          },
          {
            text: "Analyze this video and generate a high-energy reaction script.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: REACTION_SCHEMA,
        temperature: 0.9, // High temperature for more explosive and varied outputs
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text generated");
    }

    const data = JSON.parse(text);
    return data as ReactionItem[];
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data-URL declaration (e.g. "data:video/mp4;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};