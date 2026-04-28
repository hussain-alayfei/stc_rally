import Link from "next/link";
import {
  Database,
  Shield,
  Users,
  UserCog,
  Globe,
  FileText,
  Heart,
  Wallet,
  CreditCard,
  BarChart3,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Brain,
  Lock,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/cache";

export const dynamic = "force-dynamic";

const iconMap: Record<string, React.ElementType> = {
  "id-card": CreditCard,
  wallet: Wallet,
  "heart-pulse": Heart,
  users: Users,
  "file-text": FileText,
  "bar-chart": BarChart3,
  globe: Globe,
  "user-cog": UserCog,
  shield: Shield,
  "user-check": UserCheck,
};

const categories = [
  {
    id: "A",
    letter: "A",
    nameAr: "فئة A",
    sensitivityLevel: "عالية الأمان",
    descriptionAr: "بيانات شديدة الحساسية تتطلب أعلى مستوى من الحماية.",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    letterBg: "bg-red-100",
    letterColor: "text-red-600",
    badgeBg: "bg-red-100 text-red-700",
    accessBg: "bg-red-50",
    examples: [
      { icon: "id-card", label: "بيانات الهوية" },
      { icon: "wallet", label: "المعلومات المالية" },
      { icon: "heart-pulse", label: "البيانات الصحية" },
    ],
    accessRules: [
      { icon: "user-cog", label: "المدراء التنفيذيون فقط" },
      { icon: "shield", label: "مدير النظام" },
    ],
  },
  {
    id: "B",
    letter: "B",
    nameAr: "فئة B",
    sensitivityLevel: "متوسطة الأمان",
    descriptionAr: "بيانات حساسة تتطلب مستوى متوسط من الحماية.",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    letterBg: "bg-amber-100",
    letterColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-700",
    accessBg: "bg-amber-50",
    examples: [
      { icon: "users", label: "بيانات العملاء" },
      { icon: "file-text", label: "السجلات الداخلية" },
      { icon: "bar-chart", label: "التقارير المالية" },
    ],
    accessRules: [
      { icon: "user-cog", label: "مدراء الأقسام" },
      { icon: "users", label: "الموظفون المصرح لهم" },
    ],
  },
  {
    id: "C",
    letter: "C",
    nameAr: "فئة C",
    sensitivityLevel: "منخفضة الأمان",
    descriptionAr: "بيانات عامة متاحة لعدد أكبر من المستخدمين.",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    letterBg: "bg-green-100",
    letterColor: "text-green-600",
    badgeBg: "bg-green-100 text-green-700",
    accessBg: "bg-green-50",
    examples: [
      { icon: "globe", label: "المحتوى العام" },
      { icon: "file-text", label: "التقارير العامة" },
    ],
    accessRules: [
      { icon: "users", label: "جميع الموظفين" },
      { icon: "user-check", label: "الضيوف المصرح لهم" },
    ],
  },
];

export default async function ClassificationPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: records } = user
    ? await supabase
        .from("data_records")
        .select("category, status, created_at")
        .eq("user_id", user.id)
    : { data: [] };

  const all = records ?? [];
  const total = all.length;
  const counts = {
    A: all.filter((r) => r.category === "A").length,
    B: all.filter((r) => r.category === "B").length,
    C: all.filter((r) => r.category === "C").length,
  };

  const isEmpty = total === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero — dynamic based on data state */}
      {isEmpty ? (
        <div className="bg-gradient-to-bl from-brand-light/50 via-white to-white rounded-2xl p-8 border border-border text-center">
          <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <h1 className="text-xl font-bold mb-2">لا توجد بيانات مصنّفة بعد</h1>
          <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
            ابدأ بإضافة بياناتك عبر المحادثة الذكية وسيتم تصنيفها تلقائياً حسب حساسيتها
          </p>
          <Link
            href="/app/chat"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <Sparkles className="h-5 w-5" />
            ابدأ إضافة البيانات
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-bl from-brand-light/50 via-white to-white rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand" />
                تصنيف البيانات
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {total} سجل مصنّف في {Object.values(counts).filter(c => c > 0).length} فئات
              </p>
            </div>
            <Link
              href="/app/chat"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              إضافة بيانات جديدة
            </Link>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="flex flex-wrap items-center justify-center gap-6 bg-white rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">إجمالي السجلات</p>
            <p className="font-semibold text-sm">{total}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div>
            <p className="text-xs text-muted-foreground">فئة A</p>
            <p className="font-semibold text-sm">{counts.A}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div>
            <p className="text-xs text-muted-foreground">فئة B</p>
            <p className="font-semibold text-sm">{counts.B}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div>
            <p className="text-xs text-muted-foreground">فئة C</p>
            <p className="font-semibold text-sm">{counts.C}</p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">فئات التصنيف</h2>
        <Link href="/app/data" className="text-xs text-brand hover:underline flex items-center gap-1">
          إدارة السجلات <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = counts[cat.id as "A" | "B" | "C"];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <Link
              key={cat.id}
              href={`/app/classification/${cat.id}`}
              className={`${cat.bgColor} ${cat.borderColor} border rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${cat.letterBg} ${cat.letterColor} rounded-xl flex items-center justify-center text-lg font-bold`}>
                  {cat.letter}
                </div>
                <div>
                  <h3 className="font-bold">{cat.nameAr}</h3>
                  <Badge className={`${cat.badgeBg} border-0 text-[10px]`}>{cat.sensitivityLevel}</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{cat.descriptionAr}</p>

              <div className={`${cat.accessBg} rounded-xl p-3 mb-3`}>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{pct}%</p>
                </div>
                <div className="h-1.5 bg-white/60 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.id === "A" ? "#EF4444" : cat.id === "B" ? "#F59E0B" : "#22C55E",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                {cat.examples.map((ex, i) => {
                  const Icon = iconMap[ex.icon] || Shield;
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{ex.label}</span>
                    </div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pipeline */}
      <div className="bg-gradient-to-br from-brand to-brand-hover text-white rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          كيف يعمل التصنيف
        </h2>
        <p className="text-xs text-white/80 mb-4">من الإدخال إلى الحماية تلقائياً</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: MessageSquare, label: "1. إدخال البيانات", desc: "محادثة أو ملف" },
            { icon: Brain, label: "2. تحليل ذكي", desc: "كشف الحقول الحساسة" },
            { icon: Shield, label: "3. تصنيف", desc: "A / B / C" },
            { icon: Lock, label: "4. حماية", desc: "تشفير + صلاحيات" },
          ].map((step, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <step.icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold">{step.label}</p>
              <p className="text-[10px] text-white/70 mt-0.5">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
