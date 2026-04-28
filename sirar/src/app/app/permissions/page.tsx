import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PermissionsTable } from "./permissions-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PermissionsPage() {
  const supabase = await createClient();

  const { data: perms } = await supabase
    .from("permissions")
    .select("role, category_id, can_view, can_export, can_modify");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-brand" />
          الصلاحيات
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          انقر على أي مفتاح لتفعيل أو إلغاء الصلاحية — التغييرات تُحفظ تلقائياً
        </p>
      </div>

      <PermissionsTable initial={perms ?? []} />
    </div>
  );
}
