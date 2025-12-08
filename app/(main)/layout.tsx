"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && !isSignedIn) {
    return redirect("/");
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        {/* Simple spinner */}
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
