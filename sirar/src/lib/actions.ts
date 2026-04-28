"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ─────────────────────────────────────────────────────────────
   AUDIT LOG HELPER
   Every meaningful action calls this to keep the trail.
   ───────────────────────────────────────────────────────────── */
export async function logAudit(
  action: string,
  targetType: string = "",
  targetId: string | null = null,
  metadata: Record<string, unknown> = {}
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata,
    ip: "127.0.0.1",
  });
}

/* ─────────────────────────────────────────────────────────────
   DATA RECORDS
   ───────────────────────────────────────────────────────────── */
interface AddRecordInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  data_type: string;
  category: "A" | "B" | "C";
  sensitivity_score: number;
  reasoning?: string;
  detected_fields?: unknown[];
}

export async function addDataRecord(input: AddRecordInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!input.name?.trim()) return { error: "الاسم مطلوب" };

  const { data, error } = await supabase
    .from("data_records")
    .insert({
      user_id: user.id,
      source: "ai-classified",
      category: input.category,
      sensitivity_score: input.sensitivity_score,
      data_type: input.data_type,
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      status: "active",
      fields: {
        name: input.name,
        email: input.email,
        phone: input.phone,
      },
      masked_fields: {
        ai_reasoning: input.reasoning,
        detected_fields: input.detected_fields,
      },
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await logAudit(
    `إضافة سجل (تصنيف ذكي → فئة ${input.category})`,
    "data_record",
    data.id,
    {
      name: input.name,
      category: input.category,
      score: input.sensitivity_score,
    }
  );

  // Auto-create a high-severity alert for sensitive data (Cat A)
  if (input.category === "A") {
    await supabase.from("alerts").insert({
      user_id: user.id,
      title: `بيانات حساسة جديدة في فئة A`,
      description: `تم إضافة سجل "${input.name}" بمستوى حساسية عالية. السبب: ${input.reasoning || "بيانات شخصية حساسة"}`,
      severity: "high",
      type: "classification",
      status: "active",
    });
  }

  revalidatePath("/app/data");
  revalidatePath("/app/audit");
  revalidatePath("/app/classification");
  revalidatePath("/app/alerts");
  revalidatePath("/app");
  return { success: true };
}

export async function deleteDataRecord(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rec } = await supabase
    .from("data_records")
    .select("name")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("data_records").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("حذف سجل بيانات", "data_record", id, {
    name: rec?.name,
  });

  revalidatePath("/app/data");
  revalidatePath("/app/audit");
  revalidatePath("/app");
  return { success: true };
}

export async function updateDataRecordStatus(
  id: string,
  status: "active" | "archived" | "flagged"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("data_records")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAudit("تحديث حالة سجل", "data_record", id, { status });
  revalidatePath("/app/data");
  revalidatePath("/app/audit");
  return { success: true };
}

/* ─────────────────────────────────────────────────────────────
   ALERTS
   ───────────────────────────────────────────────────────────── */
export async function resolveAlert(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("alerts")
    .update({ status: "resolved" })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAudit("حل تنبيه", "alert", id);
  revalidatePath("/app/alerts");
  revalidatePath("/app/audit");
  revalidatePath("/app");
  return { success: true };
}

export async function dismissAlert(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("alerts")
    .update({ status: "dismissed" })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAudit("تجاهل تنبيه", "alert", id);
  revalidatePath("/app/alerts");
  revalidatePath("/app/audit");
  return { success: true };
}

export async function createAlert(
  title: string,
  description: string,
  severity: "high" | "medium" | "low" = "medium"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("alerts").insert({
    user_id: user.id,
    title,
    description,
    severity,
    status: "active",
  });
  revalidatePath("/app/alerts");
}

/* ─────────────────────────────────────────────────────────────
   PERMISSIONS
   ───────────────────────────────────────────────────────────── */
export async function togglePermission(
  role: string,
  categoryId: string,
  permission: "can_view" | "can_export" | "can_modify",
  value: boolean
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("permissions")
    .update({ [permission]: value })
    .eq("role", role)
    .eq("category_id", categoryId);

  if (error) return { error: error.message };

  await logAudit("تعديل الصلاحيات", "permission", `${role}-${categoryId}`, {
    role,
    category: categoryId,
    permission,
    value,
  });

  revalidatePath("/app/permissions");
  revalidatePath("/app/audit");
  return { success: true };
}

/* ─────────────────────────────────────────────────────────────
   PROFILE / SETTINGS
   ───────────────────────────────────────────────────────────── */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = String(formData.get("full_name") || "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) return { error: error.message };

  await supabase.auth.updateUser({ data: { full_name: fullName } });
  await logAudit("تحديث الملف الشخصي", "profile", user.id, { fullName });

  revalidatePath("/app", "layout");
  return { success: true };
}

/* ─────────────────────────────────────────────────────────────
   API KEYS
   ───────────────────────────────────────────────────────────── */
