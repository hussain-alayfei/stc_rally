import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatUI } from "../chat-ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify ownership
  const { data: conv } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!conv) redirect("/app/chat");

  // Load messages
  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  // Load conversation list for sidebar
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);

  return (
    <ChatUI
      conversationId={id}
      conversations={conversations ?? []}
      initialMessages={(messages ?? []).map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        created_at: m.created_at,
      }))}
    />
  );
}
