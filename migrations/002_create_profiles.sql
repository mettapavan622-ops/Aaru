-- AARU persistent customer profile store
-- Run this in Supabase SQL Editor AFTER Supabase Auth is enabled.
-- Passwords are NEVER stored here. Supabase Auth owns email/password credentials.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default 'Store Patron',
  phone text default '',
  role text not null default 'USER' check (role in ('USER', 'ADMIN')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'SUSPENDED', 'REVOKED')),
  cart jsonb not null default '[]'::jsonb,
  wishlist jsonb not null default '[]'::jsonb,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles (lower(email));
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_status on public.profiles (status);

-- Automatically create a profile whenever a new Supabase Auth user signs up.
create or replace function public.handle_new_aaru_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone, role, status)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    case when lower(new.email) = 'aarubymoni@admin.co.in' then 'ADMIN' else 'USER' end,
    'ACTIVE'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(nullif(excluded.name, ''), public.profiles.name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_aaru on auth.users;
create trigger on_auth_user_created_aaru
after insert on auth.users
for each row execute procedure public.handle_new_aaru_user();

-- RLS is enabled so the public/anon key cannot read everybody's profiles.
-- AARU's server uses SUPABASE_SERVICE_ROLE_KEY for administrative/profile work.
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- No client-side UPDATE policy is granted. Role/status/cart/wishlist changes are
-- performed by the AARU server with the service-role key, preventing a customer
-- from changing their own role to ADMIN.


-- Repair profiles for any Supabase Auth users that already existed before this migration.
insert into public.profiles (id, email, name, phone, role, status, created_at)
select
  u.id,
  lower(u.email),
  coalesce(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'phone', ''),
  case when lower(u.email) = 'aarubymoni@admin.co.in' then 'ADMIN' else 'USER' end,
  'ACTIVE',
  u.created_at
from auth.users u
on conflict (id) do nothing;

-- Optional: if the root administrator already exists in Supabase Auth,
-- this keeps the profile role aligned with the existing AARU admin account.
update public.profiles
set role = 'ADMIN', status = 'ACTIVE', updated_at = now()
where lower(email) = 'aarubymoni@admin.co.in';
