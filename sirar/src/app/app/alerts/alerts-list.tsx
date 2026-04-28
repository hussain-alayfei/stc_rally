"use client";

import { useState, useTransition } from "react";
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  Check,
  X,
  Loader2,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resolveAlert, dismissAlert } from "@/lib/actions";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  status: "active" | "resolved" | "dismissed";
  created_at: string;
}

const severityConfig: Record<
  string,
  { label: string; color: string; icon: typeof AlertTriangle; bg: string; iconColor: string }
> = {
  high: {
    label: "عالي",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    bg: "bg-red-50",
    iconColor: "text-red-500",
  },
  medium: {
    label: "متوسط",
    color: "bg-amber-100 text-amber-700",
    icon: Shield,
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  low: {
    label: "منخفض",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}

export function AlertsList({ initial }: { initial: Alert[] }) {
  const [filter, setFilter] = useState<"all" | "active" | "resolved" | "dismissed">("all");
  const [pending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);

  const filtered = initial.filter((a) => filter === "all" || a.status === filter);

  function handleResolve(id: string) {
    setActingId(id);
    startTransition(async () => {
      await resolveAlert(id);
      setActingId(null);
    });
  }

  function handleDismiss(id: string) {
    setActingId(id);
    startTransition(async () => {
      await dismissAlert(id);
      setActingId(null);
    });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-1 bg-white rounded-xl border border-border p-1 w-fit">
        {[
          { id: "all", label: "الكل" },
          { id: "active", label: "نشط" },
          { id: "resolved", label: "تم الحل" },
          { id: "dismissed", label: "مُتجاهل" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.id
                ? "bg-brand text-white shadow-sm"
                : "text-muted-foreground hover:bg-surface"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border text-center py-16 px-4">
          <Inbox className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium">
            {initial.length === 0
              ? "لا توجد تنبيهات حتى الآن"
              : "لا توجد تنبيهات في هذا التصنيف"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {initial.length === 0
              ? "اضغط على زر «تحميل بيانات توضيحية» لمشاهدة عينة من التنبيهات"
              : "جرّب فلتراً آخر"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const config = severityConfig[alert.severity];
            const isActing = actingId === alert.id;
            return (
              <div
                key={alert.id}
                className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-all animate-fade-in"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}
                  >
                    <config.icon className={`h-5 w-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-sm">{alert.title}</h3>
                      <Badge className={`${config.color} border-0 text-[10px]`}>
                        {config.label}
                      </Badge>
                      {alert.status === "resolved" && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">
                          تم الحل
                        </Badge>
                      )}
                      {alert.status === "dismissed" && (
                        <Badge className="bg-gray-100 text-gray-700 border-0 text-[10px]">
                          مُتجاهل
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo(alert.created_at)}
                    </div>
                  </div>
                  {alert.status === "active" && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(alert.id)}
                        disabled={isActing || pending}
                        className="h-8 rounded-lg text-xs gap-1 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                      >
                        {isActing ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        حل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismiss(alert.id)}
                        disabled={isActing || pending}
                        className="h-8 rounded-lg text-xs gap-1 hover:bg-surface"
                      >
                        <X className="h-3 w-3" />
                        تجاهل
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
