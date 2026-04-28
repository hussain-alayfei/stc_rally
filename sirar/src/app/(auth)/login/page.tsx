"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNeedsConfirmation(false);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.message.includes("Email not confirmed") ||
        error.message.includes("email_not_confirmed")
      ) {
        setNeedsConfirmation(true);
      } else {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      setLoading(false);
      return;
    }

    router.push("/app");
    router.refresh();
  }

  async function resendConfirmation() {
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email });
    setError("");
    setNeedsConfirmation(false);
    setError("تم إرسال رسالة التأكيد مجدداً — تحقق من بريدك الإلكتروني");
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground mt-2">
            سجّل دخولك لإدارة وحماية بياناتك
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-brand" />
            <h1 className="text-xl font-bold">تسجيل الدخول</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
                dir="ltr"
                className="text-left"
                required
              />
            </div>

            {/* Email not confirmed warning */}
            {needsConfirmation && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      يجب تأكيد بريدك الإلكتروني أولاً
                    </p>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      أرسلنا لك رسالة تأكيد عند التسجيل. افتح بريدك واضغط
                      على رابط التأكيد، ثم عد وسجّل الدخول.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resendConfirmation}
                  className="text-xs text-amber-700 underline font-medium hover:text-amber-900 transition-colors"
                >
                  إعادة إرسال رسالة التأكيد
                </button>
              </div>
            )}

            {/* General error */}
            {error && !needsConfirmation && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success resend message */}
            {error && error.includes("تم إرسال") && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded-xl">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl h-11"
              disabled={loading}
            >
              {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ليس لديك حساب؟{" "}
            <Link
              href="/signup"
              className="text-brand font-medium hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
