import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    console.log("--- STARTING CALENDAR SYNC ---");
    const { userId } = await auth();
    const { taskId } = await params;

    if (!userId) {
      console.log("❌ No User ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Get Task
    const task = await prisma.task.findUnique({
      where: { id: taskId, userId },
    });

    if (!task) {
      console.log("❌ Task not found in DB");
      return new NextResponse("Task not found", { status: 404 });
    }

    // 2. Get Token
    console.log("🔄 Fetching Google Token from Clerk...");
    const client = await clerkClient();
    const tokenResponse = await client.users.getUserOauthAccessToken(
      userId,
      "oauth_google"
    );

    const token = tokenResponse.data[0]?.token;

    if (!token) {
      console.log(
        "❌ No Token received from Clerk. Response:",
        JSON.stringify(tokenResponse.data)
      );
      return new NextResponse(
        "Google Calendar permission missing. Sign out and Sign in again.",
        { status: 403 }
      );
    }
    console.log("✅ Token received!");

    // 3. Send to Google
    console.log("🔄 Sending to Google Calendar...");
    const event = {
      summary: task.content,
      description: `Priority: ${task.priority}. Created via Nexio.`,
      start: {
        date: new Date().toISOString().split("T")[0],
      },
      end: {
        date: new Date().toISOString().split("T")[0],
      },
    };

    const gRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!gRes.ok) {
      const errorText = await gRes.text();
      console.error("❌ Google API Error:", errorText);
      return new NextResponse(`Google Error: ${errorText}`, { status: 500 });
    }

    const gData = await gRes.json();
    console.log("✅ Event Created! ID:", gData.id);

    // 4. Save ID
    await prisma.task.update({
      where: { id: taskId },
      data: { calendarEventId: gData.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 CRITICAL SERVER ERROR:", error);
    return new NextResponse(`Internal Error: ${error.message}`, {
      status: 500,
    });
  }
}
