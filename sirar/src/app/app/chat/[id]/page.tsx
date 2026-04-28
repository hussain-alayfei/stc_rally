import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/cache";
import { ChatUI } from "../chat-ui";

export const dynamic = "force-dynamic";

const ACTIVE_COOKIE = "sirar_active_conv";

export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!conv) redirect("/app/chat");

  // Remember as last active for next time
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_COOKIE, id, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  const [messagesRes, conversationsRes] = await Promise.all([
    supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("conversations")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <ChatUI
      conversationId={id}
      conversationTitle={conv.title}
      conversations={conversationsRes.data ?? []}
      initialMessages={(messagesRes.data ?? []).map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        created_at: m.created_at,
      }))}
    />
  );
}
