"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
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
        ? (JSON.parse(initialContent) as PartialBlock[])
        : (initialContent as unknown as PartialBlock[])
      : undefined,
  });

  if (!parsedContent) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="bg-white dark:bg-[#1F1F1F]">
      <BlockNoteView
        editor={parsedContent}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
        onChange={() => {
          onChange(JSON.stringify(parsedContent.document));
        }}
        className="pl-[54px] pr-[54px]"
      />
    </div>
  );
};

export default Editor;
