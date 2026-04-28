"use client";

import { FileText, Download, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reports = [
  { title: "تقرير تصنيف البيانات", type: "تصنيف", date: "21 مايو 2024", status: "ready" },
  { title: "تقرير الوصول والصلاحيات", type: "صلاحيات", date: "21 مايو 2024", status: "ready" },
  { title: "تقرير المخاطر والتنبيهات", type: "أمان", date: "21 مايو 2024", status: "ready" },
  { title: "تقرير النسخ الاحتياطي", type: "نسخ", date: "21 مايو 2024", status: "ready" },
  { title: "تقرير الامتثال الشهري", type: "امتثال", date: "20 مايو 2024", status: "generating" },
  { title: "تقرير تحليل السلوك", type: "تحليل", date: "19 مايو 2024", status: "ready" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand" />
            التقارير
          </h1>
          <p className="text-muted-foreground text-sm mt-1">جميع التقارير المتاحة للنظام</p>
        </div>
        <Button className="bg-brand hover:bg-brand-hover rounded-xl gap-2">
          <FileText className="h-4 w-4" />
          إنشاء تقرير جديد
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-brand" />
              </div>
              <Badge className={`${report.status === "ready" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} border-0 text-xs`}>
                {report.status === "ready" ? "جاهز" : "قيد الإنشاء"}
              </Badge>
            </div>
            <h3 className="font-bold text-sm mb-1">{report.title}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
              <Calendar className="h-3 w-3" />
              {report.date}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs gap-1">
                <Eye className="h-3 w-3" /> عرض
              </Button>
              <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs gap-1">
                <Download className="h-3 w-3" /> تحميل
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
