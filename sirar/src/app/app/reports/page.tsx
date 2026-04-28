import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/cache";
import { ReportsClient } from "./reports-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const [recordsRes, alertsRes, permissionsRes] = await Promise.all([
    supabase
      .from("data_records")
      .select("id, name, category, data_type, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("alerts")
      .select("id, title, severity, status, type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("permissions")
      .select("role, category_id, can_view, can_export, can_modify")
      .limit(20),
  ]);

  const records = recordsRes.data ?? [];
  const alerts = alertsRes.data ?? [];
  const permissions = permissionsRes.data ?? [];

  const categoryCounts = {
    A: records.filter((r) => r.category === "A").length,
    B: records.filter((r) => r.category === "B").length,
    C: records.filter((r) => r.category === "C").length,
  };

  const alertsByStatus = {
    active: alerts.filter((a) => a.status === "active").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  };

  const alertsBySeverity = {
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
  };

  const dateGroups: Record<string, number> = {};
  records.forEach((r) => {
    const d = new Date(r.created_at).toLocaleDateString("en-CA");
    dateGroups[d] = (dateGroups[d] || 0) + 1;
  });
  const timeline = Object.entries(dateGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("ar-SA", { day: "numeric", month: "short" }),
      count,
    }));

  return (
    <ReportsClient
      totalRecords={records.length}
      categoryCounts={categoryCounts}
      alertsByStatus={alertsByStatus}
      alertsBySeverity={alertsBySeverity}
      totalAlerts={alerts.length}
      timeline={timeline}
      recentRecords={records.slice(0, 5).map((r) => ({
        name: r.name,
        category: r.category,
        type: r.data_type,
        date: new Date(r.created_at).toLocaleDateString("ar-SA"),
      }))}
      recentAlerts={alerts.slice(0, 5).map((a) => ({
        title: a.title,
        severity: a.severity,
        status: a.status,
        date: new Date(a.created_at).toLocaleDateString("ar-SA"),
      }))}
      permissions={permissions.map((p) => ({
        role: p.role,
        category: p.category_id,
        canView: p.can_view,
        canExport: p.can_export,
        canModify: p.can_modify,
      }))}
    />
  );
}
