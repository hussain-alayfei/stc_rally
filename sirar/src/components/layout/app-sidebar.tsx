"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { sidebarNav, type NavItem } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const roleLabels: Record<string, string> = {
  admin: "مدير النظام",
  manager: "مدير القسم",
  user: "موظف",
};

interface AppSidebarProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  userPlan?: string;
  navItems?: NavItem[];
  alertCount?: number;
  onClose?: () => void;
}

export function AppSidebar({
  userName = "مستخدم",
  userEmail = "",
  userRole = "user",
  userPlan = "free",
  navItems,
  alertCount = 0,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items = navItems || sidebarNav;
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-64 h-full bg-white border-s border-border flex flex-col">
      <div className="p-5 border-b border-border">
        <Logo size="default" href="/app" />
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          const isAlerts = item.href === "/app/alerts";
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              prefetch
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                active
                  ? "bg-brand-light text-brand scale-[1.02]"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground hover:translate-x-[-2px]"
              )}
            >
              {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand rounded-s-full animate-fade-in" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  active && "scale-110"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isAlerts && alertCount > 0 && (
                <span className="min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {roleLabels[userRole] ?? userRole}
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تسجيل الخروج</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-2 sm:flex-row-reverse">
                <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                >
                  {loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {userPlan === "free" && (
          <div className="mt-3 flex items-center gap-2 bg-brand-light rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] text-brand">✨</span>
            <span className="text-[11px] text-brand font-medium">
              خطة تجريبية — 14 يوماً متبقية
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
