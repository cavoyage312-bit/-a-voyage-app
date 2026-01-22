
import { NextRequest, NextResponse } from 'next/server';
import { searchCars } from '@/lib/amadeus';
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
    const location = searchParams.get('location'); // Code IATA ville (ex: PAR)

    if (!location) {
        return NextResponse.json(
            { error: 'Missing location parameter' },
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

        // Lancer settings en parallèle de la recherche amadeus (ou mock)
        // Note: On récupère settings au cas où on voudrait appliquer des marges ici aussi
        const [settings, amadeusDataResult] = await Promise.allSettled([
            getSettings(),
            searchCars(location)
        ]);

        const amadeusData = amadeusDataResult.status === 'fulfilled' ? amadeusDataResult.value : { data: [] };

        // Si pas de résultats (ou mode test limité), on génère des offres réalistes basées sur la ville
        const results = (amadeusData.data && amadeusData.data.length > 0)
            ? amadeusData.data
            : generateMockCars(location);

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Générateur de voitures réalistes pour la démo
function generateMockCars(location: string) {
    const categories = [
        { name: 'Économique', model: 'Peugeot 208', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', price: 35 },
        { name: 'Compacte', model: 'Volkswagen Golf', image: 'https://images.unsplash.com/photo-1596766736453-2bd19859f5e1?auto=format&fit=crop&w=400&q=80', price: 45 },
        { name: 'SUV', model: 'Nissan Qashqai', image: 'https://images.unsplash.com/photo-1628186177926-d62f689f91a5?auto=format&fit=crop&w=400&q=80', price: 65 },
        { name: 'Berline', model: 'Mercedes Classe C', image: 'https://images.unsplash.com/photo-1629897143494-d4ceb4131238?auto=format&fit=crop&w=400&q=80', price: 95 },
        { name: 'Luxe', model: 'Porsche Panamera', image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=400&q=80', price: 180 },
    ];

    return categories.map((cat, i) => ({
        id: `car-${i}`,
        provider: { code: ['HERTZ', 'AVIS', 'EUROPCAR', 'SIXT'][Math.floor(Math.random() * 4)] },
        category: cat.name,
        vehicle: {
            description: cat.model,
            image: cat.image,
            seats: 5,
            doors: 4,
            transmission: 'Automatique',
            ac: true
        },
        quotation: {
            monetaryAmount: cat.price,
            currencyCode: 'EUR'
        }
    }));
}
