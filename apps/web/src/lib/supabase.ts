import { createBrowserClient, createServerClient } from '@supabase/ssr';

export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

/**
 * Creates a server-side Supabase client.
 * This must be called from Server Components or Server Actions.
 * We pass the cookies store as an argument to avoid importing next/headers directly here,
 * which helps avoid build errors in client-side bundles.
 */
export const createSupabaseServerClient = (cookieStore: any) => {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // The `remove` method was called from a Server Component.
                    }
                },
            },
        }
    );
};
