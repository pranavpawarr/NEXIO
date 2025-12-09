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
      // 1. UNCOMMENT THIS LINE TO FIX THE "REFRESH NEEDED" BUG
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });

      toast.success("Saved");
    },
    onError: () => {
      toast.error("Failed to save changes");
    },
  });

  return mutation;
};
