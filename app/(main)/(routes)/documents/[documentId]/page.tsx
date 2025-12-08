/**
 * EDITOR PAGE (DOCUMENT VIEW/EDIT)
 *
 * Served at: /documents/[documentId]
 *
 * THE MAIN PAGE of the application.
 * This is where users view and edit a single document.
 *
 * Features:
 * - Rich text editor (Tiptap/BlockNote/similar)
 * - Document title editing
 * - Cover image display
 * - Document metadata (created date, last updated)
 * - Auto-save functionality
 * - Collaboration features (if implemented)
 * - Publish/Share buttons
 * - Nested document tree in sidebar
 * - Tasks sub-section
 *
 * Route params:
 * - documentId: UUID of the document being edited
 *
 * Protected by Clerk (authentication required)
 *
 * Location: app/(main)/(routes)/documents/[documentId]/page.tsx
 */
