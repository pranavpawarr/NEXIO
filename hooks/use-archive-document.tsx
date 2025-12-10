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
      // 1. FORCE REFRESH SIDEBAR
      queryClient.invalidateQueries({ queryKey: ["documents"] });

      // 2. Redirect if we are currently on the deleted page
      // (Optional logic, but good UX)

      toast.success("Note moved to trash");
    },
    onError: () => {
      toast.error("Failed to archive note");
    },
  });

  return mutation;
};
