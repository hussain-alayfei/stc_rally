import { redirect } from "next/navigation";
import { getCurrentUser, getDisplayName } from "@/lib/supabase/cache";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    redirect("/login");
  }
  if (!user) redirect("/login");

  let display = {
    fullName: user.email?.split("@")[0] || "مستخدم",
    firstName: user.email?.split("@")[0] || "مستخدم",
    email: user.email || "",
    role: "user",
    plan: "free",
  };
  let alertCount = 0;

  try {
    const [d, supabase] = await Promise.all([
      getDisplayName(),
      createClient(),
    ]);
    display = d;

    const { count } = await supabase
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");

    alertCount = count ?? 0;
  } catch {
    // DB may be unreachable — continue with defaults
  }

  return (
    <AppShell
      userName={display.fullName}
      userFirstName={display.firstName}
      userEmail={display.email}
      userRole={display.role}
      userPlan={display.plan}
      alertCount={alertCount}
    >
      {children}
    </AppShell>
  );
}
