import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AlertsList } from "./alerts-list";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AlertsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: alerts } = user
    ? await supabase
        .from("alerts")
        .select("id, title, description, severity, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const activeCount = (alerts ?? []).filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            المخاطر والتنبيهات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            متابعة التنبيهات الأمنية — {activeCount} تنبيه نشط
          </p>
        </div>
      </div>

      <AlertsList initial={alerts ?? []} />
    </div>
  );
}
