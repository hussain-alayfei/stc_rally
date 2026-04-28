-- SIRAR Database Schema

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  avatar_url text,
  role text not null default 'user',
  plan text not null default 'free' check (plan in ('free', 'plus')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Categories (A, B, C)
create table if not exists public.categories (
  id text primary key,
  name_ar text not null,
  sensitivity_level text not null,
  description_ar text not null,
  examples jsonb not null default '[]',
  access_rules jsonb not null default '[]',
  color text not null default '#6F4FE8'
);

alter table public.categories enable row level security;
create policy "Categories are public-read" on public.categories for select using (true);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'محادثة جديدة',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
create policy "Users can manage own conversations" on public.conversations for all using (auth.uid() = user_id);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null default '',
  parts jsonb,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
create policy "Users can manage own messages" on public.messages for all using (
  exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid())
);

-- Data Records
create table if not exists public.data_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'chat',
  category text not null check (category in ('A', 'B', 'C')),
  sensitivity_score numeric not null default 0,
  data_type text not null default 'personal',
  name text not null default '',
  email text,
  phone text,
  national_id text,
  birth_date text,
  address text,
  bank_name text,
  account_number text,
  balance numeric,
  fields jsonb not null default '{}',
  masked_fields jsonb not null default '{}',
  status text not null default 'active' check (status in ('active', 'archived', 'flagged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.data_records enable row level security;
create policy "Users can manage own data records" on public.data_records for all using (auth.uid() = user_id);

-- API Keys
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Default',
  key_hash text not null,
  key_preview text not null,
  environment text not null default 'production' check (environment in ('production', 'development')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.api_keys enable row level security;
create policy "Users can manage own API keys" on public.api_keys for all using (auth.uid() = user_id);

-- Alerts
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  severity text not null default 'medium' check (severity in ('high', 'medium', 'low')),
  title text not null,
  description text not null default '',
  type text not null default 'security',
  status text not null default 'active' check (status in ('active', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;
create policy "Users can manage own alerts" on public.alerts for all using (auth.uid() = user_id);

-- Audit Logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target_type text not null default '',
  target_id text,
  metadata jsonb not null default '{}',
  ip text,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
create policy "Users can view own audit logs" on public.audit_logs for select using (auth.uid() = user_id);
create policy "Service can insert audit logs" on public.audit_logs for insert with check (true);

-- Permissions
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  category_id text not null references public.categories(id),
  can_view boolean not null default false,
  can_export boolean not null default false,
  can_modify boolean not null default false
);

alter table public.permissions enable row level security;
create policy "Permissions are public-read" on public.permissions for select using (true);

-- Integration Health
create table if not exists public.integration_health (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'connected' check (status in ('connected', 'disconnected', 'error')),
  last_check_at timestamptz not null default now(),
  request_count_24h integer not null default 0
);

alter table public.integration_health enable row level security;
create policy "Users can manage own integration health" on public.integration_health for all using (auth.uid() = user_id);
