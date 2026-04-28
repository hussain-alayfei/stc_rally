import { redirect } from "next/navigation";
import { getCurrentUser, getDisplayName } from "@/lib/supabase/cache";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [display, supabase] = await Promise.all([
    getDisplayName(),
    createClient(),
  ]);

  const { count } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  return (
    <AppShell
      userName={display.fullName}
      userFirstName={display.firstName}
      userEmail={display.email}
      userRole={display.role}
      userPlan={display.plan}
      alertCount={count ?? 0}
    >
      {children}
    </AppShell>
  );
}
