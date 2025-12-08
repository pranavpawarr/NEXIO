import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export default async function MarketingPage() {
  const { userId } = await auth();

  // If already logged in, go to dashboard
  if (userId) {
    redirect("/documents");
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10 dark:bg-[#1F1F1F]">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
          Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
          <span className="underline decoration-primary">Nexio</span>
        </h1>
        <h3 className="text-base sm:text-xl md:text-2xl font-medium">
          Nexio is the connected workspace where <br />
          better, faster work happens.
        </h3>

        <div className="flex items-center justify-center gap-x-2">
          {/* The Login Button is now here */}
          <SignInButton mode="modal">
            <Button size="lg" className="font-bold">
              Enter Nexio
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
