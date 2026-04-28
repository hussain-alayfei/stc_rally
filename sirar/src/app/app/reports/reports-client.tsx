"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  FileText,
  Download,
  Eye,
  Shield,
  AlertTriangle,
  BarChart3,
  X,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LazyCharts = dynamic(() => import("./report-charts"), { ssr: false });

interface Props {
  totalRecords: number;
  categoryCounts: { A: number; B: number; C: number };
  alertsByStatus: { active: number; resolved: number };
  alertsBySeverity: { high: number; medium: number; low: number };
  totalAlerts: number;
  timeline: { date: string; count: number }[];
  recentRecords: { name: string; category: string; type: string; date: string }[];
  recentAlerts: { title: string; severity: string; status: string; date: string }[];
  permissions: { role: string; category: string; canView: boolean; canExport: boolean; canModify: boolean }[];
}

const categoryColors: Record<string, string> = {
  A: "bg-red-100 text-red-700",
  B: "bg-amber-100 text-amber-700",
  C: "bg-green-100 text-green-700",
};

const severityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

const severityLabels: Record<string, string> = {
  high: "عالي",
  medium: "متوسط",
  low: "منخفض",
};

const roleLabels: Record<string, string> = {
  admin: "مدير",
  manager: "مسؤول",
  user: "مستخدم",
};

const typeLabels: Record<string, string> = {
  personal: "شخصية",
  financial: "مالية",
  medical: "صحية",
  contact: "اتصال",
};

