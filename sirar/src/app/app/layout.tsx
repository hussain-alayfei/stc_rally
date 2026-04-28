import { redirect } from "next/navigation";
import { getCurrentUser, getDisplayName } from "@/lib/supabase/cache";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const display = await getDisplayName();

  return (
    <AppShell
      userName={display.fullName}
      userFirstName={display.firstName}
      userEmail={display.email}
      userRole={display.role}
      userPlan={display.plan}
    >
      {children}
    </AppShell>
  );
}
