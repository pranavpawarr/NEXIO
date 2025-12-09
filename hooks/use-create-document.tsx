import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({
      title,
      parentDocumentId,
    }: {
      title: string;
      parentDocumentId?: string;
    }) => {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: JSON.stringify({ title, parentDocumentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // 1. FORCE REFRESH: This tells React Query "The list of documents is dirty, fetch it again"
      queryClient.invalidateQueries({ queryKey: ["documents"] });

      // 2. UI Feedback
      toast.success("New note created!");

      // 3. Expand the parent in the sidebar (if nested) - Optional Logic could go here
    },
    onError: () => {
      toast.error("Failed to create new note");
    },
  });

  return mutation;
};
