-- Krawiectwo MARIJA - Admin panel v1 schema
-- Run this file in Supabase SQL Editor after the initial products schema exists.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create index if not exists categories_active_sort_idx
  on public.categories (is_active, sort_order, name);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  description text,
  cover_image text,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create index if not exists collections_active_sort_idx
  on public.collections (is_active, sort_order, title);

alter table public.products
  add column if not exists category_id uuid references public.categories(id) on delete set null,
  add column if not exists collection_id uuid references public.collections(id) on delete set null,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists featured boolean not null default false;

create index if not exists products_category_id_idx
  on public.products (category_id);

create index if not exists products_collection_id_idx
  on public.products (collection_id);

create index if not exists products_featured_active_idx
  on public.products (featured, is_active, sort_order);

alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
using (is_active = true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read active collections" on public.collections;
create policy "Public can read active collections"
on public.collections
for select
using (is_active = true);

drop policy if exists "Admins can manage collections" on public.collections;
create policy "Admins can manage collections"
on public.collections
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (is_active = true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read images for active products" on public.product_images;
create policy "Public can read images for active products"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active = true
  )
);

drop policy if exists "Admins can manage product images" on public.product_images;
create policy "Admins can manage product images"
on public.product_images
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read product storage" on storage.objects;
create policy "Public can read product storage"
on storage.objects
for select
using (bucket_id = 'products');

drop policy if exists "Admins can upload product storage" on storage.objects;
create policy "Admins can upload product storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'products'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "Admins can update product storage" on storage.objects;
create policy "Admins can update product storage"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'products'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'products'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- After creating an Auth user in Supabase, replace the email below and run:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
-- where email = 'admin@example.com';
