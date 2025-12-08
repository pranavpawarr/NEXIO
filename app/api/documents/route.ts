/**
 * DOCUMENTS API ROUTES (GET, POST)
 *
 * Served at: /api/documents
 *
 * GET /api/documents
 * - Fetch all documents for the current user
 * - Returns a hierarchical tree structure for the sidebar
 * - Filters by profileId (current user)
 *
 * POST /api/documents
 * - Create a new document
 * - Accepts: title, workspaceId, parentDocumentId (optional)
 * - Returns: new document object with UUID
 * - Protected by Clerk authentication
 *
 * Database calls use Prisma to query the documents table.
 *
 * Location: app/api/documents/route.ts
 */

import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { initialProfile } from "@/lib/initial-profile";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, parentDocumentId } = body;

    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // in future , can pass workspace id from frontend if multiple
    const workspaceId = profile.workspaces[0].id;

    if (!workspaceId) {
      console.log("no workspace id");
      return new NextResponse("No workspace id", { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        title: title || "Untitled",
        parentDocument: parentDocumentId || null,
        profileId: profile.id,
        workspaceId: workspaceId,
        isArchived: false,
        isPublished: false,
      },
    });
    return NextResponse.json(document);
  } catch (err) {
    console.log("[DOCUMENT_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentDocumentId = searchParams.get("parentDocumentId");
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: {
        profileId: profile.id,
        parentDocumentId: parentDocumentId || null,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(documents);
  } catch (err) {
    console.log(err);
  }
}
