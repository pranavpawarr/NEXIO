"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Toolbar } from "../../../../../app/(main)/_components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useDocumentUpdate } from "@/hooks/use-document-update";

export default function DocumentIdPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  const updateDocument = useDocumentUpdate(documentId);

  // Dynamic Editor Import
  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor"), {
        ssr: false,
        loading: () => (
          <p className="pl-[54px] text-muted-foreground text-sm">
            Loading Editor...
          </p>
        ),
      }),
    []
  );

  const {
    data: document,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${documentId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 0, // Data is immediately considered old
    refetchOnMount: true, // Always refetch when visiting page
    refetchOnWindowFocus: false, // Optional: prevents flicker when alt-tabbing
  });

  const [content, setContent] = useState<string | undefined>(undefined);
  const debouncedContent = useDebounce(content, 1000);

  // 2. SYNC SERVER DATA TO LOCAL STATE
  useEffect(() => {
    if (document && !isLoading && !isRefetching) {
      setContent(document.content);
    }
  }, [document, isLoading, isRefetching]);

  // 3. AUTO-SAVE LOGIC
  useEffect(() => {
    // Block saving if data isn't ready
    if (debouncedContent === undefined || document === undefined) return;

    // Block saving if we are currently fetching new data (Prevents overwrite race conditions)
    if (isRefetching || isLoading) return;

    // Save only if different
    if (debouncedContent !== document.content) {
      updateDocument.mutate({ content: debouncedContent });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  if (isLoading || isRefetching || document === undefined) {
    return (
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
        <div className="space-y-4 pl-8 pt-4">
          <Skeleton className="h-14 w-[50%]" />
          <div className="flex gap-x-2">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <div className="pt-4 space-y-2">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        </div>
      </div>
    );
  }

  // 5. RENDER THE EDITOR (Only happens when data is fresh)
  return (
    <div className="pb-40">
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor
          key={documentId}
          onChange={setContent}
          initialContent={document.content}
        />
      </div>
    </div>
  );
}
