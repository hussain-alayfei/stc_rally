import {
  LayoutDashboard,
  Database,
  Tags,
  FileText,
  AlertTriangle,
  Link2,
  ClipboardList,
  Settings,
  MessageSquare,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const sidebarNav: NavItem[] = [
  { label: "لوحة التحكم", href: "/app", icon: LayoutDashboard },
  { label: "البيانات", href: "/app/data", icon: Database },
  { label: "تصنيف البيانات", href: "/app/classification", icon: Tags },
  { label: "التقارير", href: "/app/reports", icon: FileText },
  { label: "المخاطر والتنبيهات", href: "/app/alerts", icon: AlertTriangle },
  { label: "تكامل الأنظمة", href: "/app/integrations", icon: Link2 },
  { label: "سجل العمليات", href: "/app/audit", icon: ClipboardList },
  { label: "الإعدادات", href: "/app/settings", icon: Settings },
];

export const chatSidebarNav: NavItem[] = [
  { label: "لوحة التحكم", href: "/app", icon: LayoutDashboard },
  { label: "البيانات", href: "/app/data", icon: Database },
  { label: "التصنيفات", href: "/app/classification", icon: Tags },
  { label: "التقارير", href: "/app/reports", icon: FileText },
  { label: "الإعدادات", href: "/app/settings", icon: Settings },
];

export const classificationSidebarNav: NavItem[] = [
  { label: "لوحة التحكم", href: "/app", icon: LayoutDashboard },
  { label: "المحادثات", href: "/app/chat", icon: MessageSquare },
  { label: "البيانات", href: "/app/data", icon: Database },
  { label: "تصنيف البيانات", href: "/app/classification", icon: Tags },
  { label: "الصلاحيات", href: "/app/permissions", icon: Shield },
  { label: "التقارير", href: "/app/reports", icon: FileText },
  { label: "الإعدادات", href: "/app/settings", icon: Settings },
];

export const categoryDetailSidebarNav: NavItem[] = [
  { label: "لوحة التحكم", href: "/app", icon: LayoutDashboard },
  { label: "المحادثات", href: "/app/chat", icon: MessageSquare },
  { label: "البيانات", href: "/app/data", icon: Database },
  { label: "تصنيف البيانات", href: "/app/classification", icon: Tags },
  { label: "فئات البيانات", href: "/app/classification", icon: Tags },
  { label: "الصلاحيات", href: "/app/permissions", icon: Shield },
  { label: "التقارير", href: "/app/reports", icon: FileText },
  { label: "الإعدادات", href: "/app/settings", icon: Settings },
];

export const integrationsSidebarNav: NavItem[] = [
  { label: "لوحة التحكم", href: "/app", icon: LayoutDashboard },
  { label: "المحادثات", href: "/app/chat", icon: MessageSquare },
  { label: "البيانات", href: "/app/data", icon: Database },
  { label: "تصنيف البيانات", href: "/app/classification", icon: Tags },
  { label: "الصلاحيات", href: "/app/permissions", icon: Shield },
  { label: "تكامل الأنظمة", href: "/app/integrations", icon: Link2 },
  { label: "التقارير", href: "/app/reports", icon: FileText },
  { label: "الإعدادات", href: "/app/settings", icon: Settings },
];
