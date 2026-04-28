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
export async function addDataRecord(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;
  const dataType = String(formData.get("data_type") || "personal");
  const category = String(formData.get("category") || "B") as "A" | "B" | "C";

  if (!name) return { error: "الاسم مطلوب" };

  const { data, error } = await supabase
    .from("data_records")
    .insert({
      user_id: user.id,
      source: "manual",
      category,
      sensitivity_score: category === "A" ? 95 : category === "B" ? 65 : 30,
      data_type: dataType,
      name,
      email,
      phone,
      status: "active",
      fields: { name, email, phone },
      masked_fields: {},
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await logAudit("إضافة سجل بيانات", "data_record", data.id, {
    name,
    category,
  });

  revalidatePath("/app/data");
  revalidatePath("/app/audit");
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
