import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return NextResponse.json([]);

    const documents = await prisma.document.findMany({
      where: {
        profileId: profile.id,
        isArchived: false,
      },
      select: {
        id: true,
        title: true,
        icon: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
