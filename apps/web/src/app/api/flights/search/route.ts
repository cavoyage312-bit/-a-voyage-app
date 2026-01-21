import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, amadeus } from '@/lib/amadeus';
import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase côté serveur pour l'API
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    let origin = searchParams.get('origin');
    let destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const adults = searchParams.get('adults') || '1';

    if (!origin || !destination || !date) {
        return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
        );
    }

    try {
        // --- 1. Récupération des réglages de marge ---
        const { data: settings } = await supabase
            .from('app_settings')
            .select('*')
            .eq('id', 'global')
            .single();

        const marginFixed = settings?.flight_margin_fixed || 15;
        const marginPercent = (settings?.flight_margin_percent || 5) / 100;
        const paymentFeePercent = (settings?.payment_fee_percent || 2.9) / 100;

        // --- 2. Résolution IATA ---
        const resolveCode = async (keyword: string) => {
            if (keyword.length === 3 && /^[A-Z]{3}$/.test(keyword)) return keyword;
            try {
                const response = await amadeus.referenceData.locations.get({
                    keyword: keyword,
                    subType: 'CITY,AIRPORT'
                });
                const found = response.data.find((loc: any) => loc.iataCode);
                return found ? found.iataCode : keyword;
            } catch (e) {
                return keyword;
            }
        };

        const resolvedOrigin = await resolveCode(origin);
        const resolvedDestination = await resolveCode(destination);

        // --- 3. Recherche Amadeus ---
        const data = await searchFlights({
            originLocationCode: resolvedOrigin,
            destinationLocationCode: resolvedDestination,
            departureDate: date,
            adults: adults,
            max: '10'
        });

        // --- 4. Application des Marges ---
        if (data.data) {
            data.data = data.data.map((offer: any) => {
                const basePrice = parseFloat(offer.price.total);

                // Calcul du nouveau prix : (Base + Fixe) * (1 + %Com) * (1 + %Pay)
                const priceWithMargin = (basePrice + marginFixed) * (1 + marginPercent);
                const finalPrice = priceWithMargin * (1 + paymentFeePercent);

                return {
                    ...offer,
                    price: {
                        ...offer.price,
                        total: finalPrice.toFixed(2),
                        original_base: basePrice.toFixed(2), // Pour info interne
                        currency: offer.price.currency
                    }
                };
            });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
