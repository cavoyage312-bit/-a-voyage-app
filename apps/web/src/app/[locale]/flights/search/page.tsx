'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plane,
    Clock,
    Filter,
    ArrowRight,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { formatPrice, formatDuration, formatTime } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Types Amadeus
interface FlightSegment {
    departure: {
        iataCode: string;
        at: string;
    };
    arrival: {
        iataCode: string;
        at: string;
    };
    carrierCode: string;
    number: string;
    duration: string;
}

interface FlightOffer {
    id: string;
    price: {
        total: string;
        currency: string;
    };
    itineraries: {
        duration: string;
        segments: FlightSegment[];
    }[];
    travelerPricings: any[];
}

function parseDuration(duration: string): number {
    if (!duration) return 0;
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (match) {
        const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
        const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
        return hours * 60 + minutes;
    }
    return 0;
}

export default function FlightSearchPage() {
    const t = useTranslations('flights');
    const searchParams = useSearchParams();
    const params = useParams();
    const locale = params.locale as string;

    const [flights, setFlights] = useState<FlightOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');

    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const departure = searchParams.get('departure') || '';
    const adults = searchParams.get('adults') || '1';

    async function fetchFlights() {
        setLoading(true);
        setError(null);
        try {
            // Extraire le code IATA si le format est "Ville (CODE)" (ex: "Paris (CDG)" -> "CDG")
            const originCode = from.match(/\(([A-Z]{3})\)/)?.[1] || from;
            const destinationCode = to.match(/\(([A-Z]{3})\)/)?.[1] || to;

            // Si format de date incorrect ou manquant, on arrête (Amadeus veut YYYY-MM-DD)
            if (!originCode || !destinationCode || !departure) {
                setLoading(false);
                return;
            }

            const query = new URLSearchParams({
                origin: originCode,
                destination: destinationCode,
                date: departure, // Assurez-vous que c'est bien YYYY-MM-DD
                adults: adults,
            });

            const res = await fetch(`/api/flights/search?${query.toString()}`);

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.error || 'Erreur lors de la recherche');
            }

            const json = await res.json();

            if (json.data) {
                // Amadeus renvoie { data: [...] }
                setFlights(json.data);
            } else {
                setFlights([]);
            }

        } catch (err) {
            console.error(err);
            setError('Impossible de récupérer les vols. Veuillez réessayer.');
            setFlights([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFlights();
    }, [searchParams]);

    const sortedFlights = [...flights].sort((a, b) => {
        if (sortBy === 'price') {
            return parseFloat(a.price.total) - parseFloat(b.price.total);
        } else {
            return (
                parseDuration(a.itineraries[0].duration) -
                parseDuration(b.itineraries[0].duration)
            );
        }
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header de recherche */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-6">
                <div className="container-custom">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                            <Plane className="w-8 h-8" />
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {from} <ArrowRight className="inline w-5 h-5 mx-2" /> {to}
                                </h1>
                                <p className="text-primary-100">{departure} • {adults} passager(s)</p>
                            </div>
                        </div>
                        <Link
                            href={`/${locale}/flights`}
                            className="btn bg-white/20 hover:bg-white/30 text-white"
                        >
                            Modifier
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filtres (Simplifiés pour l'instant) */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                                <Filter className="w-5 h-5" />
                                {t('filters')}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {t('stops')}
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="rounded" defaultChecked />
                                            <span className="text-sm">{t('direct')}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Résultats */}
                    <main className="flex-1">
                        {/* Barre de tri */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-slate-600">
                                <span className="font-semibold text-slate-900">
                                    {flights.length}
                                </span>{' '}
                                {t('results')}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">{t('sortBy')}:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="input py-2 px-3 text-sm"
                                >
                                    <option value="price">{t('cheapest')}</option>
                                    <option value="duration">{t('fastest')}</option>
                                </select>
                            </div>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                                <p className="text-slate-500">Recherche des meilleurs tarifs...</p>
                            </div>
                        )}

                        {/* No results */}
                        {!loading && !error && flights.length === 0 && (
                            <div className="card p-12 text-center">
                                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    {t('noResults')}
                                </h3>
                                <p className="text-slate-500 mb-4">
                                    Aucun vol trouvé pour ces dates. Essayez d'autres dates.
                                </p>
                                <Link href={`/${locale}/flights`} className="btn btn-primary">
                                    Nouvelle recherche
                                </Link>
                            </div>
                        )}

                        {/* Flight cards */}
                        <div className="space-y-4">
                            {sortedFlights.map((flight, index) => (
                                <motion.div
                                    key={flight.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <FlightCard flight={flight} locale={locale} />
                                </motion.div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function FlightCard({
    flight,
    locale,
}: {
    flight: FlightOffer;
    locale: string;
}) {
    const itinerary = flight.itineraries[0];
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const stops = segments.length - 1;

    // Formater la durée pour l'affichage (PT2H30M -> 2h30)
    const formatAmadeusDuration = (duration: string) => {
        return duration.replace('PT', '').toLowerCase();
    };

    return (
        <div className="card card-hover p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Airline */}
                <div className="flex items-center gap-3 md:w-32">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-slate-700">
                            {firstSegment.carrierCode}
                        </span>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-slate-900">
                            {firstSegment.carrierCode}
                        </p>
                        <p className="text-slate-500">{firstSegment.number}</p>
                    </div>
                </div>

                {/* Flight info */}
                <div className="flex-1">
                    <div className="flex items-center justify-between md:justify-start md:gap-8">
                        {/* Departure */}
                        <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900">
                                {formatTime(firstSegment.departure.at)}
                            </p>
                            <p className="text-sm text-slate-500">
                                {firstSegment.departure.iataCode}
                            </p>
                        </div>

                        {/* Duration & stops */}
                        <div className="flex-1 px-4 max-w-xs">
                            <div className="text-center text-sm text-slate-500 mb-1">
                                {formatAmadeusDuration(itinerary.duration)}
                            </div>
                            <div className="relative">
                                <div className="h-0.5 bg-slate-200 w-full"></div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                                {stops > 0 && (
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent-500 rounded-full"></div>
                                )}
                            </div>
                            <div className="text-center text-xs text-slate-400 mt-1">
                                {stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}`}
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900">
                                {formatTime(lastSegment.arrival.at)}
                            </p>
                            <p className="text-sm text-slate-500">
                                {lastSegment.arrival.iataCode}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-slate-100">
                    <div className="text-right">
                        <p className="text-3xl font-bold text-primary-600">
                            {formatPrice(parseFloat(flight.price.total))}
                        </p>
                        <p className="text-xs text-slate-500">par personne</p>
                    </div>
                    {/* On passe flightId mais idéalement il faudrait stocker tout l'objet flight quelque part car on ne peut pas le récupérer juste avec l'ID via API sans session */}
                    <Link
                        href={`/${locale}/flights/book?flightId=${flight.id}`}
                        className="btn btn-primary btn-sm"
                    >
                        Sélectionner
                    </Link>
                </div>
            </div>
        </div>
    );
}
