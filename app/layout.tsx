import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import "./globals.css";
import "@blocknote/mantine/style.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { CoverImageModal } from "@/components/modals/cover-image-modal";

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
              <Toaster position="bottom-center" />

              {/* 2. PLACE IT HERE (Must be inside Body) */}
              <CoverImageModal />

              {children}
            </EdgeStoreProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
