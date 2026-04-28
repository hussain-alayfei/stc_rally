import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get authenticated user (secure server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile from DB
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, plan")
    .eq("id", user.id)
    .single();

  // Use profile data or fallback to auth metadata
  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "مستخدم";

  const firstName = fullName.split(" ")[0]; // first word of name

  return (
    <AppShell
      userName={fullName}
      userFirstName={firstName}
      userEmail={user.email || ""}
      userRole={profile?.role || "user"}
      userPlan={profile?.plan || "free"}
    >
      {children}
    </AppShell>
  );
}
