/**
 * APP LAYOUT (PROTECTED DASHBOARD)
 *
 * This layout wraps all protected application routes (the dashboard).
 * Serves as the main container for authenticated users.
 *
 * Routes served: /documents, /documents/123, and all sub-routes
 * Protected by Clerk middleware.
 *
 * Components:
 * - Sidebar navigation (resizable)
 * - Mobile navbar with hamburger toggle
 * - Main content area
 *
 * Authentication check happens here via Clerk middleware.
 */
