import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import "./globals.css";
import "@blocknote/mantine/style.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { AIChatModal } from "@/components/modals/ai-chat-modal";
// 1. IMPORT THIS
import { SearchCommand } from "@/components/search-command";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexio",
  description: "The connected workspace where better, faster work happens.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <QueryProvider>
            <EdgeStoreProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster position="bottom-center" />
                <SearchCommand />

                <CoverImageModal />
                <AIChatModal />

                {children}
              </ThemeProvider>
            </EdgeStoreProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
