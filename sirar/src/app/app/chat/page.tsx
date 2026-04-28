import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/cache";

export const dynamic = "force-dynamic";

const ACTIVE_COOKIE = "sirar_active_conv";

/**
 * `/app/chat` — entry point. Always redirects to a specific
 * conversation URL so the user has a stable, shareable, back-able
 * route. Order of preference:
 *   1. last-active conversation from cookie (still owned by user)
 *   2. most recently updated conversation
 *   3. create a fresh one
 */
export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const cookieStore = await cookies();
  const lastActive = cookieStore.get(ACTIVE_COOKIE)?.value;

  if (lastActive) {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", lastActive)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) redirect(`/app/chat/${existing.id}`);
  }

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (conversations && conversations.length > 0) {
    redirect(`/app/chat/${conversations[0].id}`);
  }

  const { data: fresh } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title: "محادثة جديدة" })
    .select("id")
    .single();

  if (fresh) redirect(`/app/chat/${fresh.id}`);

  redirect("/app");
}
