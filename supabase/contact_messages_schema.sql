create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new'
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_messages_status_check'
  ) then
    alter table public.contact_messages
      add constraint contact_messages_status_check
      check (status in ('new', 'in_progress', 'answered'));
  end if;
end;
$$;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create or replace function public.set_contact_messages_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;

create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row
execute function public.set_contact_messages_updated_at();

alter table public.contact_messages enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.contact_messages to anon;
grant insert, select, update on public.contact_messages to authenticated;

drop policy if exists "Anyone can create contact messages" on public.contact_messages;
create policy "Anyone can create contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (status = 'new');

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
on public.contact_messages
for select
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update contact message status" on public.contact_messages;
create policy "Admins can update contact message status"
on public.contact_messages
for update
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
