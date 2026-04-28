"use client";

import { useState } from "react";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Shield,
  Zap,
  Clock,
  Code,
  CheckCircle,
  Link2,
  Activity,
  FileText,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const connectionSteps = [
  {
    step: 1,
    icon: Key,
    title: "إنشاء مفتاح API",
    description: "قم بإنشاء مفتاح فريد من لوحة المفاتيح الخاصة بك.",
  },
  {
    step: 2,
    icon: Copy,
    title: "نسخ مفتاح الربط",
    description: "انسخ المفتاح الاستخدامي في نظامك.",
  },
  {
    step: 3,
    icon: Code,
    title: "إضافته في نظامك",
    description: "أضف المفتاح في إعدادات التكامل في نظامك.",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "تم الاتصال بنجاح",
    description:
      "بعد التحقق، سيتم تفعيل الربط وتدفق البيانات بشكل آمن.",
  },
];

export default function IntegrationsPage() {
  const [showKey, setShowKey] = useState(false);
  const apiKey = "sirar_key_8jKkR**************b7x9";
  const fullKey = "sirar_key_8jKkR1234567890abcdefb7x9";

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-bl from-brand-light via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-brand-muted/30 overflow-hidden">
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Link2 className="h-4 w-4" />
            API
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            ربط نظامك اليوم بضغطة واحدة
          </h1>
          <p className="text-muted-foreground text-sm">
            اربط أنظمتك الحالية عبر API في دقائق وابدأ في حماية وإدارة
            بياناتك.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              {
                icon: Zap,
                label: "تكامل ذكي",
                desc: "تراسل البيانات تلقائياً",
              },
              {
                icon: Clock,
                label: "دقائق معدودة",
                desc: "إعداد سريع بدون تعقيد",
              },
              {
                icon: Shield,
                label: "موثق وآمن",
                desc: "اتصال مشفر وموثق بالكامل",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-border text-sm"
              >
                <feat.icon className="h-4 w-4 text-brand" />
                <div className="text-start">
                  <p className="font-medium text-xs">{feat.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Main */}
        <div className="space-y-6">
          {/* Connection Steps */}
          <div>
            <h2 className="font-bold text-lg mb-4 text-center">طريقة الربط</h2>
            <div className="grid sm:grid-cols-4 gap-0">
              {connectionSteps
                .slice()
                .reverse()
                .map((step, i, arr) => (
                  <div key={step.step} className="relative text-center flex items-start">
                    <div className="bg-white rounded-2xl p-5 border border-border flex-1">
                      <div className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center text-sm font-bold mx-auto mb-3">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center mx-auto mb-3">
                        <step.icon className="h-6 w-6 text-brand" />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                      <p className="text-[11px] text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="hidden sm:flex items-center justify-center w-8 shrink-0 self-center">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Integration Health */}
          <div>
            <h2 className="font-bold text-lg mb-4 text-center flex items-center justify-center gap-2">
              <Activity className="h-5 w-5 text-brand" />
              حالة التكامل
            </h2>
            <div className="bg-white rounded-2xl p-5 border border-border">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">
                      الطلبات آخر 24h
                    </span>
                  </div>
                  <p className="text-2xl font-bold">1,248</p>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">تدفق البيانات</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">نشط</p>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Shield className="h-4 w-4 text-brand" />
                    <span className="text-muted-foreground">حالة الاتصال</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">متصل</p>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">آخر مراجعة</span>
                  </div>
                  <p className="text-sm font-medium">منذ 2 دقيقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* API Key */}
          <div className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-brand" />
              <h3 className="font-bold text-sm">مفتاح الربط الخاص بك</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              استخدم هذا المفتاح لربط نظامك مع سرار عبر API
            </p>
            <div className="bg-surface rounded-xl p-3 flex items-center gap-2 mb-2">
              <code className="text-xs flex-1 truncate" dir="ltr">
                {showKey ? fullKey : apiKey}
              </code>
              <button
                onClick={() => setShowKey(!showKey)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(fullKey)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-4">
              تم إنشاؤه في: 10:30 AM - 21 مايو 2024
            </p>
            <Button className="w-full bg-brand hover:bg-brand-hover rounded-xl gap-2 text-sm">
              <Plus className="h-4 w-4" />
              إنشاء مفتاح جديد
            </Button>
          </div>

          {/* Connection Info */}
          <div className="bg-white rounded-2xl p-5 border border-border">
            <h3 className="font-bold text-sm mb-3">معلومات الاتصال</h3>
            <div className="space-y-2.5 text-sm">
              {[
                {
                  label: "نقطة النهاية (API)",
                  value: "https://api.sirar.io/v1",
                },
                { label: "بيئة العمل", value: "Production" },
                { label: "نوع المصادقة", value: "Bearer Token" },
                { label: "تنسيق البيانات", value: "JSON" },
                { label: "الإصدار", value: "v1" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-xs" dir="ltr">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="bg-brand-light rounded-2xl p-5 border border-brand-muted">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-5 w-5 text-brand" />
              <h3 className="font-bold text-sm">هل تحتاج مساعدة؟</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              فريق الدعم جاهز لمساعدتك في عملية الربط
            </p>
            <button className="text-brand text-xs font-medium flex items-center gap-1">
              <FileText className="h-3 w-3" />
              عرض الوثائق
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-2xl p-4 border border-border text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-brand" />
          جميع عمليات الربط تتم عبر اتصال مشفر وتخضع لمعايير الأمان
          والخصوصية
        </p>
      </div>
    </div>
  );
}
