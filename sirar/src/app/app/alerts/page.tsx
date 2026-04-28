"use client";

import { AlertTriangle, Shield, CheckCircle, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const alerts = [
  { title: "محاولة وصول غير مصرح بها", description: "تم رصد محاولة وصول من عنوان IP غير معروف إلى بيانات فئة A", severity: "high", time: "منذ 5 دقائق", status: "active" },
  { title: "تحميل بيانات حساسة", description: "تم تحميل ملف يحتوي على بيانات حساسة من قبل مستخدم غير مصرح", severity: "high", time: "منذ 15 دقيقة", status: "active" },
  { title: "تغيير في الصلاحيات", description: "تم تعديل صلاحيات الوصول لمستخدم في فئة B", severity: "medium", time: "منذ ساعة", status: "active" },
  { title: "فشل في النسخ الاحتياطي", description: "فشلت عملية النسخ الاحتياطي التلقائي", severity: "medium", time: "منذ 3 ساعات", status: "resolved" },
  { title: "تسجيل دخول من موقع جديد", description: "تم تسجيل دخول من موقع جغرافي جديد", severity: "low", time: "منذ 5 ساعات", status: "dismissed" },
];

const severityConfig: Record<string, { label: string; color: string; icon: typeof AlertTriangle }> = {
  high: { label: "عالي", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  medium: { label: "متوسط", color: "bg-amber-100 text-amber-700", icon: Shield },
  low: { label: "منخفض", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
};

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            المخاطر والتنبيهات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">متابعة التنبيهات الأمنية والمخاطر المحتملة</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2">
          <Filter className="h-4 w-4" /> فلترة
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const config = severityConfig[alert.severity];
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-border hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert.severity === "high" ? "bg-red-50" : alert.severity === "medium" ? "bg-amber-50" : "bg-blue-50"}`}>
                  <config.icon className={`h-5 w-5 ${alert.severity === "high" ? "text-red-500" : alert.severity === "medium" ? "text-amber-500" : "text-blue-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">{alert.title}</h3>
                    <Badge className={`${config.color} border-0 text-[10px]`}>{config.label}</Badge>
                    {alert.status === "resolved" && <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">تم الحل</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
