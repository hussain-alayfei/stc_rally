import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ChevronLeft,
  Shield,
  Users,
  UserCheck,
  UserCog,
  Lock,
  Database,
  Inbox,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/cache";

export const dynamic = "force-dynamic";

const categoryMeta: Record<
  string,
  {
    letter: string;
    nameAr: string;
    level: string;
    color: string;
    bg: string;
    borderColor: string;
    letterBg: string;
    letterColor: string;
    badgeBg: string;
    description: string;
    accessRules: { icon: React.ElementType; label: string }[];
  }
> = {
  A: {
    letter: "A",
    nameAr: "فئة A",
    level: "عالية الأمان",
    color: "#EF4444",
    bg: "bg-red-50",
    borderColor: "border-red-200",
    letterBg: "bg-red-100",
    letterColor: "text-red-600",
    badgeBg: "bg-red-100 text-red-700",
    description: "بيانات شديدة الحساسية تتطلب أعلى مستوى من الحماية.",
    accessRules: [
      { icon: UserCog, label: "المدراء التنفيذيون فقط" },
      { icon: Shield, label: "مدير النظام" },
    ],
  },
  B: {
    letter: "B",
    nameAr: "فئة B",
    level: "متوسطة الأمان",
    color: "#F59E0B",
    bg: "bg-amber-50",
    borderColor: "border-amber-200",
    letterBg: "bg-amber-100",
    letterColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-700",
    description: "بيانات حساسة تتطلب مستوى متوسط من الحماية.",
    accessRules: [
      { icon: UserCog, label: "مدراء الأقسام" },
      { icon: Users, label: "الموظفون المصرح لهم" },
    ],
  },
  C: {
    letter: "C",
    nameAr: "فئة C",
    level: "منخفضة الأمان",
    color: "#22C55E",
    bg: "bg-green-50",
    borderColor: "border-green-200",
    letterBg: "bg-green-100",
    letterColor: "text-green-600",
    badgeBg: "bg-green-100 text-green-700",
    description: "بيانات عامة متاحة لعدد أكبر من المستخدمين.",
    accessRules: [
      { icon: Users, label: "جميع الموظفين" },
      { icon: UserCheck, label: "الضيوف المصرح لهم" },
    ],
  },
};

const typeLabels: Record<string, string> = {
  personal: "شخصية",
  financial: "مالية",
  medical: "صحية",
  contact: "اتصال",
};

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const catKey = category.toUpperCase();
  const cat = categoryMeta[catKey];
  if (!cat) redirect("/app/classification");

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: records } = await supabase
    .from("data_records")
    .select("id, name, email, phone, data_type, status, created_at")
    .eq("user_id", user.id)
    .eq("category", catKey)
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = records ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb + Back */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/app/classification" className="text-brand hover:underline">
          فئات البيانات
        </Link>
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{cat.nameAr}</span>
      </div>

      {/* Category Header */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${cat.letterBg} ${cat.letterColor} rounded-xl flex items-center justify-center text-xl font-bold`}>
          {cat.letter}
        </div>
        <div>
          <h1 className="text-xl font-bold">{cat.nameAr} — {cat.level}</h1>
          <p className="text-sm text-muted-foreground">{cat.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-6 bg-white rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5" style={{ color: cat.color }} />
          <div>
            <p className="text-xs text-muted-foreground">مستوى الأمان</p>
            <p className="font-semibold text-sm">{cat.level}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">عدد السجلات</p>
            <p className="font-semibold text-sm">{rows.length} سجل</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {rows.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">لا توجد سجلات في {cat.nameAr}</p>
              <p className="text-xs text-muted-foreground mb-4">أضف بيانات جديدة عبر المحادثة الذكية</p>
              <Link
                href="/app/chat"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                إضافة بيانات
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-muted-foreground border-b border-border">
                  <th className="text-start p-3 font-medium">الاسم</th>
                  <th className="text-start p-3 font-medium">النوع</th>
                  <th className="text-start p-3 font-medium">البريد</th>
                  <th className="text-start p-3 font-medium">الجوال</th>
                  <th className="text-start p-3 font-medium">الحالة</th>
                  <th className="text-start p-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3 text-muted-foreground">{typeLabels[r.data_type] || r.data_type}</td>
                    <td className="p-3 text-muted-foreground text-xs" dir="ltr">{r.email || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs" dir="ltr">{r.phone || "—"}</td>
                    <td className="p-3">
                      <Badge className={`text-[10px] border-0 ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {r.status === "active" ? "نشط" : r.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {new Date(r.created_at).toLocaleDateString("ar-SA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-brand" />
              <h3 className="font-bold text-sm">من يمكنه الوصول؟</h3>
            </div>
            <div className="space-y-2">
              {cat.accessRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <rule.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-light rounded-2xl p-5 border border-brand-muted">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-brand" />
              <h3 className="font-bold text-sm">الحماية المطبّقة</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {catKey === "A"
                ? "تشفير AES-256 + إخفاء كامل + وصول مقيّد"
                : catKey === "B"
                  ? "تشفير في النقل + تسجيل الوصول + إخفاء جزئي"
                  : "تسجيل الوصول فقط"}
            </p>
          </div>

          <Link
            href="/app/chat"
            className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors w-full"
          >
            <MessageSquare className="h-4 w-4" />
            إضافة بيانات جديدة
          </Link>
        </div>
      </div>
    </div>
  );
}
