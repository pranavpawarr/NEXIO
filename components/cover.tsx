"use client";

import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { useDocumentUpdate } from "@/hooks/use-document-update";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react"; // 1. Import useState

interface CoverProps {
  url?: string | null;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const updateDocument = useDocumentUpdate(params.documentId as string);

  // 2. Local state to track if image is loading
  const [isImageLoading, setIsImageLoading] = useState(true);

  const isValidUrl = (urlString?: string | null) => {
    try {
      return Boolean(urlString && new URL(urlString));
    } catch (e) {
      return false;
    }
  };

  const onRemove = async () => {
    if (url && isValidUrl(url)) {
      await edgestore.publicFiles.delete({
        url: url,
      });
    }
    updateDocument.mutate({ coverImage: null });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {/* 3. SHOW SKELETON WHILE LOADING */}
      {!!url && isImageLoading && (
        <Skeleton className="absolute w-full h-full z-10" />
      )}

      {!!url && isValidUrl(url) && (
        <Image
          src={url}
          fill
          alt="Cover"
          className="object-cover"
          // 4. HIDE SKELETON WHEN LOADED
          onLoad={() => setIsImageLoading(false)}
        />
      )}

      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 z-20">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
