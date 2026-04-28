"use client";

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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function ClassificationPage() {
  return (
    <div className="space-y-6">
      {/* Header with shield illustration */}
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
        {/* Shield 3D decoration */}
        <div className="absolute top-2 left-4 w-28 h-28 opacity-30 hidden lg:block">
          <div className="w-full h-full bg-gradient-to-br from-brand to-brand-hover rounded-2xl flex items-center justify-center shadow-lg">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
                fill="white"
                opacity="0.5"
              />
              <path
                d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 2.18l6 3v5.09c0 4.41-2.88 8.48-6 9.73-3.12-1.25-6-5.32-6-9.73v-5.09l6-3z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center justify-center gap-6 bg-white rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-xs text-muted-foreground">حالة التصنيف</p>
            <p className="font-semibold text-sm text-green-600">
              مكتمل بنجاح
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">إجمالي البيانات</p>
            <p className="font-semibold text-sm">1,248 عنصر</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">آخر تحديث</p>
            <p className="font-semibold text-sm">
              10:45 AM مايو 2024 - مايو
            </p>
          </div>
        </div>
      </div>

      {/* Category Title */}
      <h2 className="font-bold text-lg">فئات تصنيف البيانات</h2>

      {/* Category Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/app/classification/${cat.id}`}
            className={`${cat.bgColor} ${cat.borderColor} border rounded-2xl p-5 hover:shadow-md transition-shadow block`}
          >
            {/* Header */}
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

            {/* Examples */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-center mb-2">أمثلة</p>
              <div className="space-y-2">
                {cat.examples.map((ex, i) => {
                  const Icon = iconMap[ex.icon] || Shield;
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{ex.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Access Rules */}
            <div className={`${cat.accessBg} rounded-xl p-3`}>
              <p className="text-xs font-semibold mb-2">من يمكنه الوصول؟</p>
              <div className="space-y-1.5">
                {cat.accessRules.map((rule, i) => {
                  const Icon = iconMap[rule.icon] || Users;
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Notice */}
      <div className="bg-white rounded-2xl p-4 border border-border text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-brand" />
          جميع التصنيفات تدار تلقائياً بواسطة نظام الذكاء الاصطناعي مع مراجعة
          دورية لضمان الدقة والأمان
        </p>
      </div>
    </div>
  );
}
