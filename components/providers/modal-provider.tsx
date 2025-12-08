/**
 * MODAL PROVIDER COMPONENT
 *
 * Provides global modal management context.
 * Allows any component to trigger modals (Settings, Cover Image, etc.)
 * without passing props through the component tree.
 *
 * Features:
 * - Global modal state management
 * - Mount modals from any component
 * - Support for multiple modals
 * - Zustand or React Context for state management
 *
 * Modals managed:
 * - SettingsModal
 * - CoverImageModal
 * - Other action modals
 *
 * Wrapped in root layout.tsx
 *
 * Location: components/providers/modal-provider.tsx
 */
