import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDocumentUpdate = (documentId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (content: {
      title?: string;
      content?: string;
      icon?: string | null;
      coverImage?: string | null;
    }) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    },
    onSuccess: () => {
      // 1. Refresh the Current Document (so the Editor stays synced)
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });

      // 2. THIS FIXES YOUR BUG: Refresh the Sidebar List (so the Title updates there too)
      queryClient.invalidateQueries({ queryKey: ["documents"] });

      // We removed the toast here to avoid spamming "Saved" while typing
    },
    onError: () => {
      toast.error("Failed to save changes");
    },
  });

  return mutation;
};
