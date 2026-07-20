import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/components/providers/chat-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/toast/toaster";

export const metadata: Metadata = {
  title: "Bengaluru Smart Travel Assistant",
  description:
    "AI-powered travel planning for Bengaluru — live insights, itineraries, and a conversational assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <ChatProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </ChatProvider>
      </body>
    </html>
  );
}