export async function regenerateApiKey() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const newKey = `sirar_key_${cryptoRandom(32)}`;
  const preview = newKey.slice(0, 14) + "**************" + newKey.slice(-4);

  await supabase
    .from("api_keys")
    .update({ status: "revoked" })
    .eq("user_id", user.id)
    .eq("status", "active");

  const { error } = await supabase.from("api_keys").insert({
    user_id: user.id,
    name: "Default",
    key_hash: newKey,
    key_preview: preview,
    environment: "production",
    status: "active",
  });

  if (error) return { error: error.message };

  await logAudit("إنشاء مفتاح API جديد", "api_key", null);

  revalidatePath("/app/integrations");
  revalidatePath("/app/audit");
  return { success: true, key: newKey };
}

function cryptoRandom(len: number) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────
   CONVERSATIONS
   ───────────────────────────────────────────────────────────── */
export async function createConversation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title: "محادثة جديدة" })
    .select()
    .single();

  if (error) return { error: error.message };

  await logAudit("بدء محادثة جديدة", "conversation", data.id);
  revalidatePath("/app/chat");
  return { id: data.id };
}

export async function deleteConversation(id: string) {
  const supabase = await createClient();
  await supabase.from("conversations").delete().eq("id", id);
  await logAudit("حذف محادثة", "conversation", id);
  revalidatePath("/app/chat");
  return { success: true };
}

export async function renameConversation(id: string, title: string) {
  const supabase = await createClient();
  await supabase.from("conversations").update({ title }).eq("id", id);
  revalidatePath("/app/chat");
  return { success: true };
}

/* ─────────────────────────────────────────────────────────────
   SEED DEMO ALERTS — once per user
   ───────────────────────────────────────────────────────────── */
export async function seedDemoAlerts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { count } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) > 0) {
    return { success: true, message: "alerts already exist" };
  }

  const demo = [
    {
      title: "محاولة وصول غير مصرّح بها",
      description:
        "تم رصد محاولة وصول من عنوان IP غير معروف (192.168.45.12) إلى بيانات فئة A. تم حظر المحاولة تلقائياً.",
      severity: "high" as const,
      type: "security",
    },
    {
      title: "تحميل ملف يحتوي بيانات حساسة",
      description:
        "محاولة تحميل ملف 'customers_full.xlsx' يحوي 1,240 سجل بيانات شخصية. تم إيقاف العملية وفقاً لسياسة Zero Trust.",
      severity: "high" as const,
      type: "security",
    },
    {
      title: "تعديل غير معتاد على الصلاحيات",
      description:
        "تم تعديل صلاحيات وصول دور 'مدير القسم' لفئة A خارج الساعات الرسمية. يرجى المراجعة.",
      severity: "medium" as const,
      type: "permissions",
    },
    {
      title: "تسجيل دخول من موقع جغرافي جديد",
      description:
        "تسجيل دخول ناجح من 'الرياض، السعودية' لم يُستخدم من قبل لهذا الحساب.",
      severity: "low" as const,
      type: "auth",
    },
    {
      title: "نمو غير طبيعي في حجم البيانات",
      description:
        "زاد حجم بيانات فئة B بنسبة 47% خلال 24 ساعة. مراجعة موصى بها للتأكد من شرعية المصدر.",
      severity: "medium" as const,
      type: "monitoring",
    },
    {
      title: "اكتشاف بيانات صحية حساسة",
      description:
        "محرّك التحليل اكتشف 18 سجل يحتوي على معلومات صحية. تم تصنيفها فئة A تلقائياً.",
      severity: "medium" as const,
      type: "classification",
    },
    {
      title: "فشل المصادقة المتكرر",
      description:
        "5 محاولات تسجيل دخول فاشلة لحساب 'manager@company.sa' خلال آخر 10 دقائق.",
      severity: "high" as const,
      type: "auth",
    },
    {
      title: "تصدير بيانات فئة A بدون إذن",
      description:
        "محاولة تصدير 500 سجل من فئة A عبر API. تم حظر العملية تلقائياً وفقاً لسياسة الحماية.",
      severity: "high" as const,
      type: "security",
    },
    {
      title: "انتهاء صلاحية شهادة SSL",
      description:
        "شهادة SSL لخادم البيانات الداخلي ستنتهي خلال 7 أيام. يُنصح بالتجديد فوراً.",
      severity: "medium" as const,
      type: "monitoring",
    },
    {
      title: "تغيير في سياسة النسخ الاحتياطي",
      description:
        "تم تعديل جدولة النسخ الاحتياطي من يومي إلى أسبوعي. يرجى التأكد أن هذا التغيير مقصود.",
      severity: "low" as const,
      type: "monitoring",
    },
  ];

  const inserts = demo.map((d) => ({
    user_id: user.id,
    title: d.title,
    description: d.description,
    severity: d.severity,
    type: d.type,
    status: "active",
  }));

  const { error } = await supabase.from("alerts").insert(inserts);
  if (error) return { error: error.message };

  revalidatePath("/app/alerts");
  revalidatePath("/app");
  return { success: true, count: inserts.length };
}

/* ─────────────────────────────────────────────────────────────
   AUTH — sign out
   ───────────────────────────────────────────────────────────── */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/* ─────────────────────────────────────────────────────────────
   LOG NAVIGATION (client-fired — used to track significant page visits)
   ───────────────────────────────────────────────────────────── */
export async function logNavigation(page: string) {
  await logAudit(`زيارة صفحة: ${page}`, "navigation", null);
  revalidatePath("/app/audit");
}
