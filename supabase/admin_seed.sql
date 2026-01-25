-- ======================================================
-- 🛠️ SCRIPT DE CRÉATION DE L'ADMIN PAR DÉFAUT
-- ======================================================

-- 1. Insérer l'utilisateur dans auth.users (si n'existe pas)
-- Note: Le mot de passe 'Jesugo123' est haché ici. 
-- Supabase utilise un format spécifique, ce script utilise une méthode compatible.

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  is_sso_user,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'dansoumarcellinjesugo@gmail.com',
  crypt('Jesugo123', gen_salt('bf')),
  now(), -- C'est ici qu'on confirme l'email
  false,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Marcellin Jesugo"}',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'dansoumarcellinjesugo@gmail.com'
);

-- Si l'utilisateur existait déjà mais n'était pas confirmé
UPDATE auth.users 
SET email_confirmed_at = now(), updated_at = now()
WHERE email = 'dansoumarcellinjesugo@gmail.com' AND email_confirmed_at IS NULL;

-- 2. Récupérer l'ID et mettre à jour le profil public vers 'admin'
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dansoumarcellinjesugo@gmail.com';
  
  -- S'assurer que le profil existe (normalement créé par trigger)
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (v_user_id, 'Marcellin Jesugo', 'admin')
  ON CONFLICT (id) DO UPDATE 
  SET role = 'admin', full_name = 'Marcellin Jesugo';
END $$;
