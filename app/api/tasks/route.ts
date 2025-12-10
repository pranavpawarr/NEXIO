import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");
  const { userId } = await auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const whereClause: any = {
    userId,
  };

  if (documentId) {
    whereClause.documentId = documentId;
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { document: true },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, priority } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    let inboxDoc = await prisma.document.findFirst({
      where: {
        profileId: profile.id,
        title: "Inbox",
        isArchived: false,
      },
    });

    if (!inboxDoc) {
      const workspace = await prisma.workspace.findFirst({
        where: { profileId: profile.id },
      });

      if (!workspace)
        return new NextResponse("No Workspace found", { status: 400 });

      inboxDoc = await prisma.document.create({
        data: {
          title: "Inbox",
          profileId: profile.id,
          workspaceId: workspace.id,
          content: "[]",
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        content,
        priority: priority || "MEDIUM",
        isDone: false,
        userId,
        documentId: inboxDoc.id,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASK_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
