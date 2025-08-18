import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface FoodAnalysis {
  category: string;
  freshnessLevel: "fresh" | "good" | "consume_soon";
  portions: number;
  confidence: number;
  title: string;
  description: string;
  safetyAssessment: string;
}

export async function analyzeFoodImage(imageBase64: string, mimeType: string): Promise<FoodAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: { 
              type: "string",
              enum: ["meal", "snack", "beverage", "dessert", "produce", "baked_goods"]
            },
            freshnessLevel: {
              type: "string", 
              enum: ["fresh", "good", "consume_soon"]
            },
            portions: { type: "number" },
            confidence: { type: "number" },
            safetyAssessment: { type: "string" }
          },
          required: ["title", "description", "category", "freshnessLevel", "portions", "confidence", "safetyAssessment"]
        } as any
      }
    });

    const prompt = `Analyze this food image and provide:
    1. A concise, appetizing title (e.g. "Fresh Garden Salad", "Homemade Chocolate Cookies")
    2. A brief description mentioning key ingredients/characteristics
    3. Category: meal, snack, beverage, dessert, produce, or baked_goods
    4. Freshness level: fresh (excellent condition), good (safe to eat), consume_soon (eat within hours)
    5. Estimated number of servings/portions
    6. Confidence score (0-1) in your analysis
    7. Safety assessment noting any concerns or "Safe for consumption"
    
    Focus on food safety and accurate categorization for a campus food sharing platform.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      },
      prompt
    ]);

    const response = await result.response;
    const analysis = JSON.parse(response.text());
    
    return analysis;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to analyze food image");
  }
}

export async function generateFoodRecommendations(userPreferences: string[]): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `Based on these food preferences: ${userPreferences.join(", ")}, 
    suggest 5 specific food items that someone might want to share on a campus food platform. 
    Return only a JSON array of food names, like ["Vegetarian Pasta Salad", "Fresh Fruit Bowl", etc.]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
    return [];
  }
}
