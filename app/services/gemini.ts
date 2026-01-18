
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Fetches ethical inspirations regarding financial integrity and trust (Amanah).
 * This leverages Gemini 3 Flash to provide users with motivational and ethical guidance.
 */
export const getEthicalInspiration = async (): Promise<string[]> => {
  // Always use the API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Using gemini-3-flash-preview for quick text-based responses
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 3 short, profound ethical quotes or principles about debt, fulfilling trusts (Amanah), and financial honesty. Return them as a JSON array of strings.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    // Access the .text property directly
    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to fetch ethical inspiration from Gemini:", error);
    // Fallback static data if the API fails
    return [
      "Integrity is doing the right thing, even when no one is watching.",
      "The debt of a human is a burden that weighs on the soul until fulfilled.",
      "Amanah (Trust) is the foundation of all righteous dealings."
    ];
  }
};
