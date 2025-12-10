"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useMemo } from "react"; // Import useMemo

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  // ROBUST PARSING LOGIC using useMemo
  // This prevents the "Error creating document" crash
  const blocks = useMemo(() => {
    if (!initialContent) return undefined;

    try {
      // 1. If it's already an object/array (Prisma JSON type)
      if (typeof initialContent === "object") {
        return initialContent as unknown as PartialBlock[];
      }

      // 2. If it's a string, parse it
      const parsed = JSON.parse(initialContent);

      // 3. Check if it's a valid array with items
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as PartialBlock[];
      }

      // 4. If empty array [], return undefined so BlockNote creates default paragraph
      return undefined;
    } catch (e) {
      console.error("Failed to parse editor content:", e);
      return undefined; // Fallback to empty doc
    }
  }, [initialContent]);

  const editor = useCreateBlockNote({
    initialContent: blocks,
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="bg-white dark:bg-[#1F1F1F]">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
        onChange={() => {
          onChange(JSON.stringify(editor.document));
        }}
        className="pl-[54px] pr-[54px]"
      />
    </div>
  );
};

export default Editor;
