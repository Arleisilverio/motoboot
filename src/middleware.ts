import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = "https://cijhhohosmmvbednsapf.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpamhob2hvc21tdmJlZG5zYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjAyMDUsImV4cCI6MjA3NDY5NjIwNX0.KQsXtPydEpJTm9UKGln1O0IUzwylL41CkUCU_pBPZrY";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return request.cookies.get(name)?.value },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/perfil') || request.nextUrl.pathname.startsWith('/admin')

  // Se logado e na página de login, vai para a Home
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se não logado e em rota protegida, vai para o login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}