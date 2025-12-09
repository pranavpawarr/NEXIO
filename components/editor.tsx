"use client";

import { useTheme } from "next-themes";
import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const parsedContent = useCreateBlockNote({
    initialContent: initialContent
      ? typeof initialContent === "string"
        ? (JSON.parse(initialContent) as PartialBlock[]) // If string, parse it
        : (initialContent as unknown as PartialBlock[]) // If already object, use it
      : undefined,
  });

  if (!parsedContent) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="-mx-[54px] my-4 bg-white dark:bg-[#1F1F1F] p-4">
      <BlockNoteView
        editor={parsedContent}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
        onChange={() => {
          onChange(JSON.stringify(parsedContent.document));
        }}
      />
    </div>
  );
};

export default Editor;
