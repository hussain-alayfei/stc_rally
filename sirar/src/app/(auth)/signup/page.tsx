"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      if (error.message.includes("rate limit")) {
        setError("عذراً، تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة لاحقاً.");
      } else if (error.message.includes("User already registered")) {
        setError("هذا البريد الإلكتروني مسجل بالفعل.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    setLoading(false);
    setConfirmed(true);
  }

  /* ── Confirmation screen ── */
  if (confirmed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl -z-10 animate-pulse-dot" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse-dot" style={{ animationDelay: "1s" }} />

        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 text-center relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-light via-brand to-brand-hover" />

            {/* Glowing Mail Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-brand-light to-white border border-brand-muted/50 rounded-full flex items-center justify-center shadow-sm">
                <Mail className="h-10 w-10 text-brand" />
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                تفقد صندوق الوارد!
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
                أرسلنا رابط التفعيل السحري إلى بريدك الإلكتروني لضمان أمان حسابك.
              </p>
            </div>

            {/* Email box */}
            <div className="bg-surface/50 rounded-2xl p-4 flex items-center justify-center gap-3 mb-8 border border-border/50">
              <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-brand" />
              </div>
              <span className="font-medium text-foreground tracking-wide" dir="ltr">
                {email}
              </span>
            </div>

            {/* Next Steps (Timeline style) */}
            <div className="text-start space-y-5 relative before:absolute before:inset-y-2 before:start-[11px] before:w-0.5 before:bg-border mb-8">
              <div className="relative flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white z-10">
                  1
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-foreground">افتح رسالة التفعيل</p>
                  <p className="text-xs text-muted-foreground mt-1">ابحث عن رسالة من فريق سرار (SIRAR)</p>
                </div>
              </div>
              <div className="relative flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white z-10">
                  2
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-foreground">أكد حسابك</p>
                  <p className="text-xs text-muted-foreground mt-1">اضغط على الرابط المرفق في الرسالة</p>
                </div>
              </div>
              <div className="relative flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-light text-brand flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white z-10">
                  3
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-foreground">ابدأ الاستخدام</p>
                  <p className="text-xs text-muted-foreground mt-1">سجل دخولك وابدأ في حماية بياناتك</p>
                </div>
              </div>
            </div>

            <Link href="/login" className="block">
              <Button className="w-full bg-foreground hover:bg-foreground/90 text-white rounded-xl h-12 gap-2 text-sm shadow-md hover:shadow-lg transition-all">
                العودة لتسجيل الدخول
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <p className="text-[11px] text-muted-foreground mt-6">
              لم تصلك الرسالة؟ تحقق من مجلد البريد المزعج (Spam)
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Signup form ── */
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground mt-2">
            أنشئ حسابك وابدأ في حماية بياناتك
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="h-5 w-5 text-brand" />
            <h1 className="text-xl font-bold">إنشاء حساب جديد</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                الاسم الكامل
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: سارة أحمد"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                dir="ltr"
                className="text-left"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                كلمة المرور
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
                dir="ltr"
                className="text-left"
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl h-11"
              disabled={loading}
            >
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="text-brand font-medium hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
