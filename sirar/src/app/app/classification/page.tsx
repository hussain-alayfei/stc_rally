import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Database,
  Shield,
  Users,
  UserCog,
  Globe,
  FileText,
  Folder,
  Heart,
  Wallet,
  CreditCard,
  BarChart3,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Brain,
  Lock,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const iconMap: Record<string, React.ElementType> = {
  "id-card": CreditCard,
  wallet: Wallet,
  "heart-pulse": Heart,
  users: Users,
  "file-text": FileText,
  "bar-chart": BarChart3,
  globe: Globe,
  folder: Folder,
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
    descriptionAr:
      "بيانات شديدة الحساسية تتطلب أعلى مستوى من الحماية والتقييد في الوصول.",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    letterBg: "bg-red-100",
    letterColor: "text-red-600",
    badgeBg: "bg-red-100 text-red-700",
    accessBg: "bg-red-50",
    examples: [
      { icon: "id-card", label: "بيانات الهوية الشخصية" },
      { icon: "wallet", label: "المعلومات المالية الحساسة" },
      { icon: "heart-pulse", label: "البيانات الصحية الخاصة" },
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
    descriptionAr:
      "بيانات حساسة تتطلب مستوى متوسط من الحماية مع إمكانية وصول محدودة.",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    letterBg: "bg-amber-100",
    letterColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-700",
    accessBg: "bg-amber-50",
    examples: [
      { icon: "users", label: "بيانات العملاء" },
      { icon: "file-text", label: "سجلات العمليات الداخلية" },
      { icon: "bar-chart", label: "التقارير المالية العامة" },
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
    descriptionAr:
      "بيانات عامة أو قليلة الحساسية متاحة لعدد أكبر من المستخدمين.",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    letterBg: "bg-green-100",
    letterColor: "text-green-600",
    badgeBg: "bg-green-100 text-green-700",
    accessBg: "bg-green-50",
    examples: [
      { icon: "globe", label: "المحتوى العام" },
      { icon: "file-text", label: "التقارير العامة" },
      { icon: "folder", label: "المستندات المشتركة" },
    ],
    accessRules: [
      { icon: "users", label: "جميع الموظفين" },
      { icon: "user-check", label: "الضيوف المصرح لهم" },
    ],
  },
];

const scenarios = [
  {
    icon: CreditCard,
    color: "text-red-500",
    bg: "bg-red-50",
    title: "سيناريو 1: عميل يدخل بيانات بنكية",
    desc: "اسم + IBAN + رقم بطاقة → الذكاء الاصطناعي يصنّفها فئة A فوراً ويُخفي البطاقة، ويُقيّد الوصول للمدراء فقط.",
  },
  {
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "سيناريو 2: قائمة عملاء جديدة",
    desc: "اسم + إيميل + جوال → فئة B (تكون البيانات معاً أهم من كل واحدة وحدها)، تُتاح للموظفين المُعتمدين.",
  },
  {
    icon: Globe,
    color: "text-green-500",
    bg: "bg-green-50",
    title: "سيناريو 3: تقرير عام للنشر",
    desc: "محتوى تسويقي بدون أي بيانات شخصية → فئة C، متاح للجميع مع تسجيل الوصول فقط.",
  },
  {
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50",
    title: "سيناريو 4: بيانات طبية",
    desc: "أي تشخيص أو سجل دواء → فئة A تلقائياً + تنبيه عالي + تشفير AES-256.",
  },
];

export default async function ClassificationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // REAL counts from DB
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
  const lastUpdate = all[0]?.created_at
    ? new Date(all[0].created_at)
    : new Date();
  const lastUpdateStr = lastUpdate.toLocaleString("ar-SA", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative bg-gradient-to-bl from-brand-light/50 via-white to-white rounded-2xl p-6 border border-border overflow-hidden">
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h1 className="text-2xl font-bold">
              تم تصنيف البيانات وتحديد الصلاحيات
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            تم تحليل بياناتك وتصنيفها حسب مستوى الحساسية، وتحديد صلاحيات
            الوصول لكل فئة لضمان مستويات الأمان والامتثال.
          </p>
        </div>
        <div className="absolute top-2 left-4 w-28 h-28 opacity-30 hidden lg:block">
          <div className="w-full h-full bg-gradient-to-br from-brand to-brand-hover rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <Shield className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* REAL Stats Row */}
      <div className="flex flex-wrap items-center justify-center gap-6 bg-white rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-xs text-muted-foreground">حالة التصنيف</p>
            <p className="font-semibold text-sm text-green-600">
              {total > 0 ? "مكتمل بنجاح" : "بانتظار البيانات"}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">إجمالي البيانات</p>
            <p className="font-semibold text-sm">{total} عنصر</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">آخر تحديث</p>
            <p className="font-semibold text-sm">{lastUpdateStr}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">المحرّك</p>
            <p className="font-semibold text-sm">سرار AI Engine</p>
          </div>
        </div>
      </div>

      {/* Category Title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">فئات تصنيف البيانات</h2>
        <Link
          href="/app/data"
          className="text-xs text-brand hover:underline flex items-center gap-1"
        >
          إدارة السجلات
          <ArrowLeft className="h-3 w-3" />
        </Link>
      </div>

      {/* Category Cards with REAL counts */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = counts[cat.id as "A" | "B" | "C"];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <Link
              key={cat.id}
              href={`/app/classification/${cat.id}`}
              className={`${cat.bgColor} ${cat.borderColor} border rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200 block`}
            >
              <div className="text-center mb-4">
                <div
                  className={`w-12 h-12 ${cat.letterBg} ${cat.letterColor} rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-2`}
                >
                  {cat.letter}
                </div>
                <h3 className="font-bold text-lg">{cat.nameAr}</h3>
                <Badge className={`${cat.badgeBg} border-0 text-xs mt-1`}>
                  {cat.sensitivityLevel}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground text-center mb-4">
                {cat.descriptionAr}
              </p>

              {/* REAL count for this category */}
              <div
                className={`${cat.accessBg} rounded-xl p-3 mb-4 text-center`}
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-[10px] text-muted-foreground">
                  سجل ({pct}% من الإجمالي)
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-center mb-2">أمثلة</p>
                <div className="space-y-2">
                  {cat.examples.map((ex, i) => {
                    const Icon = iconMap[ex.icon] || Shield;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{ex.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`${cat.accessBg} rounded-xl p-3`}>
                <p className="text-xs font-semibold mb-2">من يمكنه الوصول؟</p>
                <div className="space-y-1.5">
                  {cat.accessRules.map((rule, i) => {
                    const Icon = iconMap[rule.icon] || Users;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* HOW IT WORKS — multiple scenarios */}
      <div className="bg-white rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-5 w-5 text-brand" />
          <h2 className="font-bold text-lg">كيف يفكّر سرار؟ سيناريوهات حية</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          الذكاء الاصطناعي يطبّق معايير{" "}
          <span className="font-semibold text-brand">Zero Trust</span> لكل
          سجل تلقائياً
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {scenarios.map((s, i) => (
            <div
              key={i}
              className="bg-surface/50 rounded-xl p-4 border border-border hover:bg-surface transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}
                >
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline / How it works */}
      <div className="bg-gradient-to-br from-brand to-brand-hover text-white rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          خط أنابيب التصنيف الذكي
        </h2>
        <p className="text-xs text-white/80 mb-5">
          من الإدخال إلى الحماية — في أقل من ثانيتين
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Database, label: "1. استقبال البيانات", desc: "إدخال أو API" },
            { icon: Brain, label: "2. تحليل ذكي", desc: "كشف الحقول الحساسة" },
            { icon: Shield, label: "3. تصنيف", desc: "A / B / C + درجة" },
            { icon: Lock, label: "4. تطبيق الحماية", desc: "تشفير + إخفاء + صلاحيات" },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold">{step.label}</p>
              <p className="text-[10px] text-white/70 mt-0.5">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="bg-white rounded-2xl p-4 border border-border text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Eye className="h-4 w-4 text-brand" />
          جميع التصنيفات تتم بواسطة محرّك سرار الذكي مع مراجعة دورية لضمان
          الدقة والأمان
        </p>
      </div>
    </div>
  );
}
