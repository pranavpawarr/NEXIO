// Run this with: node check-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load .env file

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env");
    return;
  }

  console.log(
    "🔑 Using API Key starting with:",
    apiKey.substring(0, 5) + "..."
  );

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // This connects directly to Google to ask "What models can I use?"
    // We use a specific fetch to the API list endpoint if the SDK fails,
    // but let's try the SDK method first if available, or just a raw fetch.

    console.log("📡 Contacting Google AI...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log("\n✅ AVAILABLE MODELS:");
    const models = data.models || [];

    // Filter for generateContent supported models
    const chatModels = models.filter((m) =>
      m.supportedGenerationMethods.includes("generateContent")
    );

    chatModels.forEach((m) => {
      console.log(`   - ${m.name.replace("models/", "")}`);
    });

    console.log("\n👉 Copy one of the names above into your route.ts file!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
