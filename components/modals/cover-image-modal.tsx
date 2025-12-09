/**
 * COVER IMAGE MODAL COMPONENT
 *
 * Modal for uploading/selecting a cover image for a document.
 * Triggered by clicking the cover image area in the editor.
 *
 * Features:
 * - File upload input
 * - Image preview
 * - Upload to Edgestore service
 * - Remove cover image option
 * - Save/Cancel buttons
 *
 * Rendered via ModalProvider context.
 * Updates document.coverImage field via API.
 *
 * Location: components/modals/cover-image-modal.tsx
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, // <--- 1. ADD THIS IMPORT
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useDocumentUpdate } from "@/hooks/use-document-update";

export const CoverImageModal = () => {
  const params = useParams();
  const updateDocument = useDocumentUpdate(params.documentId as string);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });

      updateDocument.mutate({
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          {/* 2. USE DialogTitle HERE instead of <h2> */}
          <DialogTitle className="text-center text-lg font-semibold">
            Cover Image
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <input
            type="file"
            disabled={isSubmitting}
            onChange={(e) => onChange(e.target.files?.[0])}
            accept="image/*"
            className="w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100
                "
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
