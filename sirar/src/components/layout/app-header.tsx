"use client";

import { Search, Bell, Menu, Bot, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onMenuClick?: () => void;
  userName?: string;
  userFirstName?: string;
  userPlan?: string;
}

export function AppHeader({
  onMenuClick,
  userName = "",
  userFirstName = "",
  userPlan = "free",
}: AppHeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 gap-4">
      {/* Right — title + mobile menu */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">تجربة النظام</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              {userPlan === "free" ? "الخطة التجريبية" : "SIRAR Plus ✨"}
            </p>
          </div>
        </div>
      </div>

      {/* Center — search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في البيانات والتقارير..."
            className="ps-10 bg-surface border-0 rounded-xl h-10 w-full"
          />
        </div>
      </div>

      {/* Left — info chips */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Protection indicator */}
        <div className="hidden xl:flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
          <Shield className="h-3.5 w-3.5" />
          <span>96% مستوى الحماية</span>
        </div>

        {/* Date/time */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-surface px-3 py-1.5 rounded-xl">
          <span className="font-medium text-foreground">{timeStr}</span>
          <span className="text-border">|</span>
          <span>{dateStr}</span>
        </div>

        {/* Notifications bell */}
        <button className="relative p-2 rounded-xl hover:bg-surface transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
