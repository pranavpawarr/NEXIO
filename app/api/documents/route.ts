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
