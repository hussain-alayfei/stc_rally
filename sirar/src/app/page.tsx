import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Brain,
  SlidersHorizontal,
  BarChart3,
  Rocket,
  Headset,
  User,
  Database,
  Lock,
} from "lucide-react";

const navLinks = [
  { label: "الميزات", href: "#features" },
  { label: "الأسعار", href: "#pricing" },
  { label: "الموارد", href: "#resources" },
  { label: "تواصل معنا", href: "#contact" },
];

const features = [
  {
    icon: Shield,
    title: "أمان متقدم",
    description: "حماية متعددة الطبقات لضمان أمان بياناتك",
  },
  {
    icon: Brain,
    title: "ذكاء اصطناعي",
    description: "تصنيف ذكي للبيانات واكتشاف المخاطر تلقائياً",
  },
  {
    icon: SlidersHorizontal,
    title: "تحكم كامل",
    description: "صلاحيات مرنة وإدارة دقيقة لجميع بياناتك",
  },
  {
    icon: BarChart3,
    title: "رؤية شاملة",
    description: "تقارير وتحليلات لحظية تمكنك من اتخاذ قرارات أفضل",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo (Right side in RTL) */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Navigation Tabs (Middle) */}
            <nav className="hidden md:flex items-center justify-center flex-1 gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Action Buttons (Left side in RTL) */}
            <div className="flex-shrink-0">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full border-brand text-brand hover:bg-brand-light gap-2 px-6 h-10"
                >
                  <User className="h-4 w-4" />
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text (Right side in RTL) */}
            <div className="text-start">
              <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Rocket className="h-4 w-4" />
                نظام ذكي لإدارة وحماية البيانات
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-foreground">
                إدارة وحماية بياناتك
                <br />
                <span className="text-brand">بذكاء وموثوقية</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                سرار نظام ذكي يساعد المؤسسات على إدارة بياناتها وحمايتها وفق
                أعلى معايير الأمان والخصوصية.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/app/chat">
                  <Button className="bg-brand hover:bg-brand-hover text-white rounded-full h-12 px-8 text-base gap-2 shadow-lg shadow-brand/25">
                    <Rocket className="h-4 w-4" />
                    ابدأ في تجربة النظام
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button
                    variant="outline"
                    className="rounded-full h-12 px-8 text-base border-brand text-brand hover:bg-brand-light gap-2"
                  >
                    <Headset className="h-4 w-4" />
                    اطلب الخدمة
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Illustration (Left side in RTL) */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-[4/3]">
                {/* Large Background Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-light/30 to-white rounded-[2.5rem] border border-brand-muted/20 shadow-2xl shadow-brand/5 flex items-center justify-center">
                  {/* Inner Platform */}
                  <div className="relative w-64 h-64">
                    {/* The 3D Platform Base */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-12 bg-gradient-to-t from-brand-muted/40 to-transparent rounded-[100%] blur-md" />
                    
                    {/* The Main Shield Card */}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand to-brand-hover rounded-3xl shadow-2xl shadow-brand/40 flex items-center justify-center transform transition-transform hover:-translate-y-2 duration-500">
                      <Shield className="w-24 h-24 text-white" strokeWidth={1.5} />
                      {/* Glossy reflection */}
                      <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-8 -right-8 w-14 h-14 bg-white rounded-2xl shadow-xl border border-border flex items-center justify-center animate-float [animation-delay:0s]">
                      <Lock className="w-6 h-6 text-brand" />
                    </div>
                    <div className="absolute top-1/2 -left-12 w-14 h-14 bg-white rounded-2xl shadow-xl border border-border flex items-center justify-center animate-float [animation-delay:0.5s]">
                      <BarChart3 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="absolute -bottom-6 -right-4 w-14 h-14 bg-white rounded-2xl shadow-xl border border-border flex items-center justify-center animate-float [animation-delay:1s]">
                      <Brain className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="absolute -bottom-10 left-8 w-14 h-14 bg-white rounded-2xl shadow-xl border border-border flex items-center justify-center animate-float [animation-delay:1.5s]">
                      <Database className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="absolute top-4 -left-6 w-10 h-10 bg-white rounded-xl shadow-lg border border-border flex items-center justify-center animate-float [animation-delay:2s]">
                      <User className="w-4 h-4 text-brand" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ليش سرار ؟</h2>
            <div className="w-12 h-1 bg-brand mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نقدم لك نظام متكامل يجمع بين الذكاء الاصطناعي والأمان المتقدم
              لإدارة بياناتك بثقة وفعالية.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.reverse().map((feature, i) => (
              <div
                key={feature.title}
                className="text-center flex flex-col items-center"
              >
                <div className="mb-4 text-brand">
                  <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} سرار SIRAR. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