export function ReportsClient({
  totalRecords,
  categoryCounts,
  alertsByStatus,
  alertsBySeverity,
  totalAlerts,
  timeline,
  recentRecords,
  recentAlerts,
  permissions,
}: Props) {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  function exportCSV(name: string, headers: string[], rows: string[][]) {
    const csv =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const reports = [
    {
      id: "classification",
      title: "تقرير تصنيف البيانات",
      icon: Shield,
      iconBg: "bg-brand-light",
      iconColor: "text-brand",
      stat: `${totalRecords} سجل`,
      description: `A: ${categoryCounts.A} | B: ${categoryCounts.B} | C: ${categoryCounts.C}`,
      onExport: () =>
        exportCSV(
          "classification",
          ["الاسم", "التصنيف", "النوع", "التاريخ"],
          recentRecords.map((r) => [r.name, `فئة ${r.category}`, typeLabels[r.type] || r.type, r.date])
        ),
    },
    {
      id: "alerts",
      title: "تقرير المخاطر والتنبيهات",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      stat: `${totalAlerts} تنبيه`,
      description: `نشط: ${alertsByStatus.active} | محلول: ${alertsByStatus.resolved}`,
      onExport: () =>
        exportCSV(
          "alerts",
          ["العنوان", "الخطورة", "الحالة", "التاريخ"],
          recentAlerts.map((a) => [a.title, severityLabels[a.severity] || a.severity, a.status === "active" ? "نشط" : "محلول", a.date])
        ),
    },
    {
      id: "permissions",
      title: "تقرير الصلاحيات",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      stat: `${permissions.length} قاعدة`,
      description: "مصفوفة صلاحيات الأدوار والفئات",
      onExport: () =>
        exportCSV(
          "permissions",
          ["الدور", "الفئة", "عرض", "تصدير", "تعديل"],
          permissions.map((p) => [roleLabels[p.role] || p.role, `فئة ${p.category}`, p.canView ? "نعم" : "لا", p.canExport ? "نعم" : "لا", p.canModify ? "نعم" : "لا"])
        ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand" />
          التقارير
        </h1>
        <p className="text-muted-foreground text-sm mt-1">تقارير تفاعلية مبنية على بياناتك الفعلية</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-brand" />
            <span className="text-xs text-muted-foreground">إجمالي السجلات</span>
          </div>
          <p className="text-2xl font-bold">{totalRecords}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-muted-foreground">التنبيهات النشطة</span>
          </div>
          <p className="text-2xl font-bold">{alertsByStatus.active}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">تم الحل</span>
          </div>
          <p className="text-2xl font-bold">{alertsByStatus.resolved}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">فئة A (حساسة)</span>
          </div>
          <p className="text-2xl font-bold">{categoryCounts.A}</p>
        </div>
      </div>

      {/* Charts */}
      {totalRecords > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-border">
            <h3 className="font-bold text-sm mb-4">توزيع التصنيفات</h3>
            <LazyCharts type="pie" categoryCounts={categoryCounts} />
          </div>
          <div className="bg-white rounded-2xl p-5 border border-border">
            <h3 className="font-bold text-sm mb-4">البيانات المضافة</h3>
            {timeline.length > 0 ? (
              <LazyCharts type="line" timeline={timeline} />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">لا توجد بيانات كافية</p>
            )}
          </div>
        </div>
      )}

      {/* Report Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl p-5 border border-border hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${report.iconBg} rounded-xl flex items-center justify-center`}>
                <report.icon className={`h-5 w-5 ${report.iconColor}`} />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">محدّث</Badge>
            </div>
            <h3 className="font-bold text-sm mb-1">{report.title}</h3>
            <p className="text-lg font-bold text-brand mb-0.5">{report.stat}</p>
            <p className="text-[11px] text-muted-foreground mb-4">{report.description}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-xs gap-1"
                onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
              >
                <Eye className="h-3 w-3" /> عرض
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-xs gap-1"
                onClick={report.onExport}
              >
                <Download className="h-3 w-3" /> تحميل
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Report Detail */}
      {expandedReport && (
        <div className="bg-white rounded-2xl p-6 border border-border animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">
              {reports.find((r) => r.id === expandedReport)?.title}
            </h3>
            <button onClick={() => setExpandedReport(null)} className="p-1 hover:bg-surface rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>

          {expandedReport === "classification" && (
            <div className="overflow-x-auto">
              {recentRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">لا توجد سجلات</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-border text-muted-foreground">
                      <th className="text-start p-3 font-medium">الاسم</th>
                      <th className="text-start p-3 font-medium">التصنيف</th>
                      <th className="text-start p-3 font-medium">النوع</th>
                      <th className="text-start p-3 font-medium">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="p-3 font-medium">{r.name}</td>
                        <td className="p-3">
                          <Badge className={`${categoryColors[r.category]} border-0 text-xs`}>فئة {r.category}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{typeLabels[r.type] || r.type}</td>
                        <td className="p-3 text-muted-foreground text-xs">{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {expandedReport === "alerts" && (
            <div className="overflow-x-auto">
              {recentAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">لا توجد تنبيهات</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-border text-muted-foreground">
                      <th className="text-start p-3 font-medium">التنبيه</th>
                      <th className="text-start p-3 font-medium">الخطورة</th>
                      <th className="text-start p-3 font-medium">الحالة</th>
                      <th className="text-start p-3 font-medium">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAlerts.map((a, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="p-3 font-medium text-xs">{a.title}</td>
                        <td className="p-3">
                          <Badge className={`${severityColors[a.severity]} border-0 text-xs`}>{severityLabels[a.severity] || a.severity}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={`border-0 text-xs ${a.status === "active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {a.status === "active" ? (
                              <><Clock className="h-3 w-3 me-1 inline" />نشط</>
                            ) : (
                              <><CheckCircle className="h-3 w-3 me-1 inline" />محلول</>
                            )}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground text-xs">{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {expandedReport === "permissions" && (
            <div className="overflow-x-auto">
              {permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">لا توجد صلاحيات مسجلة</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-border text-muted-foreground">
                      <th className="text-start p-3 font-medium">الدور</th>
                      <th className="text-start p-3 font-medium">الفئة</th>
                      <th className="text-center p-3 font-medium">عرض</th>
                      <th className="text-center p-3 font-medium">تصدير</th>
                      <th className="text-center p-3 font-medium">تعديل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((p, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="p-3 font-medium">{roleLabels[p.role] || p.role}</td>
                        <td className="p-3">
                          <Badge className={`${categoryColors[p.category]} border-0 text-xs`}>فئة {p.category}</Badge>
                        </td>
                        <td className="p-3 text-center">{p.canView ? "✅" : "❌"}</td>
                        <td className="p-3 text-center">{p.canExport ? "✅" : "❌"}</td>
                        <td className="p-3 text-center">{p.canModify ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
