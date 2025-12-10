"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Trash, Undo, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // 1. Fetch Archived Docs
  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents-trash"],
    queryFn: async () => {
      const res = await fetch("/api/documents/trash");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  // 2. Restore Document
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: false }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Note restored");
      queryClient.invalidateQueries({ queryKey: ["documents"] }); // Update Sidebar
      queryClient.invalidateQueries({ queryKey: ["documents-trash"] }); // Update Trash list
    },
    onError: () => toast.error("Failed to restore"),
  });

  // 3. Delete Forever
  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success("Note deleted forever");
      queryClient.invalidateQueries({ queryKey: ["documents-trash"] });
      if (params.documentId) router.push("/home");
    },
    onError: () => toast.error("Failed to delete"),
  });

  // Filter Logic
  const filteredDocuments = documents?.filter((doc: any) => {
    return doc.title.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>

        {filteredDocuments?.map((doc: any) => (
          <div
            key={doc.id}
            role="button"
            onClick={() => onClick(doc.id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between p-2 group"
          >
            <span className="truncate pl-2">{doc.title}</span>
            <div className="flex items-center">
              {/* RESTORE BUTTON */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  restoreMutation.mutate(doc.id);
                }}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              {/* DELETE FOREVER BUTTON */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const confirm = window.confirm(
                    "Are you sure? This cannot be undone."
                  );
                  if (confirm) removeMutation.mutate(doc.id);
                }}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Trash className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
