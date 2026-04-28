"use client";

import { useState } from "react";
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
}

export function AppShell({
  children,
  userName,
  userFirstName,
  userEmail,
  userRole,
  userPlan,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-surface overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          userPlan={userPlan}
        />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="p-0 w-64">
          <AppSidebar
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            userPlan={userPlan}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          userFirstName={userFirstName}
          userPlan={userPlan}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
