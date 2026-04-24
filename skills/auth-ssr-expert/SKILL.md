---
name: auth-ssr-expert
description: Melhores práticas para Supabase SSR no Next.js App Router.
---

# Skill Supabase Auth SSR

O uso do Supabase no Next.js App Router requer distinção clara entre Cliente (Navegador) e Servidor (Node.js). Se você errar o cliente, causará falhas de sessão e vazamentos de cookies.

## 1. No Lado do Cliente (Client Components)
**O que é:** Arquivos marcados com `'use client'`.
**Como usar:** Importe o cliente singleton instanciado em `@/integrations/supabase/client`.
Nunca chame `createBrowserClient` diretamente nos componentes.

**Exemplo CORRETO (Client):**
```tsx
'use client';
import { supabase } from '@/integrations/supabase/client';

const logOut = async () => {
  await supabase.auth.signOut();
}
```

## 2. No Lado do Servidor (Server Components)
**O que é:** Páginas, Layouts e APIs (`page.tsx`, `layout.tsx`, `route.ts`).
**Como usar:** Use a API Server-Side, passando acesso aos cookies do Next.js.
*Nós ainda não temos o cliente servidor implementado em `src/lib/supabase` no código legado, então o padrão provisório ou a ser criado é usar a lib @supabase/ssr*.

**Exemplo Básico (Server Component):**
Se for necessário criar o cliente no servidor, ele exige acesso a `cookies()`.

```tsx
// Exemplo de como checar a sessão em um layout (Server Component)
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Pode falhar silenciosamente se chamado num Server Component de renderização passiva
          }
        },
      },
    }
  );
}
```

## Diretrizes para a IA:
- **Regra de Ouro:** Não tente buscar o usuário no banco de dados via Client Component se a página precisar piscar ou mostrar um loader grande. Prefira verificar o usuário pelo `useAuth()` do `AuthProvider` que já criamos e mapeamos globalmente.
- O app Motoboot usa um `AuthProvider` em `src/providers/AuthProvider.tsx`. Sempre consuma `const { user, profile } = useAuth()` no frontend, ao invés de bater repetidas vezes na API do Supabase em vários componentes.
