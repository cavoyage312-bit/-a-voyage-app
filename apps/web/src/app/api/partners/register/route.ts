import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.email || !body.businessName || !body.contactName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Try to get auth token if user is signed in
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        let client = supabase;
        let userId = null;

        if (token) {
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
            company_name: body.businessName,
            contact_name: body.contactName,
            email: body.email,
            phone: body.phone,
            service_type: body.partnerType || 'other',
            user_id: userId,
            status: 'pending',
            details: {
                address: body.address,
                city: body.city,
                country: body.country,
                website: body.website,
                description: body.description
            }
        };

        const { data, error } = await client
            .from('partners')
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

        return NextResponse.json({ success: true, partner: data });

    } catch (error: any) {
        console.error('Partner Registration API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
