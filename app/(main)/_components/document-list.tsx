/**
 * DOCUMENT LIST COMPONENT (RECURSIVE)
 *
 * Recursively renders the tree structure of documents.
 * Shows parent documents with expandable/collapsible children.
 *
 * Features:
 * - Recursive nesting for parent-child relationships
 * - Expand/collapse toggles
 * - Icons for document types
 * - Drag-and-drop for reorganizing (optional)
 * - Context menu for actions (Delete, Rename, etc.)
 *
 * Props:
 * - documents: Array of document objects
 * - parentId: Parent document ID to filter children
 * - onSelect: Handler when user clicks a document
 *
 * Location: app/(main)/_components/document-list.tsx
 */
