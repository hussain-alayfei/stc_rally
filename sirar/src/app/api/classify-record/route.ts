import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const maxDuration = 30;

/* ─────────────────────────────────────────────────────────────
   GPT-POWERED CLASSIFIER
   Uses structured output (Zod) so the model MUST return valid JSON.
   ───────────────────────────────────────────────────────────── */

const ClassificationSchema = z.object({
  category: z
    .enum(["A", "B", "C"])
    .describe(
      "A = أعلى حساسية (هوية/مالي/صحي), B = متوسطة (عملاء/عمليات), C = عامة"
    ),
  sensitivity_score: z
    .number()
    .min(0)
    .max(100)
    .describe("درجة الحساسية من 0 إلى 100"),
  data_type: z
    .enum(["personal", "financial", "medical", "contact", "general"])
    .describe("نوع البيانات الرئيسي"),
  reasoning: z
    .string()
    .describe("شرح موجز بالعربية لسبب اختيار التصنيف (جملة واحدة فقط)"),
  detected_fields: z
    .array(
      z.object({
        field: z.string().describe("اسم الحقل: name, email, phone, etc."),
        sensitivity: z.enum(["high", "medium", "low"]),
        label_ar: z.string().describe("اسم الحقل بالعربية"),
      })
    )
    .describe("الحقول الحساسة المكتشفة"),
  recommended_access: z
    .array(z.enum(["admin", "manager", "user"]))
    .describe("الأدوار التي يحق لها الوصول"),
  protection_actions: z
    .array(z.string())
    .max(3)
    .describe("3 إجراءات حماية موصى بها (تشفير، إخفاء، تقييد...)"),
});

const SYSTEM_PROMPT = `أنت محرّك التصنيف الذكي في نظام "سرار" لحماية البيانات في البيئات الضخمة.

## مهمتك:
تحليل بيانات المستخدم وتصنيفها تلقائياً حسب مستوى الحساسية، وفقاً لمعيار Zero Trust Architecture (NIST SP 800-207).

## معايير التصنيف:

### فئة A — عالية الحساسية (سكور 80-100)
- بيانات الهوية الشخصية (رقم الهوية الوطنية، جواز السفر)
- المعلومات المالية الحساسة (أرقام البطاقات، الحسابات، IBAN، الرصيد)
- البيانات الصحية الخاصة (تشخيص، أدوية، سجل طبي)
- البيانات البيومترية
- **القرار:** الوصول للمدراء التنفيذيين فقط
- **الحماية:** تشفير AES-256، إخفاء كامل، تقييد التصدير

### فئة B — متوسطة الحساسية (سكور 40-79)
- بيانات العملاء (الاسم + الإيميل + الجوال معاً)
- سجلات العمليات الداخلية
- التقارير المالية العامة
- العناوين السكنية والوظيفية
- **القرار:** مدراء الأقسام والموظفين المصرح لهم
- **الحماية:** تشفير في النقل، إخفاء جزئي

### فئة C — منخفضة الحساسية (سكور 0-39)
- المحتوى العام
- التقارير العامة المنشورة
- الأسماء فقط بدون أي معلومات أخرى
- المستندات المشتركة
- **القرار:** جميع الموظفين
- **الحماية:** تسجيل الوصول فقط

## قواعد مهمة:
1. **اجمع الحقول معاً**: اسم + إيميل + جوال = فئة B (حتى لو كل واحد منهم C وحده)
2. **رقم الهوية أو حساب بنكي = فئة A تلقائياً** بغض النظر عن باقي الحقول
3. **اعطِ score دقيق**: A=85-100, B=50-78, C=10-35
4. **reasoning يكون جملة واحدة قصيرة بالعربية**

أعد النتيجة كـ JSON مهيكل فقط.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, dataType, additional } = body;

    const userInput = `حلل هذا السجل وصنّفه:
- الاسم: ${name || "—"}
- البريد الإلكتروني: ${email || "—"}
- رقم الجوال: ${phone || "—"}
- نوع البيانات (مُلمَّح): ${dataType || "غير محدد"}
${additional ? `- معلومات إضافية: ${additional}` : ""}`;

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt: userInput,
      schema: ClassificationSchema,
      temperature: 0.2,
    });

    return NextResponse.json({ ok: true, ...object });
  } catch (err) {
    console.error("Classification error:", err);
    // Safe fallback so UI never breaks
    return NextResponse.json({
      ok: false,
      category: "B",
      sensitivity_score: 60,
      data_type: "personal",
      reasoning: "تم استخدام التصنيف الاحتياطي بسبب خطأ في خدمة الذكاء الاصطناعي",
      detected_fields: [],
      recommended_access: ["admin", "manager"],
      protection_actions: ["تشفير في النقل", "تسجيل الوصول"],
    });
  }
}
