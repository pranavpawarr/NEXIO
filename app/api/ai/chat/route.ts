import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, context } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return new NextResponse("API Key Missing", { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`
      Context: ${JSON.stringify(context).substring(0, 5000)}
      Question: ${prompt}
      Answer (in markdown):
    `);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return new NextResponse(`AI Error: ${error.message}`, { status: 500 });
  }
}
