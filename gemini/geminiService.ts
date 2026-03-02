import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "-",
  apiVersion: "v1",
});

type GeminiResponse = {
  CurrentState: string;
  Recomendation: string;
};

export async function callGeminiAndParse(
  prompt: string
): Promise<GeminiResponse | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini response is undefined");
    }

    // Clean up markdown block if present (e.g. ```json ... ```)
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    // Parse the JSON string returned by Gemini
    const parsed: GeminiResponse = JSON.parse(cleanedText);

    return parsed;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return undefined;
  }
}
