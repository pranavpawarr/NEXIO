"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileIcon } from "lucide-react";
import { Item } from "./item"; // We will build this next
import { cn } from "@/lib/utils";

interface DocumentListProps {
  parentDocumentId?: string | null;
  level?: number;
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();

  // State for folders
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  // FETCH: Call your API
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", parentDocumentId],
    queryFn: async () => {
      const res = await fetch(
        `/api/documents?parentDocumentId=${parentDocumentId ?? ""}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>

      {documents?.map((doc: any) => (
        <div key={doc.id}>
          <Item
            id={doc.id}
            onClick={() => onRedirect(doc.id)}
            label={doc.title}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={params.documentId === doc.id}
            level={level}
            onExpand={() => onExpand(doc.id)}
            expanded={expanded[doc.id]}
          />
          {expanded[doc.id] && (
            <DocumentList parentDocumentId={doc.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
