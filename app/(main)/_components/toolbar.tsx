"use client";

import { useRef, useState, useEffect } from "react";
import { ImageIcon, Smile, X, Sparkles } from "lucide-react"; // ✅ Added Sparkles
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useDebounce } from "@/hooks/use-debounce";
import { useDocumentUpdate } from "@/hooks/use-document-update";
import { useAIChat } from "@/hooks/use-ai-chat"; // ✅ Added import

interface ToolbarProps {
  initialData: {
    id: string;
    title: string;
    icon?: string | null;
    coverImage?: string | null;
  };
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const updateDocument = useDocumentUpdate(initialData.id);
  const coverImage = useCoverImage();
  const aiChat = useAIChat(); // ✅ Initialize the hook

  const [value, setValue] = useState(initialData.title);
  const [isEditing, setIsEditing] = useState(false);

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (debouncedValue !== initialData.title) {
      updateDocument.mutate({ title: debouncedValue });
    }
  }, [debouncedValue]);

  const onRemoveIcon = () => {
    updateDocument.mutate({ icon: null });
  };

  const onIconSelect = (icon: string) => {
    updateDocument.mutate({ icon });
  };

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <p className="text-6xl hover:opacity-75 transition">
            {initialData.icon}
          </p>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-xs text-muted-foreground"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <Button
            onClick={() => onIconSelect("👋")}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <Smile className="h-4 w-4 mr-2" />
            Add icon
          </Button>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
        {/* ✅ AI Chat Button */}
        {!preview && (
          <Button
            onClick={aiChat.onOpen}
            className="text-xs bg-purple-50/50 hover:bg-purple-100 text-purple-600 border-purple-200"
            variant="outline"
            size="sm"
          >
            <Sparkles className="h-3 w-3 mr-2" />
            Ask AI
          </Button>
        )}
      </div>

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setIsEditing(false);
            }
          }}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none w-full"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {value}
        </div>
      )}
    </div>
  );
};
