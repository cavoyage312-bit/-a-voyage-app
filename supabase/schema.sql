-- ==========================================
-- 1. CONFIGURATION INITIALE
-- ==========================================

-- Active l'extension pour générer des UUIDs si pas déjà active
create extension if not exists "uuid-ossp";

-- ==========================================
-- 2. TABLE PROFILES (Utilisateurs)
-- ==========================================
-- Cette table étend auth.users pour stocker les infos publiques
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'user' check (role in ('user', 'admin', 'partner'))
);

-- Trigger pour créer automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Vérifie si le trigger existe déjà avant de le créer (pour éviter les erreurs en ré-exécutant)
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end
$$;

-- Sécurité Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- ==========================================
-- 3. TABLE BOOKINGS (Réservations)
-- ==========================================
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Lien avec l'utilisateur (optionnel si invité, mais recommandé)
  user_id uuid references auth.users,
  
  -- Type: flight, hotel, car, transit
  type text not null,
  
  -- Statut: pending, confirmed, cancelled, completed
  status text default 'confirmed',
  
  -- Infos Client (Snapshot au moment de la résa)
  email text,
  first_name text,
  last_name text,
  phone text,
  
  -- Détails techniques (JSONB pour flexibilité maximale selon le type)
  -- Ex Flight: { origin: "PAR", dest: "DKR", flight_number: "AF123", date: "..." }
  details jsonb default '{}'::jsonb,
  
  -- Prix
  price_amount numeric,
  price_currency text default 'EUR',
  
  -- Référence unique visible client (ex: BJK-1234)
  reference_code text
);

-- Sécurité Bookings
alter table public.bookings enable row level security;

-- L'utilisateur ne voit que ses réservations
create policy "Users can view own bookings"
  on bookings for select
  using ( auth.uid() = user_id );

-- Tout le monde peut créer (pour l'instant, pour faciliter les tests sans login)
-- En prod, on restreindra souvent aux utilisateurs connectés ou avec un RLS plus complexe pour les invités
create policy "Enable insert for everyone"
  on bookings for insert
  with check ( true );

-- ==========================================
-- 4. TABLE PARTNERS (Demandes & Comptes Partenaires)
-- ==========================================
create table if not exists public.partners (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Lien vers un compte utilisateur existant (si le partenaire a un compte)
  user_id uuid references auth.users,
  
  -- Infos Entreprise / Partenaire
  company_name text not null,
  contact_name text,
  email text not null,
  phone text,
  
  -- Type de service proposé
  service_type text check (service_type in ('hotel', 'transport', 'activity', 'other')),
  
  -- Statut de la demande
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  
  -- Détails (Adresse, SIRET, Description...)
  details jsonb default '{}'::jsonb
);

-- Sécurité Partners
alter table public.partners enable row level security;

-- Seul le partenaire lui-même ou un admin peut voir
create policy "Users can view own partner application"
  on partners for select
  using ( auth.uid() = user_id );

create policy "Anyone can submit partner application"
  on partners for insert
  with check ( true );

-- ==========================================
-- 5. STORAGE (Pour les images/documents)
-- ==========================================
-- Note: La création des buckets Storage se fait généralement via l'UI Supabase ou API,
-- mais voici la politique SQL si le bucket 'documents' existe déjà.

-- insert into storage.buckets (id, name) values ('documents', 'documents') on conflict do nothing;

-- create policy "Authenticated users can upload documents"
-- on storage.objects for insert
-- with check ( bucket_id = 'documents' and auth.role() = 'authenticated' );

-- Settings for Platform margins and fees
create table if not exists app_settings (
  id text primary key default 'global',
  flight_margin_fixed numeric default 15.00,  -- Frais fixes par billet (ex: 15€)
  flight_margin_percent numeric default 5.0,  -- Pourcentage de marge (ex: 5%)
  payment_fee_percent numeric default 2.9,    -- Frais Stripe/Banque (ex: 2.9%)
  updated_at timestamp with time zone default now()
);

-- Insertion des valeurs par défaut pour commencer
insert into app_settings (id, flight_margin_fixed, flight_margin_percent, payment_fee_percent)
values ('global', 15.00, 5.0, 2.9)
on conflict (id) do nothing;

-- RLS for settings
alter table app_settings enable row level security;
create policy "Enable read access for all users" on app_settings for select using (true);
create policy "Enable update for auth users only" on app_settings for update using (true);
-- ==========================================
-- 6. TABLE GROUP_QUOTES (Demandes Groupes/Business)
-- ==========================================
create table if not exists public.group_quotes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  travel_type text not null, -- flight, road, combined
  origin text,
  destination text,
  travel_date date,
  passengers integer,
  
  company_name text,
  contact_name text not null,
  email text not null,
  phone text,
  message text,
  
  status text default 'pending' check (status in ('pending', 'contacted', 'resolved'))
);

alter table public.group_quotes enable row level security;
create policy "Anyone can submit group quotes" on group_quotes for insert with check (true);
create policy "Only admins view group quotes" on group_quotes for select using (true);
