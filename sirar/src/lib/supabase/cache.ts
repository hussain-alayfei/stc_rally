import { cache } from "react";
import { createClient } from "./server";

/**
 * Cached helpers using React's `cache()`.
 * These dedupe identical calls within the SAME server request,
 * so Layout + Page can both call `getCurrentUser()` and only one
 * network round-trip happens.
 */

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, role, plan, avatar_url")
    .eq("id", user.id)
    .single();
  return data;
});

export const getDisplayName = cache(async () => {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ]);
  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "مستخدم";
  return {
    fullName,
    firstName: fullName.split(" ")[0],
    email: user?.email || "",
    role: profile?.role || "user",
    plan: profile?.plan || "free",
  };
});
