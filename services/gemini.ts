
import { GoogleGenAI, Type } from "@google/genai";

const FALLBACK_QUOTES = [
  "Honor your word as you would honor your most precious possession.",
  "Integrity is doing the right thing, even when no one is watching.",
  "The debt of a human is a burden that weighs on the soul until fulfilled.",
  "Amanah (Trust) is the foundation of all righteous dealings.",
  "Transparency in financial dealings preserves the sanctity of relationships."
];

/**
 * Fetches ethical inspirations regarding financial integrity and trust (Amanah).
 * Sanitizes input to handle common AI markdown formatting issues.
 */
export const getEthicalInspiration = async (): Promise<string[]> => {
  // Always use a new GoogleGenAI instance with the latest API_KEY from process.env
  if (!process.env.API_KEY || process.env.API_KEY === 'PLACEHOLDER_API_KEY') {
    return FALLBACK_QUOTES;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 5 short, profound ethical quotes or principles about debt, fulfilling trusts (Amanah), and financial honesty. These should be motivational and encourage integrity. Return them as a plain JSON array of strings. Do not include markdown formatting.",
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

    let jsonStr = response.text || "";
    
    // Cleanup: Remove potential markdown code blocks if the model ignored the "plain" instruction
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    
    if (!jsonStr) return FALLBACK_QUOTES;
    
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : FALLBACK_QUOTES;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return FALLBACK_QUOTES;
  }
};
