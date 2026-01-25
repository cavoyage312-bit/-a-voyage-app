-- ======================================================
-- 🛠️ SCRIPT DE RÉPARATION COMPLET (VERSION CORRIGÉE - ORDRE)
-- ======================================================

-- 1. [SÉCURITÉ] Créer les tables si elles manquent
CREATE TABLE IF NOT EXISTS public.apartments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  partner_id uuid,
  title text NOT NULL,
  city text NOT NULL,
  price_per_night numeric NOT NULL,
  is_published boolean DEFAULT true
);

-- 2. [CONTRAINTE] Élargir les types de services acceptés
ALTER TABLE public.partners DROP CONSTRAINT IF EXISTS partners_service_type_check;
ALTER TABLE public.partners ADD CONSTRAINT partners_service_type_check 
CHECK (service_type IN ('hotel', 'apartment', 'bus', 'car', 'transport', 'activity', 'other'));

-- 3. [FONCTION] Créer la fonction is_admin() en PREMIER (pour éviter les erreurs de dépendance)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated, anon;

-- 4. [RLS] Nettoyage et activation
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Nettoyage Partenaires
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'partners' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.partners';
    END LOOP;
END $$;

-- Nettoyage Profiles
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.profiles';
    END LOOP;
END $$;

-- 5. [POLITIQUES] Partenaires
CREATE POLICY "enable_insert_for_all" ON public.partners FOR INSERT WITH CHECK (true);
CREATE POLICY "enable_select_for_owner_or_anon" ON public.partners FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "enable_all_for_admins" ON public.partners FOR ALL USING (public.is_admin());

-- 6. [POLITIQUES] Profiles
CREATE POLICY "profiles_read_own" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_manage_all" ON public.profiles FOR ALL USING (auth.uid() = id OR public.is_admin());

-- 7. [PERMISSIONS]
GRANT ALL ON public.partners TO anon, authenticated, service_role;
GRANT ALL ON public.profiles TO anon, authenticated, service_role;
GRANT ALL ON public.apartments TO anon, authenticated, service_role;
