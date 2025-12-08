"use client";

import { useScrollTop } from "@/lib/use-scroll-top"; // We will create this hook in a second
import { cn } from "@/lib/utils";
import { Logo } from "./logo"; // We will create this too
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  const scrolled = useScrollTop();
  const { isSignedIn } = useAuth();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {/* If we wanted a login button here, we'd add it. 
             But you asked to move it to the center button. 
             So we keep this empty or just for the Logo. */}
      </div>
    </div>
  );
};
