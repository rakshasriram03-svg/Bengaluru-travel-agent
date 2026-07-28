import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/components/providers/chat-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/toast/toaster";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bengaluru Smart Travel Assistant",
  description:
    "AI-powered travel planning for Bengaluru — live insights, itineraries, and a conversational assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${manrope.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ChatProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </ChatProvider>
      </body>
    </html>
  );
}
