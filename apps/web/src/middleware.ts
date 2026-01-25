import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './routing';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
    // 1. Run i18n middleware first
    const response = intlMiddleware(request);

    // 2. Create Supabase client to sync session
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set({ name, value, ...options });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    request.cookies.set({ name, value: '', ...options });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protection logic
    // We check for /admin, /partner, /book in any locale
    const isAdminRoute = /\/[a-z]{2}\/admin/.test(pathname);
    const isPartnerRoute = /\/[a-z]{2}\/partner/.test(pathname);
    const isBookingRoute = /\/book/.test(pathname);

    if (isAdminRoute || isPartnerRoute || isBookingRoute) {
        if (!user) {
            // Not logged in -> redirect to login
            const locale = pathname.split('/')[1] || 'fr';
            const url = new URL(`/${locale}/auth/login`, request.url);
            url.searchParams.set('next', pathname);
            return NextResponse.redirect(url);
        }

        // Role check for Admin/Partner
        if (isAdminRoute || isPartnerRoute) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (isAdminRoute && profile?.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (isPartnerRoute && profile?.role !== 'partner' && profile?.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
