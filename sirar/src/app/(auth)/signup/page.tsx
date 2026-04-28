"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      if (error.message.includes("rate limit") || error.status === 429) {
        setError("عذراً، تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة لاحقاً.");
      } else if (error.message.includes("User already registered")) {
        setError("هذا البريد الإلكتروني مسجل بالفعل.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    router.push("/app");
    router.refresh();
  }

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
            <Link href="/login" className="text-brand font-medium hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
