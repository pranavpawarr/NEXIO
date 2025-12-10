"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";

interface Document {
  id: string;
  title: string;
  icon?: string;
}

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  // Prevent Hydration Error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listen for CTRL+K / CMD+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  // Fetch ALL documents for search
  // (In a real app with 1000s of docs, you'd search via API. For <100 docs, client-side is faster)
  const { data: documents } = useQuery<Document[]>({
    queryKey: ["documents-search"],
    queryFn: async () => {
      // Reuse the sidebar endpoint but without parentId to get flat list if possible,
      // OR create a new endpoint /api/search.
      // For simplicity, let's assume /api/home returns the top docs, but let's just make a specific search endpoint to be clean.
      const res = await fetch("/api/documents/search");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s Jotion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((doc) => (
            <CommandItem
              key={doc.id}
              value={`${doc.id}-${doc.title}`}
              title={doc.title}
              onSelect={() => onSelect(doc.id)}
            >
              {doc.icon ? (
                <span className="mr-2 text-[18px]">{doc.icon}</span>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
