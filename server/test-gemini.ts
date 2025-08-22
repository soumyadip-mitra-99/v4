// ✅ This is the corrected import path
import { analyzeFoodImage } from "./services/gemini"; 
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ... rest of the test scriptimport { analyzeFoodImage } from "./services/gemini"; // Adjust path if needed
// ✅ Use this modern approach to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  try {
    console.log("🚀 Starting Gemini API test...");

    // 1. Read the image file from your computer
    const imagePath = path.join(__dirname, "test-food.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    // 2. Convert the image to a Base64 string
    const imageBase64 = imageBuffer.toString("base64");

    // 3. Call your analysis function
    console.log("🧠 Analyzing image with Gemini... (this may take a moment)");
    const analysis = await analyzeFoodImage(imageBase64, "image/jpeg");

    // 4. Print the result
    console.log("\n✅ Gemini Analysis Successful!");
    console.log("==============================");
    console.log("Title:", analysis.title);
    console.log("Description:", analysis.description);
    console.log("Category:", analysis.category);
    console.log("Portions:", analysis.portions);
    console.log("Freshness:", analysis.freshnessLevel);
    console.log("==============================");

  } catch (error) {
    console.error("\n❌ Test Failed!");
    console.error(error);
  }
}

runTest();