'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
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

function FlightSearchContent() {
    const t = useTranslations('flights');
    const searchParams = useSearchParams();
    const params = useParams();
    const locale = params.locale as string;

    const [flights, setFlights] = useState<any[]>([]);
    const [dictionaries, setDictionaries] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');

    // États pour le filtrage
    const [filters, setFilters] = useState({
        directOnly: false,
        maxPrice: 2000,
        selectedAirlines: [] as string[],
    });

    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const departure = searchParams.get('departure') || '';
    const adults = searchParams.get('adults') || '1';

    async function fetchFlights() {
        setLoading(true);
        setError(null);
        try {
            const originCode = from.match(/\(([A-Z]{3})\)/)?.[1] || from;
            const destinationCode = to.match(/\(([A-Z]{3})\)/)?.[1] || to;

            if (!originCode || !destinationCode || !departure) {
                setLoading(false);
                return;
            }

            const query = new URLSearchParams({
                origin: originCode,
                destination: destinationCode,
                date: departure,
                adults: adults,
            });

            const res = await fetch(`/api/flights/search?${query.toString()}`);

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.error || 'Erreur lors de la recherche');
            }

            const json = await res.json();

            if (json.data) {
                setFlights(json.data);
                setDictionaries(json.dictionaries || {});

                // Init max price based on results
                const prices = json.data.map((f: any) => parseFloat(f.price.total));
                if (prices.length > 0) {
                    setFilters(prev => ({ ...prev, maxPrice: Math.max(...prices) + 50 }));
                }
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

    // Logique de filtrage
    const filteredFlights = flights.filter(flight => {
        const price = parseFloat(flight.price.total);
        const stops = flight.itineraries[0].segments.length - 1;
        const carrier = flight.itineraries[0].segments[0].carrierCode;

        if (filters.directOnly && stops > 0) return false;
        if (price > filters.maxPrice) return false;
        if (filters.selectedAirlines.length > 0 && !filters.selectedAirlines.includes(carrier)) return false;

        return true;
    });

    const sortedFlights = [...filteredFlights].sort((a, b) => {
        if (sortBy === 'price') {
            return parseFloat(a.price.total) - parseFloat(b.price.total);
        } else {
            // Duration sort (Amadeus format PT2H30M)
            const getDuration = (it: any) => {
                const dur = it.duration.replace('PT', '');
                const h = parseInt(dur.match(/(\d+)H/)?.[1] || '0');
                const m = parseInt(dur.match(/(\d+)M/)?.[1] || '0');
                return h * 60 + m;
            };
            return getDuration(a.itineraries[0]) - getDuration(b.itineraries[0]);
        }
    });

    // Liste des compagnies présentes dans les résultats pour le filtre
    const airlinesInResults = Array.from(new Set(flights.map(f => f.itineraries[0].segments[0].carrierCode)));

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
                    {/* Filtres */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-6 border-b pb-4">
                                <Filter className="w-5 h-5 text-primary-600" />
                                {t('filters')}
                            </h3>
                            <div className="space-y-8">
                                {/* Escales */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-3">
                                        Escales
                                    </label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                                checked={filters.directOnly}
                                                onChange={(e) => setFilters({ ...filters, directOnly: e.target.checked })}
                                            />
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Vols Directs uniquement</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Prix Max */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-sm font-bold text-slate-900">
                                            Prix maximum
                                        </label>
                                        <span className="text-primary-600 font-bold text-sm bg-primary-50 px-2 py-0.5 rounded">
                                            {formatPrice(filters.maxPrice)}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="50"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    />
                                </div>

                                {/* Compagnies */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-3">
                                        Compagnies aériennes
                                    </label>
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {airlinesInResults.map(code => (
                                            <label key={code} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                                    checked={filters.selectedAirlines.includes(code)}
                                                    onChange={(e) => {
                                                        const newAirlines = e.target.checked
                                                            ? [...filters.selectedAirlines, code]
                                                            : filters.selectedAirlines.filter(a => a !== code);
                                                        setFilters({ ...filters, selectedAirlines: newAirlines });
                                                    }}
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors break-words">
                                                    {dictionaries.carriers?.[code] || code}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Résultats */}
                    <main className="flex-1">
                        {/* Barre de tri */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <p className="text-slate-600">
                                <span className="font-semibold text-slate-900">
                                    {sortedFlights.length}
                                </span>{' '}
                                {t('results')} {flights.length !== sortedFlights.length && `sur ${flights.length}`}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 whitespace-nowrap">{t('sortBy')}:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="input py-2 px-3 text-sm bg-white border-slate-200"
                                >
                                    <option value="price">{t('cheapest')}</option>
                                    <option value="duration">{t('fastest')}</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="card border-red-100 bg-red-50 p-6 flex items-start gap-4 mb-8">
                                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-red-900 mb-1">Désolé, une erreur est survenue</h3>
                                    <p className="text-red-700 text-sm">{error}</p>
                                    <button onClick={fetchFlights} className="mt-3 text-sm font-bold text-red-600 hover:underline">
                                        Réessayer la recherche
                                    </button>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-6" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Recherche en cours...</h3>
                                <p className="text-slate-500">Nous comparons les meilleures offres pour vous.</p>
                            </div>
                        )}

                        {!loading && !error && sortedFlights.length === 0 && (
                            <div className="card p-12 text-center bg-white shadow-xl shadow-slate-200/50">
                                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                    Aucun vol correspondant
                                </h3>
                                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                    Essayez de modifier vos filtres ou de faire une nouvelle recherche avec des dates différentes.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => setFilters({ directOnly: false, maxPrice: 5000, selectedAirlines: [] })}
                                        className="btn btn-outline"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                    <Link href={`/${locale}/flights`} className="btn btn-primary">
                                        Nouvelle recherche
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {sortedFlights.map((flight, index) => (
                                <motion.div
                                    key={flight.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <FlightCard
                                        flight={flight}
                                        locale={locale}
                                        airlineName={dictionaries.carriers?.[flight.itineraries[0].segments[0].carrierCode]}
                                    />
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
    airlineName,
}: {
    flight: any;
    locale: string;
    airlineName?: string;
}) {
    const itinerary = flight.itineraries[0];
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const stops = segments.length - 1;

    const formatAmadeusDuration = (duration: string) => {
        return duration.replace('PT', '').toLowerCase();
    };

    return (
        <div className="card card-hover p-6 border-transparent hover:border-primary-200 transition-all bg-white relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                <div className="flex items-center gap-4 md:w-56">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2">
                        <img
                            src={`https://pics.avs.io/120/120/${firstSegment.carrierCode}.png`}
                            alt={airlineName || firstSegment.carrierCode}
                            className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="text-sm">
                        <p className="font-black text-slate-900 leading-tight text-lg tracking-tight">
                            {airlineName || firstSegment.carrierCode}
                        </p>
                        <p className="text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                            Vol {firstSegment.carrierCode} {firstSegment.number}
                        </p>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between md:justify-center md:gap-16">
                        <div className="text-center md:text-left">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">
                                {formatTime(firstSegment.departure.at)}
                            </p>
                            <div className="flex items-center gap-1 justify-center md:justify-start">
                                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
                                    {firstSegment.departure.iataCode}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 px-4 max-w-[200px]">
                            <div className="text-center text-xs font-black text-primary-600 uppercase tracking-widest mb-2 opacity-80">
                                {formatAmadeusDuration(itinerary.duration)}
                            </div>
                            <div className="relative flex items-center">
                                <div className="h-0.5 bg-slate-200 w-full rounded-full"></div>
                                <div className="absolute left-0 w-3 h-3 border-2 border-primary-500 bg-white rounded-full"></div>
                                <div className="absolute right-0 w-3 h-3 border-2 border-primary-500 bg-white rounded-full"></div>
                                {stops > 0 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-accent-500 rounded-full flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            <div className="text-center text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                                {stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}`}
                            </div>
                        </div>

                        <div className="text-center md:text-right">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">
                                {formatTime(lastSegment.arrival.at)}
                            </p>
                            <div className="flex items-center gap-1 justify-center md:justify-end">
                                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
                                    {lastSegment.arrival.iataCode}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pt-6 md:pt-0 border-t md:border-t-0 md:border-l md:pl-8 border-slate-100 min-w-[160px]">
                    <div className="text-right">
                        <p className="text-4xl font-black text-primary-600 tracking-tighter">
                            {formatPrice(parseFloat(flight.price.total))}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total TTC</p>
                    </div>
                    <Link
                        href={`/${locale}/flights/book?flightId=${flight.id}`}
                        className="btn btn-primary btn-md px-8 shadow-lg shadow-primary-500/20 active:scale-95 transition-all font-black text-xs uppercase tracking-widest"
                    >
                        Réserver
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function FlightSearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-slate-500">Chargement des vols...</p>
            </div>
        }>
            <FlightSearchContent />
        </Suspense>
    );
}
