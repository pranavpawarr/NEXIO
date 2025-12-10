import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useArchiveDocument = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to archive");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });

      toast.success("Note moved to trash");
    },
    onError: () => {
      toast.error("Failed to archive note");
    },
  });

  return mutation;
};
