
import { NextRequest, NextResponse } from 'next/server';
import { searchHotels } from '@/lib/amadeus';

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
        const data = await searchHotels(destination);

        // Enrichir avec des images et prix mockés (car l'API Basic ne les donne pas)
        const enrichedHotels = data.data?.slice(0, 10).map((hotel: any) => ({
            ...hotel,
            price: {
                amount: Math.floor(Math.random() * (300 - 80) + 80),
                currency: 'EUR'
            },
            image: `https://images.unsplash.com/photo-${['1566073771259-6a8506099945', '1582719508461-905c67377150', '1542314831-068cd1dbfeeb', '1571003123894-1f0594d2b5d9'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=400&q=80`,
            rating: Math.floor(Math.random() * (5 - 3) + 3)
        })) || [];

        return NextResponse.json({ data: enrichedHotels });
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
