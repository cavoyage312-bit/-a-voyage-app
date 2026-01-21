
import { NextRequest, NextResponse } from 'next/server';
import { searchJourneys } from '@/lib/navitia';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
        return NextResponse.json(
            { error: 'Missing from/to parameters' },
            { status: 400 }
        );
    }

    try {
        const journeys = await searchJourneys(from, to);
        return NextResponse.json({ journeys });
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
