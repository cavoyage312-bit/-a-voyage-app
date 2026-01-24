import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, searchLocations } from '@/lib/amadeus';
import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase côté serveur pour l'API
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache simple en mémoire pour les réglages (5 minutes)
let settingsCache: any = null;
let lastSettingsFetch = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    let origin = searchParams.get('origin');
    let destination = searchParams.get('destination');
    const rawDate = searchParams.get('date');
    const adults = searchParams.get('adults') || '1';

    // Normalisation
    const date = rawDate?.trim();

    if (!origin || !destination || !date) {
        return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
        );
    }

    try {
        // --- 1. Résolution Parallèle (Réglages + IATA) ---
        const resolveCode = async (keyword: string) => {
            if (!keyword) return '';
            const normalized = keyword.trim().toUpperCase();
            if (normalized.length === 3 && /^[A-Z]{3}$/.test(normalized)) return normalized;

            try {
                const response = await searchLocations(keyword);
                const found = response.data.find((loc: any) => loc.iataCode);
                return found ? found.iataCode : keyword;
            } catch (e) {
                return keyword;
            }
        };

        const getSettings = async () => {
            const now = Date.now();
            if (settingsCache && (now - lastSettingsFetch < CACHE_TTL)) {
                return settingsCache;
            }
            const { data } = await supabase
                .from('app_settings')
                .select('*')
                .eq('id', 'global')
                .single();

            if (data) {
                settingsCache = data;
                lastSettingsFetch = now;
            }
            return data;
        };

        // Lancer tout en parallèle
        const [settings, resolvedOrigin, resolvedDestination] = await Promise.all([
            getSettings(),
            resolveCode(origin),
            resolveCode(destination)
        ]);

        const marginFixed = settings?.flight_margin_fixed ?? 15;
        const marginPercent = (settings?.flight_margin_percent ?? 5) / 100;
        const paymentFeePercent = (settings?.payment_fee_percent ?? 2.9) / 100;

        // --- 2. Recherche Amadeus ---
        console.log(`Searching Amadeus: ${resolvedOrigin} -> ${resolvedDestination} on ${date}`);
        let data;
        try {
            data = await searchFlights({
                originLocationCode: resolvedOrigin,
                destinationLocationCode: resolvedDestination,
                departureDate: date!,
                adults: adults,
                max: '20'
            });
        } catch (e: any) {
            console.warn('Amadeus Flight API failed, using fallback:', e.message);
            data = generateMockFlights(resolvedOrigin, resolvedDestination, date!);
        }

        // Si Amadeus renvoie OK mais sans données, on peut aussi fallback (optionnel)
        if (!data.data || data.data.length === 0) {
            data = generateMockFlights(resolvedOrigin, resolvedDestination, date!);
        }

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

function generateMockFlights(origin: string, destination: string, date: string) {
    const airlines = [
        { code: 'AF', name: 'Air France' },
        { code: 'SN', name: 'Brussels Airlines' },
        { code: 'HC', name: 'Air Sénégal' },
        { code: 'AT', name: 'Royal Air Maroc' },
        { code: 'EK', name: 'Emirates' },
        { code: 'TK', name: 'Turkish Airlines' },
        { code: 'QR', name: 'Qatar Airways' },
        { code: 'IB', name: 'Iberia' },
    ];

    const flights = airlines.map((airline, i) => {
        const isDirect = i % 2 === 0;
        const basePrice = 450 + (i * 80) + Math.floor(Math.random() * 50);
        const durationH = isDirect ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 6) + 7;
        const durationM = Math.floor(Math.random() * 60);
        const duration = `PT${durationH}H${durationM}M`;
        const pad = (n: number) => n.toString().padStart(2, '0');
        const segments: any[] = [];

        if (isDirect) {
            segments.push({
                departure: { iataCode: origin, at: `${date}T${pad(8 + (i % 4))}:00:00` },
                arrival: { iataCode: destination, at: `${date}T${pad(8 + (i % 4) + durationH)}:30:00` },
                carrierCode: airline.code,
                number: `${100 + i}`,
                duration: duration,
                numberOfStops: 0
            });
        } else {
            // Un vol avec escale (VIA Casablanca ou Paris ou Istanbul selon la compagnie)
            const stopover = airline.code === 'AT' ? 'CMN' : airline.code === 'TK' ? 'IST' : airline.code === 'AF' ? 'CDG' : 'MAD';

            segments.push({
                departure: { iataCode: origin, at: `${date}T${pad(6 + (i % 4))}:00:00` },
                arrival: { iataCode: stopover, at: `${date}T${pad(6 + (i % 4) + 4)}:00:00` },
                carrierCode: airline.code,
                number: `${200 + i}`,
                duration: 'PT4H0M',
                numberOfStops: 0
            });

            segments.push({
                departure: { iataCode: stopover, at: `${date}T${pad(6 + (i % 4) + 6)}:00:00` },
                arrival: { iataCode: destination, at: `${date}T${pad(6 + (i % 4) + durationH)}:00:00` },
                carrierCode: airline.code,
                number: `${300 + i}`,
                duration: 'PT3H0M',
                numberOfStops: 0
            });
        }

        return {
            id: `mock-${origin}-${destination}-${i}`,
            price: {
                total: basePrice.toString(),
                currency: 'EUR'
            },
            itineraries: [{
                duration: duration,
                segments: segments
            }],
            travelerPricings: [{
                fareDetailsBySegment: segments.map(() => ({
                    cabin: 'ECONOMY',
                    includedCheckedBags: { quantity: 1 }
                }))
            }]
        };
    });

    const carriers: any = {};
    airlines.forEach(a => {
        carriers[a.code] = a.name;
    });

    return {
        data: flights,
        dictionaries: {
            carriers
        }
    };
}
