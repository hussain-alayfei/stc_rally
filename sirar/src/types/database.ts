export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  plan: "free" | "plus";
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  parts: Record<string, unknown> | null;
  created_at: string;
}

export interface DataRecord {
  id: string;
  user_id: string;
  source: string;
  category: "A" | "B" | "C";
  sensitivity_score: number;
  data_type: string;
  name: string;
  email: string | null;
  phone: string | null;
  national_id: string | null;
  birth_date: string | null;
  address: string | null;
  bank_name: string | null;
  account_number: string | null;
  balance: number | null;
  fields: Record<string, unknown>;
  masked_fields: Record<string, unknown>;
  status: "active" | "archived" | "flagged";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  sensitivity_level: string;
  description_ar: string;
  examples: { icon: string; label: string }[];
  access_rules: { icon: string; label: string }[];
  color: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_preview: string;
  environment: "production" | "development";
  status: "active" | "revoked";
  last_used_at: string | null;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  type: string;
  status: "active" | "resolved" | "dismissed";
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  created_at: string;
}
