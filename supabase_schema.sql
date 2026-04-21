-- 1. Criar a tabela de perfis (Profiles)
-- Esta tabela estende os dados do usuário que o Supabase Auth gerencia
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  whatsapp text,
  helmet_color text default '#22C55E',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar o Row Level Security (RLS)
-- Isso impede que um usuário apague os dados de outro
alter table public.profiles enable row level security;

-- 3. Criar Políticas de Acesso (Policies)
-- Qualquer um pode ver o perfil de outros (para aparecer no mapa)
create policy "Perfis são visíveis para todos" on public.profiles
  for select using (true);

-- O usuário só pode atualizar o seu próprio perfil
create policy "Usuários podem atualizar o próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- 4. Função para criar o perfil automaticamente após o cadastro
-- Assim que o usuário confirma o e-mail, o Supabase cria a linha na tabela profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, whatsapp, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'whatsapp',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que dispara a função acima
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();