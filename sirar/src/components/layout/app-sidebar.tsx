"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { sidebarNav, type NavItem } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  onClose?: () => void;
}

export function AppSidebar({
  userName = "مستخدم",
  userEmail = "",
  userRole = "user",
  userPlan = "free",
  navItems,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items = navItems || sidebarNav;

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
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-64 h-full bg-white border-s border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Logo size="default" href="/app" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
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
              {item.badge && (
                <span className="text-red-500 text-sm leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
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
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="h-4 w-4" />
          </button>
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
