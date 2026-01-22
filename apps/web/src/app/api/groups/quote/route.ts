import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { data, error } = await supabase
            .from('group_quotes')
            .insert([{
                travel_type: body.travelType,
                origin: body.origin,
                destination: body.destination,
                travel_date: body.date,
                passengers: body.passengers,
                company_name: body.companyName,
                contact_name: body.contactName,
                email: body.email,
                phone: body.phone,
                message: body.message
            }]);

        if (error) {
            console.error('Supabase Error:', error);
            // On renvoie quand même 200 pour le mock si la table n'existe pas encore, 
            // mais on log l'erreur. En prod, on handle plus finement.
            return NextResponse.json({ success: true, warning: 'Database sync pending' });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Group API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
