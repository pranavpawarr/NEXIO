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
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });

      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => {
      toast.error("Failed to save changes");
    },
  });

  return mutation;
};
