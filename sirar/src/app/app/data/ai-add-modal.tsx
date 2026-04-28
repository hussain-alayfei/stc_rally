"use client";

import { useState, useTransition } from "react";
import {
  X,
  Loader2,
  Sparkles,
  Brain,
  Shield,
  CheckCircle,
  Lock,
  Eye,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addDataRecord } from "@/lib/actions";

interface ClassificationResult {
  category: "A" | "B" | "C";
  sensitivity_score: number;
  data_type: string;
  reasoning: string;
  detected_fields: { field: string; sensitivity: string; label_ar: string }[];
  recommended_access: string[];
  protection_actions: string[];
}

type Stage = "form" | "analyzing" | "result" | "saving" | "saved";

const analysisSteps = [
  { icon: Brain, label: "قراءة البيانات وتحليل الأنماط...", duration: 700 },
  {
    icon: Shield,
    label: "تطبيق معايير Zero Trust للتصنيف...",
    duration: 800,
  },
  { icon: Sparkles, label: "تشغيل نموذج GPT-4o-mini...", duration: 900 },
  { icon: Lock, label: "تحديد مستوى الحماية المطلوب...", duration: 700 },
];

const categoryConfig = {
  A: {
    label: "فئة A — عالية الحساسية",
    color: "bg-red-100 text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: AlertTriangle,
    iconColor: "text-red-500",
  },
  B: {
    label: "فئة B — متوسطة الحساسية",
    color: "bg-amber-100 text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Shield,
    iconColor: "text-amber-500",
  },
  C: {
    label: "فئة C — منخفضة الحساسية",
    color: "bg-green-100 text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
};

const roleLabels: Record<string, string> = {
  admin: "مدير النظام",
  manager: "مدير القسم",
  user: "موظف",
};

export function AiAddModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    data_type: "personal",
  });

  async function runAnalysis(form: typeof formData) {
    setStage("analyzing");
    setActiveStep(0);
    setCompletedSteps([]);

    // Animate through steps in parallel with the API call
    let stepIndex = 0;
    const stepTimer = setInterval(() => {
      setCompletedSteps((prev) => [...prev, stepIndex]);
      stepIndex += 1;
      if (stepIndex < analysisSteps.length) {
        setActiveStep(stepIndex);
      } else {
        clearInterval(stepTimer);
      }
    }, 750);

    try {
      const res = await fetch("/api/classify-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          dataType: form.data_type,
        }),
      });
      const data: ClassificationResult = await res.json();

      // Wait until at least all steps shown
      await new Promise((r) => setTimeout(r, 800));
      clearInterval(stepTimer);
      setCompletedSteps([0, 1, 2, 3]);
      setResult(data);
      setStage("result");
    } catch {
      clearInterval(stepTimer);
      setError("فشل التصنيف الذكي. يرجى المحاولة مرة أخرى.");
      setStage("form");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) {
      setError("الاسم مطلوب");
      return;
    }
    runAnalysis(formData);
  }

  function handleSave() {
    if (!result) return;
    setStage("saving");
    startTransition(async () => {
      const res = await addDataRecord({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        data_type: result.data_type,
        category: result.category,
        sensitivity_score: result.sensitivity_score,
        reasoning: result.reasoning,
        detected_fields: result.detected_fields,
      });
      if (res?.error) {
        setError(res.error);
        setStage("result");
        return;
      }
      setStage("saved");
      setTimeout(() => onClose(), 1500);
    });
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={() => stage === "form" && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg animate-slide-up overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── FORM ───────────────────────────────────────── */}
        {stage === "form" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold">إضافة سجل بتصنيف ذكي</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-5 bg-brand-light p-3 rounded-xl flex items-start gap-2">
              <Brain className="h-4 w-4 text-brand shrink-0 mt-0.5" />
              <span>
                سيقوم الذكاء الاصطناعي بتحليل البيانات وتصنيفها تلقائياً حسب
                مستوى الحساسية، ثم يقترح مستوى الحماية المناسب.
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  الاسم الكامل *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="مثال: أحمد محمد العتيبي"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@domain.com"
                  className="rounded-xl"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  رقم الجوال
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+966 5X XXX XXXX"
                  className="rounded-xl"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  نوع البيانات (تلميح للذكاء الاصطناعي)
                </label>
                <select
                  value={formData.data_type}
                  onChange={(e) =>
                    setFormData({ ...formData, data_type: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-input bg-white text-sm"
                >
                  <option value="personal">شخصية</option>
                  <option value="financial">مالية</option>
                  <option value="medical">صحية</option>
                  <option value="contact">اتصال</option>
                  <option value="general">عامة</option>
                </select>
              </div>
              {error && (
                <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={onClose}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand to-brand-hover hover:opacity-90 rounded-xl gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  بدء التحليل الذكي
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── ANALYZING ──────────────────────────────────── */}
        {stage === "analyzing" && (
          <div className="p-8 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-hover rounded-2xl animate-pulse opacity-30" />
              <div className="absolute inset-2 bg-gradient-to-br from-brand to-brand-hover rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="h-10 w-10 text-white animate-pulse-dot" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Sparkles className="h-4 w-4 text-brand animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">
              جاري التحليل الذكي للبيانات
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              نموذج GPT-4o-mini يفحص البيانات الآن
            </p>

            <div className="space-y-2 text-start max-w-sm mx-auto">
              {analysisSteps.map((step, i) => {
                const isDone = completedSteps.includes(i);
                const isActive = activeStep === i && !isDone;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                      isDone
                        ? "bg-green-50"
                        : isActive
                          ? "bg-brand-light"
                          : "bg-surface/50 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-brand text-white"
                            : "bg-white text-muted-foreground"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : isActive ? (
                        <step.icon className="h-4 w-4 animate-pulse" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        isDone || isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <Loader2 className="h-3.5 w-3.5 text-brand animate-spin ms-auto" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RESULT ─────────────────────────────────────── */}
        {stage === "result" && result && (
          <div>
            <div
              className={`p-5 ${categoryConfig[result.category].bg} ${categoryConfig[result.category].border} border-b`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-bold">اكتمل التحليل</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = categoryConfig[result.category].icon;
                  return (
                    <Icon
                      className={`h-8 w-8 ${categoryConfig[result.category].iconColor}`}
                    />
                  );
                })()}
                <div className="flex-1">
                  <Badge
                    className={`${categoryConfig[result.category].color} border-0 mb-1`}
                  >
                    {categoryConfig[result.category].label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    درجة الحساسية:{" "}
                    <span className="font-bold text-foreground">
                      {result.sensitivity_score}/100
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
              {/* AI reasoning */}
              <div className="bg-brand-light rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  تحليل الذكاء الاصطناعي
                </div>
                <p className="text-sm">{result.reasoning}</p>
              </div>

              {/* Detected fields */}
              {result.detected_fields?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-brand" />
                    الحقول المكتشفة
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detected_fields.map((f, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className={`text-[10px] ${
                          f.sensitivity === "high"
                            ? "border-red-300 text-red-700 bg-red-50"
                            : f.sensitivity === "medium"
                              ? "border-amber-300 text-amber-700 bg-amber-50"
                              : "border-green-300 text-green-700 bg-green-50"
                        }`}
                      >
                        {f.label_ar}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended access */}
              <div>
                <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-brand" />
                  من يمكنه الوصول
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.recommended_access.map((role) => (
                    <Badge
                      key={role}
                      className="bg-brand-light text-brand border-0 text-[10px]"
                    >
                      {roleLabels[role] || role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Protection actions */}
              {result.protection_actions?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-brand" />
                    إجراءات الحماية الموصى بها
                  </p>
                  <div className="space-y-1.5">
                    {result.protection_actions.map((act, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs bg-surface rounded-lg p-2"
                      >
                        <Zap className="h-3 w-3 text-brand shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setStage("form")}
              >
                إعادة التحليل
              </Button>
              <Button
                onClick={handleSave}
                disabled={pending}
                className="flex-1 bg-brand hover:bg-brand-hover rounded-xl gap-2"
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                حفظ بهذا التصنيف
              </Button>
            </div>
          </div>
        )}

        {/* ── SAVING ─────────────────────────────────────── */}
        {stage === "saving" && (
          <div className="p-12 text-center">
            <Loader2 className="h-12 w-12 text-brand animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">جاري الحفظ في قاعدة البيانات...</p>
            <p className="text-xs text-muted-foreground mt-1">
              يتم الآن تشفير البيانات وتطبيق سياسات الحماية
            </p>
          </div>
        )}

        {/* ── SAVED ──────────────────────────────────────── */}
        {stage === "saved" && (
          <div className="p-12 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-9 w-9 text-green-500" />
            </div>
            <p className="text-lg font-bold">تم الحفظ بنجاح!</p>
            <p className="text-xs text-muted-foreground mt-1">
              السجل أصبح محمياً ومُصنّفاً في النظام
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
