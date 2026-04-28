import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Lock, ArrowLeft } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "حماية متعددة الطبقات",
    description: "تشفير متقدم وسياسات وصول دقيقة تضمن حماية بياناتك في كل مرحلة.",
  },
  {
    icon: FileText,
    title: "تصنيف تلقائي",
    description: "تصنيف البيانات إلى فئات حسب حساسيتها وتطبيق إجراءات الحماية المناسبة.",
  },
  {
    icon: Lock,
    title: "إدارة الصلاحيات",
    description: "تحديد صلاحيات الوصول بدقة لكل دور وكل مستخدم داخل المؤسسة.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="h-10 px-6 font-medium border-border hover:bg-surface">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-brand hover:bg-brand-hover text-white h-10 px-6 font-medium">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground tracking-tight">
            إدارة بياناتك <span className="text-brand">بثقة واحترافية</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            منصة متكاملة تساعد المؤسسات على تصنيف بياناتها ومراقبتها وحمايتها وفق أعلى معايير الأمان، مع لوحة تحكم واضحة وتقارير جاهزة للامتثال.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white h-14 px-8 text-base font-medium gap-2 rounded-xl">
                ابدأ تجربتك الآن
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-medium border-border hover:bg-surface rounded-xl">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimal Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32 text-start">
          {features.map((f) => (
            <div key={f.title} className="space-y-3">
              <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center border border-border">
                <f.icon className="h-6 w-6 text-brand" />
              </div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border bg-surface py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} سرار SIRAR. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
