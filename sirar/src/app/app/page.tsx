import {
  Database,
  Tags,
  AlertTriangle,
  Users,
  Bell,
  FileText,
  Filter,
  TrendingUp,
  TrendingDown,
  Shield,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { getDisplayName } from "@/lib/supabase/cache";
import { createClient } from "@/lib/supabase/server";
import { DistributionChart, TrendChart } from "./dashboard-charts";

const sourcesData = [
  { name: "قاعدة البيانات الرئيسية", value: 892, color: "#6F4FE8", pct: "84%" },
  { name: "خادم الملفات", value: 512, color: "#3B82F6", pct: "46%" },
  { name: "سحابة الشركة", value: 256, color: "#22C55E", pct: "23%" },
  { name: "التطبيقات الداخلية", value: 128, color: "#F59E0B", pct: "12%" },
  { name: "أخرى", value: 64, color: "#EF4444", pct: "6%" },
];

const reports = [
  { title: "تقرير تصنيف البيانات", date: "21 مايو 2024" },
  { title: "تقرير الوصول والصلاحيات", date: "21 مايو 2024" },
  { title: "تقرير المخاطر والتنبيهات", date: "21 مايو 2024" },
  { title: "تقرير النسخ الاحتياطي", date: "21 مايو 2024" },
];

const protectionStatus = [
  { label: "تشفير", status: "نشط" },
  { label: "النسخ الاحتياطي", status: "محدث" },
  { label: "مراقبة", status: "نشطة" },
  { label: "كشف التهديدات", status: "نشط" },
];

export default async function DashboardPage() {
  const { firstName } = await getDisplayName();
  const supabase = await createClient();

  const [
    { count: totalRecords },
    { count: catACount },
    { count: catBCount },
    { count: catCCount },
    { count: activeAlertCount },
    { data: recentAlerts },
  ] = await Promise.all([
    supabase.from("data_records").select("*", { count: "exact", head: true }),
    supabase.from("data_records").select("*", { count: "exact", head: true }).eq("category", "A"),
    supabase.from("data_records").select("*", { count: "exact", head: true }).eq("category", "B"),
    supabase.from("data_records").select("*", { count: "exact", head: true }).eq("category", "C"),
    supabase.from("alerts").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("alerts").select("title, severity, created_at").eq("status", "active").order("created_at", { ascending: false }).limit(4),
  ]);

  const total = totalRecords ?? 0;
  const catA = catACount ?? 0;
  const catB = catBCount ?? 0;
  const catC = catCCount ?? 0;
  const classified = catA + catB + catC;
  const alerts = activeAlertCount ?? 0;
  const classifiedPct = total > 0 ? ((classified / total) * 100).toFixed(1) : "0";
  const sensitivePct = total > 0 ? ((catA / total) * 100).toFixed(1) : "0";

  const kpis = [
    {
      label: "إجمالي البيانات",
      value: total.toLocaleString(),
      sub: "عنصر",
      change: `${classified.toLocaleString()} مصنف`,
      trend: "up" as const,
      icon: Database,
      color: "text-brand",
      bg: "bg-brand-light",
    },
    {
      label: "البيانات المصنفة",
      value: classified.toLocaleString(),
      sub: "عنصر",
      change: `${classifiedPct}% من إجمالي البيانات`,
      trend: "up" as const,
      icon: Tags,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "البيانات الحساسة (فئة A)",
      value: catA.toLocaleString(),
      sub: "عنصر",
      change: `${sensitivePct}% من إجمالي البيانات`,
      trend: catA > 0 ? "down" as const : "up" as const,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "فئة B (متوسطة)",
      value: catB.toLocaleString(),
      sub: "عنصر",
      change: "حساسية متوسطة",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "التنبيهات النشطة",
      value: alerts.toLocaleString(),
      sub: "تنبيه",
      change: alerts === 0 ? "لا توجد تنبيهات" : `${alerts} تنبيه نشط`,
      trend: alerts > 0 ? "down" as const : "up" as const,
      icon: Bell,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("ar-SA", { day: "numeric", month: "long" });
  const timeStr = now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `منذ ${hrs} ساعة`;
    return `منذ ${Math.floor(hrs / 24)} يوم`;
  }

  const alertsList = (recentAlerts ?? []).map((a) => ({
    title: a.title,
    time: timeAgo(a.created_at),
    severity: a.severity as string,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مرحباً {firstName} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            إليك نظرة شاملة على بياناتك وحمايتها اليوم
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white px-3 py-2 rounded-xl border border-border">
            <RefreshCw className="h-3 w-3" />
            <span>آخر تحديث</span>
            <span className="font-medium text-foreground">{timeStr}</span>
            <span className="font-medium text-foreground">{dateStr}</span>
          </div>
          <button className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-2 rounded-xl border border-border hover:bg-surface transition">
            <Filter className="h-4 w-4" />
            تصفية البيانات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              {kpi.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={kpi.trend === "up" ? "text-green-600" : "text-red-500"}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">توزيع البيانات حسب التصنيف</h3>
            <span className="text-xs text-muted-foreground bg-surface px-2 py-1 rounded-lg">هذا الشهر</span>
          </div>
          <DistributionChart />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">اتجاه البيانات</h3>
            <span className="text-xs text-muted-foreground bg-surface px-2 py-1 rounded-lg">آخر 6 أشهر</span>
          </div>
          <TrendChart />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border">
          <h3 className="font-bold text-sm mb-4">أكثر المصادر تخزيناً للبيانات</h3>
          <div className="space-y-4">
            {sourcesData.map((source) => (
              <div key={source.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{source.name}</span>
                  <span className="font-semibold">{source.value} GB</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: source.pct, backgroundColor: source.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-border">
          <h3 className="font-bold text-sm mb-4">حالة الحماية</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E9E5F2" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#6F4FE8" strokeWidth="8" strokeDasharray={`${2 * Math.PI * 52 * 0.96} ${2 * Math.PI * 52 * 0.04}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold">96%</span>
                  <p className="text-[10px] text-muted-foreground">مستوى الحماية</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {protectionStatus.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium text-green-600">{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">أحدث التنبيهات</h3>
            <Link href="/app/alerts" className="text-xs text-brand hover:underline">عرض الكل</Link>
          </div>
          {alertsList.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">لا توجد تنبيهات نشطة</p>
              <Link href="/app/alerts" className="text-xs text-brand hover:underline mt-1 inline-block">
                تحميل بيانات توضيحية
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {alertsList.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.severity === "high" ? "bg-red-500" : "bg-amber-500"}`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">التقارير السريعة</h3>
            <Link href="/app/reports" className="text-xs text-brand hover:underline">عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {reports.map((report, i) => (
              <Link key={i} href="/app/reports" className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface transition text-xs group">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand" />
                  <span className="font-medium">{report.title}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{report.date}</span>
                  <ChevronLeft className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
