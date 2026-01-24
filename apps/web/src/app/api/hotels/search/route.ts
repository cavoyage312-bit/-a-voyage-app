
import { NextRequest, NextResponse } from 'next/server';
import { searchHotels } from '@/lib/amadeus';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

let settingsCache: any = null;
let lastSettingsFetch = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const destination = searchParams.get('destination'); // Code IATA ville (ex: PAR)

    if (!destination) {
        return NextResponse.json(
            { error: 'Missing destination parameter' },
            { status: 400 }
        );
    }

    try {
        const getSettings = async () => {
            const now = Date.now();
            if (settingsCache && (now - lastSettingsFetch < CACHE_TTL)) return settingsCache;
            const { data } = await supabase.from('app_settings').select('*').eq('id', 'global').single();
            if (data) { settingsCache = data; lastSettingsFetch = now; }
            return data;
        };

        // Lancer en parallèle
        const [settings, amadeusData] = await Promise.allSettled([
            getSettings(),
            searchHotels(destination)
        ]);

        const hotelData = amadeusData.status === 'fulfilled' ? amadeusData.value : { data: [] };

        // Si pas de résultats Amadeus, on génère des mocks réalistes
        const finalHotels = (hotelData.data && hotelData.data.length > 0)
            ? hotelData.data.slice(0, 10).map((hotel: any) => ({
                ...hotel,
                price: {
                    amount: Math.floor(Math.random() * (300 - 80) + 80),
                    currency: 'EUR'
                },
                image: `https://images.unsplash.com/photo-${['1566073771259-6a8506099945', '1582719508461-905c67377150', '1542314831-068cd1dbfeeb', '1571003123894-1f0594d2b5d9'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=400&q=80`,
                rating: Math.floor(Math.random() * (5 - 3) + 3)
            }))
            : generateMockHotels(destination);

        return NextResponse.json({ data: finalHotels });
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

function generateMockHotels(destination: string) {
    const hotelTypes = [
        { name: 'Palace', suffix: 'Luxury & Spa', basePrice: 250, stars: 5 },
        { name: 'Grand Hotel', suffix: 'Plaza', basePrice: 150, stars: 4 },
        { name: 'Boutique Hotel', suffix: 'Charm', basePrice: 120, stars: 4 },
        { name: 'Eco-Lodge', suffix: 'Nature', basePrice: 90, stars: 3 },
        { name: 'Business Suite', suffix: 'Executive', basePrice: 180, stars: 5 },
        { name: 'Résidence', suffix: 'Hôtelière', basePrice: 80, stars: 3 },
        { name: 'Apparthôtel', suffix: 'Confort', basePrice: 100, stars: 3 },
    ];

    const images = [
        '1566073771259-6a8506099945', // Pool luxury
        '1582719508461-905c67377150', // Room cozy
        '1542314831-068cd1dbfeeb', // Exterior architecture
        '1571003123894-1f0594d2b5d9', // Interior chic
        '1520250497591-112f2f40a3f4', // Resort beach
        '1445019980597-93fa2acb246c', // Suite view
        '1551882547-ff43c63efa7c'  // Modern lobby
    ];

    return hotelTypes.map((type, i) => ({
        hotelId: `mock-${destination}-${i}`,
        name: `${type.name} ${destination} ${type.suffix}`,
        rating: type.stars,
        price: {
            amount: type.basePrice + Math.floor(Math.random() * 50),
            currency: 'EUR'
        },
        image: `https://images.unsplash.com/photo-${images[i % images.length]}?auto=format&fit=crop&w=800&q=80`,
        address: { cityName: destination },
        amenities: ['WIFI', 'AIR_CONDITIONING', 'RESTAURANT', 'PARKING'].slice(0, 2 + (i % 3))
    }));
}
