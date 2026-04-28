"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AppShellProps {
  children: React.ReactNode;
  userName: string;
  userFirstName: string;
  userEmail: string;
  userRole: string;
  userPlan: string;
  alertCount?: number;
}

export function AppShell({
  children,
  userName,
  userFirstName,
  userEmail,
  userRole,
  userPlan,
  alertCount = 0,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isChat = pathname.startsWith("/app/chat");

  return (
    <div className="h-screen flex bg-surface overflow-hidden">
      <div className="hidden lg:block shrink-0">
        <AppSidebar
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          userPlan={userPlan}
          alertCount={alertCount}
        />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="p-0 w-64">
          <AppSidebar
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            userPlan={userPlan}
            alertCount={alertCount}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <AppHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          userFirstName={userFirstName}
          userPlan={userPlan}
          alertCount={alertCount}
        />
        {isChat ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            {children}
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 min-h-0">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}
