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
