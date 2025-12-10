"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  Search,
  Settings,
  Trash,
  Moon,
  Sun,
  Home,
  CheckSquare,
  Briefcase,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useCreateDocument } from "@/hooks/use-create-document";
import { useSearch } from "@/hooks/use-search";
import { TrashBox } from "./trash-box";

export const Navigation = () => {
  const router = useRouter();
  const search = useSearch();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const createDocument = useCreateDocument();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobile) collapse();
    else resetWidth();
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) collapse();
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = () => {
    createDocument.mutate(
      { title: "Untitled" },
      {
        onSuccess: (data) => {
          router.push(`/documents/${data.id}`);
        },
      }
    );
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-[#FBFBFA] dark:bg-[#1F1F1F] overflow-y-auto relative flex w-60 flex-col z-[40]",
          "border-r border-neutral-200 dark:border-neutral-700",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <div>
          <UserItem />
        </div>

        {/* SYSTEM MENU */}
        <div className="mt-4">
          <Item
            label="Search"
            icon={Search}
            isSearch
            onClick={search.onOpen} // <--- Add this!
          />{" "}
          <Item
            label="Home"
            icon={Home}
            onClick={() => router.push("/home")}
            active={pathname === "/home"}
          />
          <Item
            label="Tasks"
            icon={CheckSquare}
            onClick={() => router.push("/tasks")}
            active={pathname === "/tasks"}
          />
          <Item label="Settings" icon={Settings} onClick={() => {}} />
        </div>

        {/* WORKSPACES SECTION (Placeholder for now, no dummy data) */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
              Workspaces
            </span>
            <div
              role="button"
              onClick={() => toast("Workspaces coming in Phase 8!")}
              className="opacity-0 group-hover/sidebar:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-0.5"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {/* We will render real workspaces here later. Empty for now to avoid confusion. */}
          <div className="flex flex-col">
            <Item label="Personal" icon={Briefcase} onClick={() => {}} active />
          </div>
        </div>

        {/* PAGES SECTION */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
              Pages
            </span>
            <div
              role="button"
              onClick={handleCreate}
              className="opacity-0 group-hover/sidebar:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-0.5"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <DocumentList />

          <Item onClick={handleCreate} icon={Plus} label="Add a page" />

          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-0 w-72 bg-white dark:bg-[#1F1F1F]" // Added bg color fix
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        {/* THEME TOGGLE */}
        <div className="mt-auto p-3">
          {mounted && (
            <div
              role="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-x-2 p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm font-medium text-muted-foreground cursor-pointer transition"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
          )}
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 right-0 top-0 bg-primary/10"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[50] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {isCollapsed && (
          <nav className="bg-transparent px-3 py-2 w-full">
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          </nav>
        )}
      </div>
    </>
  );
};
