import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Verificação de segurança das variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Middleware: Supabase environment variables are missing!')
    return response
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // 2. Refresh session se necessário
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      // Se houver erro de auth, não trava o middleware, apenas loga
      console.warn('Middleware Auth Warning:', userError.message)
    }

    // 3. Proteger rotas que exigem login
    const isProfilePage = request.nextUrl.pathname.startsWith('/perfil')
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = request.nextUrl.pathname.startsWith('/login')

    if (!user && (isProfilePage || isAdminPage)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirecionar usuário logado para longe do login
    if (user && isLoginPage) {
      return NextResponse.redirect(new URL('/perfil', request.url))
    }

    // 4. Proteção extra para admin (verifica papel no banco)
    if (user && isAdminPage) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

  } catch (err) {
    // 5. CAUSA PRINCIPAL DO ERRO 500: Se qualquer coisa acima falhar, o try-catch impede o crash
    console.error('CRITICAL MIDDLEWARE ERROR:', err)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
