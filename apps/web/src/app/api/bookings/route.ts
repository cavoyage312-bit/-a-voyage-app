import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Fallback initialization if we can't use SSR auth helpers easily in this context
// Ideally we should use createServerClient from @supabase/ssr to forward cookies
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.email || !body.type || !body.first_name || !body.last_name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Try to insert
        // Note: Without a Service Role Key, this relies on RLS allowing "public" inserts
        // or inserts with specific criteria.
        // If the user uses the application, they might be authenticated in the browser.
        // But this server-side client is ANONYMOUS.

        // Ideally, we would forward the Authorization header:
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        let client = supabase;
        let userId = null;

        if (token) {
            // Authenticated client
            client = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    global: {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                }
            );

            const { data: { user } } = await client.auth.getUser();
            userId = user?.id;
        }

        const payload = {
            ...body,
            // If we have a user_id, add it (assuming the table has this column)
            ...(userId && { user_id: userId }),
            created_at: new Date().toISOString(),
        };

        console.log('Inserting booking:', payload);

        const { data, error } = await client
            .from('bookings')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, booking: data });

    } catch (error: any) {
        console.error('Booking API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
