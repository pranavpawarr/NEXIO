import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { tasks, lat, lng } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { headers: { "User-Agent": "Nexio-App" } }
    );

    const geoData = await geoRes.json();
    const address = geoData.display_name || "Unknown Location";

    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are a smart personal assistant.
      
      USER LOCATION: ${address}
      
      TASK LIST:
      ${JSON.stringify(tasks)}
      
      INSTRUCTION:
      Re-order this list based on what is most convenient or urgent to do AT THE USER'S CURRENT LOCATION.
      - If a task matches the location (e.g. "Buy milk" and user is at "Grocery Store"), put it FIRST.
      - If no tasks match the location, sort by Priority (HIGH -> LOW).
      
      Return the exact same JSON list, but re-ordered.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sortedTasks = JSON.parse(response.text());

    return NextResponse.json(sortedTasks);
  } catch (error: any) {
    console.error("[REORDER_ERROR]", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
