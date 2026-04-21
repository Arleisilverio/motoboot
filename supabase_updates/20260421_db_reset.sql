-- Database Reset and Motoboot Preparation
-- Date: 2026-04-21

-- Step 1: Cleanup legacy data
SET session_replication_role = 'replica';
TRUNCATE TABLE public.services CASCADE;
TRUNCATE TABLE public.clients CASCADE;
TRUNCATE TABLE public.collaborators CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Step 2: Clear all auth users for relative fresh start
DELETE FROM auth.users;

-- Step 3: Restore origin role to enable triggers
SET session_replication_role = 'origin';

-- Step 4: Update the profile creation function with new admin emails and metadata handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, whatsapp, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'whatsapp', ''),
    CASE 
      WHEN new.email IN ('arlei85@hotmail.com', 'arleisilverio41@gmail.com') THEN 'admin'
      ELSE 'motoboy'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    name = CASE WHEN public.profiles.name IS NULL OR public.profiles.name = '' THEN excluded.name ELSE public.profiles.name END,
    whatsapp = CASE WHEN public.profiles.whatsapp IS NULL THEN excluded.whatsapp ELSE public.profiles.whatsapp END,
    role = excluded.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Re-create the trigger to be sure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
