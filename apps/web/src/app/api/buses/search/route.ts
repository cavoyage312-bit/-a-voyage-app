
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    // Simulate real search delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const companies = [
        { name: 'Sonef Transport', logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80', rating: 4.5, basePrice: 5000 },
        { name: 'UTB (Union des Transports)', logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=100&q=80', rating: 4.8, basePrice: 6500 },
        { name: 'TCV Express Afrique', logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80', rating: 4.2, basePrice: 4500 },
        { name: 'GTI Transport', logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=100&q=80', rating: 4.0, basePrice: 5500 },
        { name: 'Rimbo VIP', logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80', rating: 4.3, basePrice: 6000 },
        { name: 'Allo Bus', logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=100&q=80', rating: 4.1, basePrice: 4000 },
    ];

    const results = companies.map((company, i) => {
        const departureH = 6 + Math.floor(i * 2.5);
        const departureTime = `${departureH.toString().padStart(2, '0')}:00`;
        const arrivalTime = `${(departureH + 6).toString().padStart(2, '0')}:30`;

        return {
            id: `bus-${i}`,
            company: company.name,
            logo: company.logo,
            from: from || 'Gare Routière',
            to: to || 'Destination',
            departure: departureTime,
            arrival: arrivalTime,
            duration: '6h 30min',
            price: company.basePrice + Math.floor(Math.random() * 500),
            currency: 'XOF',
            seats: 5 + Math.floor(Math.random() * 30),
            rating: company.rating,
            amenities: ['CLIM', 'WIFI', 'USB', 'SNACK'].slice(0, 2 + (i % 3))
        };
    });

    return NextResponse.json({ data: results });
}
