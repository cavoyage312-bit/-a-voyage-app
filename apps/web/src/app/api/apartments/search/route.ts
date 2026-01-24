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
        let query = supabase
            .from('apartments')
            .select(`
                *,
                partners:partner_id (
                    company_name
                )
            `)
            .eq('is_published', true);

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
    const apartmentTypes = [
        { title: 'Penthouse Panoramique', type: 'Luxe', basePrice: 200, partners: { company_name: 'Dakar Elite Stays' } },
        { title: 'Villa Oasis avec Jardin', type: 'Villa', basePrice: 150, partners: { company_name: 'Sahel Retreats' } },
        { title: 'Loft Industriel Moderne', type: 'Loft', basePrice: 110, partners: { company_name: 'City Living' } },
        { title: 'Appartement de Charme', type: 'Traditionnel', basePrice: 85, partners: { company_name: 'Authentic Stays' } },
        { title: 'Studio Cosy Vue Mer', type: 'Studio', basePrice: 65, partners: { company_name: 'Ocean breeze' } },
        { title: 'Duplex Familial Spacieux', type: 'Duplex', basePrice: 130, partners: { company_name: 'Family First' } },
    ];

    const images = [
        '1522708323590-d24dbb6b0267', // Interior living room
        '1502672260266-1c1ef2d93688', // Kitchen modern
        '1560448204-e02f11c3d0e2', // Bedroom chic
        '1493663284031-b7e3aefcae8e', // Dining area
        '1512917774080-9991f1c4c750', // Modern exterior
        '1515263487990-61b63bd46792', // Apartment complex
        '1613490493576-7fde63acd811'  // Luxury room
    ];

    return apartmentTypes.map((apt, i) => ({
        id: `mock-apt-${i}`,
        title: `${apt.title} - ${location}`,
        description: `Ce magnifique ${apt.type.toLowerCase()} offre tout le confort nécessaire pour un séjour inoubliable à ${location}. Profitez d'un design soigné et d'un emplacement privilégié.`,
        city: location,
        price_per_night: apt.basePrice + Math.floor(Math.random() * 30),
        currency: 'EUR',
        images: [
            `https://images.unsplash.com/photo-${images[i % images.length]}?auto=format&fit=crop&w=800&q=80`,
            `https://images.unsplash.com/photo-${images[(i + 1) % images.length]}?auto=format&fit=crop&w=800&q=80`
        ],
        rating: 4.2 + (Math.random() * 0.8),
        max_guests: 2 + (i % 5),
        amenities: {
            wifi: true,
            kitchen: i % 2 === 0,
            ac: true,
            parking: i % 3 === 0,
            pool: i === 0
        },
        is_published: true,
        partners: apt.partners
    }));
}
