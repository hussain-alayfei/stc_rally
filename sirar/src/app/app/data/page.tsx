import { Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/cache";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export default async function DataPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: records } = user
    ? await supabase
        .from("data_records")
        .select("id, name, email, phone, data_type, category, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-brand" />
            البيانات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            إدارة جميع البيانات المدخلة في النظام — {records?.length ?? 0} سجل
          </p>
        </div>
      </div>

      <DataTable initial={records ?? []} />
    </div>
  );
}
