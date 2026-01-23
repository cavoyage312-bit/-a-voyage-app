import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        let query = supabase.from('apartments').select('*').eq('is_published', true);

        if (location) {
            query = query.ilike('city', `%${location}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // If no data in DB (likely in dev), return mocks
        const results = (data && data.length > 0) ? data : generateMockApartments(location || 'Paris');

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error('Apartment API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

function generateMockApartments(location: string) {
    const images = [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
    ];

    return Array.from({ length: 8 }).map((_, i) => ({
        id: `mock-apt-${i}`,
        title: [
            'Superbe Loft Lumineux',
            'Appartement Vue Mer',
            'Studio Cosy Centre-Ville',
            'Villa de Luxe avec Piscine'
        ][i % 4] + ` - ${location}`,
        description: 'Un logement exceptionnel pour votre séjour.',
        city: location,
        price_per_night: 50 + (i * 25) + Math.floor(Math.random() * 20),
        currency: 'EUR',
        images: [images[i % 4], images[(i + 1) % 4]],
        rating: 4 + (Math.random()),
        max_guests: 2 + (i % 4),
        amenities: { wifi: true, kitchen: true, ac: true },
        is_published: true
    }));
}
