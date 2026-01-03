// const GEMINI_API_KEY = "AIzaSyCRr5x5jVd_xy1szIJOZtljrnPnwqZBgA4";

// export async function callGemini(prompt: string): Promise<string> {
//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: "user",
//               parts: [{ text: prompt }],
//             },
//           ],
//           generationConfig: {
//             temperature: 0.4,
//             maxOutputTokens: 1024,
//           },
//         }),
//       }
//     );

//     const data = await response.json();

//     // 🔍 LOG FULL RESPONSE FOR DEBUG
//     console.log("Gemini raw response:", JSON.stringify(data, null, 2));

//     // ❌ API-level error
//     if (data.error) {
//       throw new Error(data.error.message);
//     }

//     // ❌ No candidates returned
//     if (!data.candidates || data.candidates.length === 0) {
//       throw new Error(
//         "Gemini returned no candidates (possibly blocked by safety)"
//       );
//     }

//     return data.candidates[0].content.parts[0].text;
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw error;
//   }
// }

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCRr5x5jVd_xy1szIJOZtljrnPnwqZBgA4",
  apiVersion: "v1",
});

export async function callGemini(prompt: string): Promise<string | undefined> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
}
