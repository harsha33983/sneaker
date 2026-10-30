import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url && anonKey && !url.includes('placeholder') && !anonKey.includes('placeholder')
  );

  const pathname = request.nextUrl.pathname;

  // If Supabase is configured, check real session
  if (isConfigured) {
    try {
      const supabase = createServerClient(url!, anonKey!, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Protect /admin routes (except /admin/login)
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!user) {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/admin/login';
          return NextResponse.redirect(redirectUrl);
        }
      }

      // If already logged in and visiting /admin/login, redirect to /admin
      if (pathname === '/admin/login' && user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/admin';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (e) {
      console.error('Middleware auth check error:', e);
    }
  } else {
    // Fallback mode protection
    const adminSession = request.cookies.get('admin_session');
    const isAuthenticated = adminSession?.value === 'authenticated';

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (!isAuthenticated) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/admin/login';
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (pathname === '/admin/login' && isAuthenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
