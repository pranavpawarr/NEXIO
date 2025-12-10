import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ documents: [], tasks: [] });
    }
    const documents = await prisma.document.findMany({
      where: {
        profileId: profile.id,
        isArchived: false,
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    const tasks = await prisma.task.findMany({
      where: { userId, isDone: false },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents, tasks });
  } catch (error) {
    console.log("[HOME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
