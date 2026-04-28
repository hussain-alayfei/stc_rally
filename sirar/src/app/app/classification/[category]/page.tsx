"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Search,
  Filter,
  Download,
  Shield,
  Users,
  UserCheck,
  UserCog,
  Lock,
  Info,
  CheckCircle,
  Clock,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    description:
      "بيانات شديدة الحساسية تتطلب أعلى مستوى من الحماية والتقييد في الوصول.",
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
    description:
      "بيانات حساسة تتطلب مستوى متوسط من الحماية مع إمكانية وصول محدودة.",
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
    description:
      "بيانات عامة أو قليلة الحساسية متاحة لعدد أكبر من المستخدمين.",
    accessRules: [
      { icon: Users, label: "جميع الموظفين" },
      { icon: UserCheck, label: "الضيوف المصرح لهم" },
      { icon: UserCog, label: "الموظفين الموثقين" },
    ],
  },
};

const sampleRecords = [
  {
    name: "أحمد محمد",
    email: "ahmed.m@example.com",
    phone: "+966 50 123 4567",
    birthDate: "1990-05-15",
    address: "الرياض السعودية",
    nationalId: "1087****35",
  },
  {
    name: "سارة خالد",
    email: "sara.k@example.com",
    phone: "+966 54 765 4321",
    birthDate: "1992-08-22",
    address: "جدة السعودية",
    nationalId: "2194****87",
  },
  {
    name: "محمد عبدالله",
    email: "mohammed.a@example.com",
    phone: "+966 59 987 6543",
    birthDate: "1988-11-03",
    address: "الدمام السعودية",
    nationalId: "3056****21",
  },
];

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const cat = categoryMeta[category.toUpperCase()] || categoryMeta.C;
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/app/classification"
          className="text-brand hover:underline"
        >
          فئات البيانات
        </Link>
        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {cat.letter} {cat.letter}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/app/classification">
          <Button variant="outline" className="rounded-xl gap-2 text-sm">
            العودة إلى الفئات
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Category Header */}
      <div className="text-center">
        <div
          className={`w-14 h-14 ${cat.letterBg} ${cat.letterColor} rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-3`}
        >
          {cat.letter}
        </div>
        <h1 className="text-2xl font-bold">
          {cat.nameAr} - {cat.level}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-lg mx-auto">
          يمكنك عرض البيانات المصرح بها في هذه الفئة مع حماية المعلومات
          الحساسة
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-center gap-6 bg-white rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5" style={{ color: cat.color }} />
          <div>
            <p className="text-xs text-muted-foreground">مستوى الوصول</p>
            <p className="font-semibold text-sm flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.level}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">عدد السجلات</p>
            <p className="font-semibold text-sm">2,456 سجل</p>
          </div>
        </div>
        <div className="w-px h-8 bg-border hidden sm:block" />
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">آخر تحديث</p>
            <p className="font-semibold text-sm">10:45 AM مايو 2024</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content */}
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث في البيانات..."
                className="ps-10 rounded-xl bg-white"
              />
            </div>
            <Button variant="outline" className="rounded-xl gap-2 text-sm">
              <Filter className="h-4 w-4" />
              فلترة
            </Button>
            <Button variant="outline" className="rounded-xl gap-2 text-sm">
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          </div>

          {/* Table Header */}
          <h3 className="font-bold">بيانات {cat.nameAr}</h3>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-muted-foreground border-b border-border">
                    <th className="text-start p-3 font-medium">الاسم</th>
                    <th className="text-start p-3 font-medium">
                      البريد الإلكتروني
                    </th>
                    <th className="text-start p-3 font-medium">رقم الجوال</th>
                    <th className="text-start p-3 font-medium">
                      تاريخ الميلاد
                    </th>
                    <th className="text-start p-3 font-medium">العنوان</th>
                    <th className="text-start p-3 font-medium">رقم الهوية</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRecords.map((record, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-surface/50"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          {record.name}
                        </div>
                      </td>
                      <td className="p-3" dir="ltr">
                        {record.email}
                      </td>
                      <td className="p-3" dir="ltr">
                        {record.phone}
                      </td>
                      <td className="p-3">
                        <Badge className="bg-surface text-muted-foreground border-0 text-xs font-normal">
                          معلومات محاكاة
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-surface text-muted-foreground border-0 text-xs font-normal">
                          معلومات محاكاة
                        </Badge>
                      </td>
                      <td className="p-3" dir="ltr">
                        {record.nationalId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-3 border-t border-border text-xs text-muted-foreground">
              <span>عرض 10 من 2,456 سجل</span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">&lt;</span>
                <button className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-medium">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center">
                  3
                </button>
                <span>...</span>
                <span className="text-muted-foreground">&gt;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category Info */}
          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-bold text-sm">معلومات الفئة</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المستوى</span>
                <span className="font-medium">{cat.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الوصف</span>
                <span className="font-medium text-xs max-w-[180px] text-start">
                  {cat.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">عدد السجلات</span>
                <span className="font-medium">2,456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">آخر تحديث</span>
                <span className="font-medium text-xs">
                  10:45 AM مايو 2024
                </span>
              </div>
            </div>
          </div>

          {/* Who can access */}
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

          {/* Data Protection */}
          <div className="bg-brand-light rounded-2xl p-5 border border-brand-muted">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-brand" />
              <h3 className="font-bold text-sm">حماية البيانات</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              تم تطبيق تقنية محاكاة البيانات على المعلومات الحساسة للحفاظ على
              السرية مع الإبقاء على فائدة البيانات.
            </p>
            <button className="text-brand text-xs font-medium flex items-center gap-1">
              <Info className="h-3 w-3" />
              اعرف المزيد
            </button>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="bg-white rounded-2xl p-4 border border-border text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-brand" />
          تم تطبيق الحماية الذكية. تم إخفاء أو محاكاة بعض البيانات الحساسة
          للحفاظ على الخصوصية والأمان.
        </p>
      </div>
    </div>
  );
}
