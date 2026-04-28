import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function validateApiKey(req: NextRequest): Promise<{ valid: boolean; userId?: string }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false };
  }

  const token = authHeader.slice(7);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key_hash", token)
    .eq("status", "active")
    .single();

  if (!data) {
    return { valid: false };
  }

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_hash", token);

  return { valid: true, userId: data.user_id };
}
