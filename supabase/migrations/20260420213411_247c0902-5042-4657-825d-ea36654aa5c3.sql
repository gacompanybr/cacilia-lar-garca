-- =========================================
-- ENUMS
-- =========================================
create type public.app_role as enum ('corretor', 'comprador');
create type public.property_type as enum ('casa', 'apartamento', 'terreno', 'comercial');
create type public.property_status as enum ('venda', 'aluguel');

-- =========================================
-- PROFILES
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- =========================================
-- USER ROLES (separate table — security best practice)
-- =========================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to avoid recursive RLS
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Corretores can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'corretor'));

create policy "Corretores can insert roles"
  on public.user_roles for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'corretor'));

create policy "Corretores can delete roles"
  on public.user_roles for delete
  to authenticated
  using (public.has_role(auth.uid(), 'corretor'));

-- =========================================
-- TRIGGER: auto-create profile + default role on signup
-- =========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'comprador');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- updated_at helper
-- =========================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =========================================
-- PROPERTIES
-- =========================================
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type property_type not null,
  status property_status not null default 'venda',
  price numeric(12,2) not null,
  city text not null,
  neighborhood text,
  bedrooms int,
  bathrooms int,
  parking int,
  area numeric(10,2),
  description text not null,
  features text[] default '{}',
  featured boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

create policy "Properties viewable by everyone"
  on public.properties for select
  using (true);

create policy "Corretores can insert properties"
  on public.properties for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'corretor'));

create policy "Corretores can update properties"
  on public.properties for update
  to authenticated
  using (public.has_role(auth.uid(), 'corretor'));

create policy "Corretores can delete properties"
  on public.properties for delete
  to authenticated
  using (public.has_role(auth.uid(), 'corretor'));

create trigger properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

create index properties_type_idx on public.properties(type);
create index properties_city_idx on public.properties(city);
create index properties_featured_idx on public.properties(featured);

-- =========================================
-- PROPERTY IMAGES
-- =========================================
create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.property_images enable row level security;

create policy "Property images viewable by everyone"
  on public.property_images for select
  using (true);

create policy "Corretores can insert images"
  on public.property_images for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'corretor'));

create policy "Corretores can update images"
  on public.property_images for update
  to authenticated
  using (public.has_role(auth.uid(), 'corretor'));

create policy "Corretores can delete images"
  on public.property_images for delete
  to authenticated
  using (public.has_role(auth.uid(), 'corretor'));

create index property_images_property_idx on public.property_images(property_id);

-- =========================================
-- STORAGE BUCKET
-- =========================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true);

create policy "Public can view property images"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Corretores can upload property images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and public.has_role(auth.uid(), 'corretor')
  );

create policy "Corretores can update property images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and public.has_role(auth.uid(), 'corretor')
  );

create policy "Corretores can delete property images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and public.has_role(auth.uid(), 'corretor')
  );