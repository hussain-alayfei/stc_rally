"use client";

import { Database, Search, Filter, Download, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const records = [
  { name: "أحمد محمد", type: "شخصية", category: "A", status: "active", date: "2024-05-21" },
  { name: "سارة خالد", type: "شخصية", category: "B", status: "active", date: "2024-05-20" },
  { name: "محمد عبدالله", type: "مالية", category: "A", status: "flagged", date: "2024-05-19" },
  { name: "فاطمة علي", type: "شخصية", category: "C", status: "active", date: "2024-05-18" },
  { name: "خالد إبراهيم", type: "مالية", category: "B", status: "archived", date: "2024-05-17" },
];

const categoryColors: Record<string, string> = {
  A: "bg-red-100 text-red-700",
  B: "bg-amber-100 text-amber-700",
  C: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "نشط", color: "bg-green-100 text-green-700" },
  flagged: { label: "مُعلّم", color: "bg-red-100 text-red-700" },
  archived: { label: "مؤرشف", color: "bg-gray-100 text-gray-700" },
};

export default function DataPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-brand" />
            البيانات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">إدارة جميع البيانات المدخلة في النظام</p>
        </div>
        <Button className="bg-brand hover:bg-brand-hover rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          إضافة بيانات
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث في البيانات..." className="ps-10 rounded-xl bg-white" />
        </div>
        <Button variant="outline" className="rounded-xl gap-2 text-sm">
          <Filter className="h-4 w-4" /> فلترة
        </Button>
        <Button variant="outline" className="rounded-xl gap-2 text-sm">
          <Download className="h-4 w-4" /> تصدير
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border text-muted-foreground">
              <th className="text-start p-3 font-medium">الاسم</th>
              <th className="text-start p-3 font-medium">النوع</th>
              <th className="text-start p-3 font-medium">التصنيف</th>
              <th className="text-start p-3 font-medium">الحالة</th>
              <th className="text-start p-3 font-medium">التاريخ</th>
              <th className="text-start p-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-muted-foreground">{r.type}</td>
                <td className="p-3">
                  <Badge className={`${categoryColors[r.category]} border-0 text-xs`}>فئة {r.category}</Badge>
                </td>
                <td className="p-3">
                  <Badge className={`${statusLabels[r.status].color} border-0 text-xs`}>{statusLabels[r.status].label}</Badge>
                </td>
                <td className="p-3 text-muted-foreground">{r.date}</td>
                <td className="p-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
