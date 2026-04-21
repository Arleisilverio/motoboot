-- Atualiza a função que cria o perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Define quem é administrador pelo e-mail
  IF new.email IN ('arleisilverio41@gmail.com', 'arlei.se.silverio85@gmail.com', 'casadeapoiohope@hotmail.com') THEN
    user_role := 'admin';
  ELSE
    user_role := 'motoboy';
  END IF;

  -- Insere os dados na tabela profiles, incluindo o WhatsApp que vem do cadastro
  INSERT INTO public.profiles (id, email, name, whatsapp, role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', 'Membro Motoboot'),
    new.raw_user_meta_data ->> 'whatsapp',
    user_role,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    whatsapp = EXCLUDED.whatsapp,
    role = EXCLUDED.role,
    updated_at = now();

  RETURN new;
END;
$function$;