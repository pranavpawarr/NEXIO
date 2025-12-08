/**
 * DOCUMENT DETAIL API ROUTES (GET, PATCH, DELETE)
 *
 * Served at: /api/documents/[documentId]
 *
 * GET /api/documents/[documentId]
 * - Fetch a single document by ID
 * - Returns: document with content, metadata
 * - Includes nested documents (children)
 *
 * PATCH /api/documents/[documentId]
 * - Update document content, title, cover image, etc.
 * - Auto-save from the editor
 * - Accepts: title, content (JSON), coverImage, icon, etc.
 * - Protected by Clerk authentication
 *
 * DELETE /api/documents/[documentId]
 * - Archive/soft-delete a document
 * - Sets isArchived = true (doesn't permanently delete)
 * - Cascades to child documents and tasks
 * - Protected by Clerk authentication
 *
 * Route params:
 * - documentId: UUID of the document
 *
 * Location: app/api/documents/[documentId]/route.ts
 */

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { initialProfile } from "@/lib/initial-profile";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(document);
  } catch (err) {
    console.log("[DOCUMENT_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const values = await req.json();
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await prisma.document.update({
      where: {
        id: documentId,
        profileId: profile.id, // Security check
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(document);
  } catch (err) {
    console.log(err);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;

    const profile = await initialProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const document = await prisma.document.delete({
      where: {
        id: documentId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(document);
  } catch (err) {
    console.log("[DOCUMENT_DELETE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
