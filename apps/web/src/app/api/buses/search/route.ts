
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    // Simulate real search delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const companies = [
        { name: 'Sonef Transport', logo: '🚌', rating: 4.5, basePrice: 5000 },
        { name: 'UTB', logo: '🚌', rating: 4.8, basePrice: 6500 },
        { name: 'TCV Express', logo: '🚌', rating: 4.2, basePrice: 4500 },
        { name: 'GTI', logo: '🚌', rating: 4.0, basePrice: 5500 },
        { name: 'Rimbo', logo: '🚌', rating: 4.3, basePrice: 6000 },
    ];

    const results = companies.map((company, i) => {
        const departureTime = `${6 + i}:00`;
        const arrivalTime = `${10 + i}:30`;

        return {
            id: `bus-${i}`,
            company: company.name,
            logo: company.logo,
            from: from || 'Départ',
            to: to || 'Arrivée',
            departure: departureTime,
            arrival: arrivalTime,
            duration: '4h 30min',
            price: company.basePrice + Math.floor(Math.random() * 1000),
            currency: 'XOF',
            seats: 10 + Math.floor(Math.random() * 20),
            rating: company.rating,
        };
    });

    return NextResponse.json({ data: results });
}
