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
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setConfirmed(true);
  }

  /* ── Confirmation screen ── */
  if (confirmed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center space-y-6">
            {/* Big icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                تم إنشاء حسابك بنجاح! 🎉
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                أرسلنا رسالة تأكيد إلى بريدك الإلكتروني
              </p>
            </div>

            {/* Email box */}
            <div className="bg-brand-light rounded-xl p-4 flex items-center justify-center gap-3">
              <Mail className="h-5 w-5 text-brand shrink-0" />
              <span className="font-semibold text-brand" dir="ltr">
                {email}
              </span>
            </div>

            {/* Steps */}
            <div className="bg-surface rounded-xl p-5 text-start space-y-3 text-sm">
              <p className="font-semibold text-foreground mb-2">
                خطوات تفعيل الحساب:
              </p>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-muted-foreground">
                  افتح بريدك الإلكتروني وابحث عن رسالة من{" "}
                  <span className="font-medium text-foreground">SIRAR سرار</span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-muted-foreground">
                  اضغط على زر{" "}
                  <span className="font-medium text-foreground">
                    "تأكيد البريد الإلكتروني"
                  </span>{" "}
                  في الرسالة
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-muted-foreground">
                  بعد التأكيد، ستتمكن من تسجيل الدخول ومتابعة التجربة
                </span>
              </div>
            </div>

            {/* Note about spam */}
            <p className="text-xs text-muted-foreground">
              لم تصلك الرسالة؟ تحقق من مجلد{" "}
              <span className="font-medium">البريد المزعج (Spam)</span> أو
              انتظر بضع دقائق
            </p>

            <Link href="/login">
              <Button className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl h-11 gap-2">
                الانتقال إلى تسجيل الدخول
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
