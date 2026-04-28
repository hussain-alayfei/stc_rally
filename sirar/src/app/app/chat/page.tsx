import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatUI } from "./chat-ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get or create active conversation
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);

  let activeId: string;
  if (!conversations || conversations.length === 0) {
    const { data: newConv } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: "محادثة جديدة" })
      .select()
      .single();
    activeId = newConv?.id;
  } else {
    activeId = conversations[0].id;
  }

  return (
    <ChatUI
      conversationId={activeId}
      conversations={conversations ?? []}
      initialMessages={[]}
    />
  );
}
