"use client";

import { ClipboardList, Clock, User, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const logs = [
  { action: "تسجيل دخول", user: "سارة أحمد", target: "النظام", time: "10:30 AM", date: "21 مايو 2024", ip: "192.168.1.1" },
  { action: "عرض بيانات فئة A", user: "سارة أحمد", target: "سجل #1234", time: "10:32 AM", date: "21 مايو 2024", ip: "192.168.1.1" },
  { action: "تصدير تقرير", user: "أحمد محمد", target: "تقرير التصنيف", time: "10:45 AM", date: "21 مايو 2024", ip: "192.168.1.5" },
  { action: "تعديل صلاحيات", user: "سارة أحمد", target: "مستخدم خالد", time: "11:00 AM", date: "21 مايو 2024", ip: "192.168.1.1" },
  { action: "إنشاء مفتاح API", user: "محمد عبدالله", target: "مفتاح جديد", time: "11:15 AM", date: "21 مايو 2024", ip: "192.168.1.8" },
];

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-brand" />
          سجل العمليات
        </h1>
        <p className="text-muted-foreground text-sm mt-1">تتبع جميع العمليات والأنشطة في النظام</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border text-muted-foreground">
              <th className="text-start p-3 font-medium">الإجراء</th>
              <th className="text-start p-3 font-medium">المستخدم</th>
              <th className="text-start p-3 font-medium">الهدف</th>
              <th className="text-start p-3 font-medium">الوقت</th>
              <th className="text-start p-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand" />
                    <span className="font-medium">{log.action}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {log.user}
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{log.target}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{log.time}</span>
                    <span className="text-xs">· {log.date}</span>
                  </div>
                </td>
                <td className="p-3">
                  <Badge className="bg-surface text-muted-foreground border-0 text-xs font-mono" dir="ltr">{log.ip}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
