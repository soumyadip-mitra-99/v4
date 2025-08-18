import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface FoodAnalysis {
  category: string;
  freshnessStatus: "fresh" | "moderate" | "urgent";
  servesCount: number;
  carbonSavings: number;
  healthScore: number;
  allergens: string[];
  nutritionalHighlights: string[];
  storageRecommendations: string;
}

export async function analyzeFoodItem(
  title: string,
  description: string,
  userCategory: string
): Promise<FoodAnalysis> {
  try {
    const systemPrompt = `You are a food waste reduction expert and nutritionist. 
Analyze the provided food item and provide detailed categorization and environmental impact assessment.
Consider food safety, nutritional value, and waste reduction potential.

Respond with JSON in this exact format:
{
  "category": "meals|snacks|beverages|baked_goods|fruits_vegetables|dairy|other",
  "freshnessStatus": "fresh|moderate|urgent", 
  "servesCount": number,
  "carbonSavings": number,
  "healthScore": number,
  "allergens": ["allergen1", "allergen2"],
  "nutritionalHighlights": ["highlight1", "highlight2"],
  "storageRecommendations": "storage advice"
}

For carbonSavings, calculate kg CO2 saved based on:
- Average food waste carbon footprint: 2.5kg CO2 per kg food
- Estimate food weight from serving size and description
- Consider food type (meat=higher, vegetables=lower impact)

For freshnessStatus:
- "fresh": Recently prepared, safe for immediate consumption
- "moderate": Good condition but should be consumed soon
- "urgent": Needs immediate consumption to prevent waste

For healthScore: Rate 1-10 based on nutritional value and food safety.`;

    const prompt = `Food Title: ${title}
Description: ${description}
User Suggested Category: ${userCategory}

Please analyze this food item thoroughly.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            category: { type: "string" },
            freshnessStatus: { type: "string" },
            servesCount: { type: "number" },
            carbonSavings: { type: "number" },
            healthScore: { type: "number" },
            allergens: { 
              type: "array",
              items: { type: "string" }
            },
            nutritionalHighlights: {
              type: "array", 
              items: { type: "string" }
            },
            storageRecommendations: { type: "string" }
          },
          required: ["category", "freshnessStatus", "servesCount", "carbonSavings", "healthScore", "allergens", "nutritionalHighlights", "storageRecommendations"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: FoodAnalysis = JSON.parse(rawJson);
      
      // Validate and fallback for critical fields
      if (!["fresh", "moderate", "urgent"].includes(data.freshnessStatus)) {
        data.freshnessStatus = "moderate";
      }
      
      if (!["meals", "snacks", "beverages", "baked_goods", "fruits_vegetables", "dairy", "other"].includes(data.category)) {
        data.category = userCategory as any || "other";
      }
      
      // Ensure reasonable bounds
      data.servesCount = Math.max(1, Math.min(50, data.servesCount || 1));
      data.carbonSavings = Math.max(0.1, Math.min(20, data.carbonSavings || 2.5));
      data.healthScore = Math.max(1, Math.min(10, data.healthScore || 5));
      
      return data;
    } else {
      throw new Error("Empty response from AI model");
    }
  } catch (error) {
    console.error("AI analysis failed:", error);
    
    // Fallback analysis based on basic heuristics
    return {
      category: userCategory as any || "other",
      freshnessStatus: "moderate",
      servesCount: 4,
      carbonSavings: 2.5,
      healthScore: 6,
      allergens: [],
      nutritionalHighlights: ["Contains nutrients"],
      storageRecommendations: "Store in refrigerator and consume within 24 hours",
    };
  }
}
