"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { SettingsModal } from "@/components/modals/settings-modal";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SIDEBAR_ROUTES } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const showSidebar = SIDEBAR_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <TopNav onMenuClick={() => setMobileNavOpen(true)} />

      <div className="flex min-h-0 flex-1">
        {showSidebar && (
          <aside className="hidden w-64 shrink-0 border-r border-border md:flex md:flex-col">
            <Sidebar />
          </aside>
        )}

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-72 p-0 md:hidden">
            <Sidebar onCloseMobile={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>

      <SettingsModal />
    </div>
  );
}
