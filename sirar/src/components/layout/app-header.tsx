"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Menu, Bot, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AppHeaderProps {
  onMenuClick?: () => void;
  userName?: string;
  userFirstName?: string;
  userPlan?: string;
  alertCount?: number;
}

export function AppHeader({
  onMenuClick,
  userPlan = "free",
  alertCount = 0,
}: AppHeaderProps) {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const now = new Date();
    setDateStr(
      now.toLocaleDateString("en-SA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
    setTimeStr(
      now.toLocaleTimeString("en-SA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  }, []);

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 gap-4">
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
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">سرار</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              {userPlan === "free" ? "الخطة التجريبية" : "SIRAR Plus"}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في البيانات والتقارير..."
            className="ps-10 bg-surface border-0 rounded-xl h-9 w-full text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden xl:flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
          <Shield className="h-3 w-3" />
          <span>96%</span>
        </div>

        {dateStr && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-lg" dir="ltr">
            <span className="font-medium text-foreground">{timeStr}</span>
            <span className="text-border">|</span>
            <span>{dateStr}</span>
          </div>
        )}

        <Link href="/app/alerts" className="relative p-2 rounded-xl hover:bg-surface transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {alertCount > 0 && (
            <span className="absolute top-1 end-1 min-w-[16px] h-[16px] bg-red-500 rounded-full ring-2 ring-white flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">{alertCount > 9 ? "9+" : alertCount}</span>
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
