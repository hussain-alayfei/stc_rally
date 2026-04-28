export interface CategoryDef {
  id: string;
  letter: string;
  nameAr: string;
  sensitivityLevel: string;
  descriptionAr: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  examples: { icon: string; label: string }[];
  accessRules: { icon: string; label: string }[];
}

export const categories: CategoryDef[] = [
  {
    id: "A",
    letter: "A",
    nameAr: "فئة A",
    sensitivityLevel: "عالية الأمان",
    descriptionAr:
      "بيانات شديدة الحساسية تتطلب أعلى مستوى من الحماية والتقييد في الوصول.",
    color: "#EF4444",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    badgeBg: "#FEE2E2",
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
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    badgeBg: "#FEF3C7",
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
    color: "#22C55E",
    bgColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    badgeBg: "#DCFCE7",
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
