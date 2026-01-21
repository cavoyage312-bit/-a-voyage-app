'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Search, ArrowRight, Clock, Train, Bus, Activity } from 'lucide-react';
import { formatTime, formatDuration } from '@/lib/utils';
import { TransitJourney } from '@/lib/navitia';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function TransitPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [journeys, setJourneys] = useState<TransitJourney[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!from || !to) return;

        setLoading(true);
        setSearched(true);

        try {
            const res = await fetch(`/api/transit/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
            const data = await res.json();
            setJourneys(data.journeys || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper pour afficher les icônes de transport
    const getModeIcon = (mode: string) => {
        if (mode === 'RER' || mode === 'Train') return <Train className="w-4 h-4" />;
        if (mode === 'Bus') return <Bus className="w-4 h-4" />;
        if (mode === 'Metro') return <div className="w-4 h-4 font-bold text-[10px] flex items-center justify-center border rounded-full border-current">M</div>;
        return <Activity className="w-4 h-4" />; // Walking
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-slate-900 text-white py-12">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Train className="text-green-400" />
                        Itinéraires & Transports
                    </h1>

                    <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 text-slate-900">
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Départ (ex: Châtelet)"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 font-medium"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <ArrowRight className="text-slate-400 w-5 h-5 rotate-90 md:rotate-0" />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Arrivée (ex: La Défense)"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary-500 font-medium"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary px-8 flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            <span className="hidden md:inline">Rechercher</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className="container-custom max-w-4xl py-8">
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-500">Calcul de l'itinéraire...</p>
                    </div>
                )}

                {!loading && searched && journeys.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        Aucun itinéraire trouvé.
                    </div>
                )}

                <div className="space-y-6">
                    {journeys.map((journey, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="card p-6"
                        >
                            {/* Header Itinéraire */}
                            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-900">
                                            {journey.departure_date_time.slice(9, 11)}:{journey.departure_date_time.slice(11, 13)}
                                        </p>
                                        <p className="text-xs text-slate-500">Départ</p>
                                    </div>
                                    <ArrowRight className="text-slate-300 w-5 h-5" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-900">
                                            {journey.arrival_date_time.slice(9, 11)}:{journey.arrival_date_time.slice(11, 13)}
                                        </p>
                                        <p className="text-xs text-slate-500">Arrivée</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <div className="text-xl font-bold text-primary-600">
                                        {Math.floor(journey.duration / 60)} min
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">{i === 0 ? '2.10 €' : '1.90 €'}</span>
                                        <Link
                                            href={`/fr/transit/ticket?price=${i === 0 ? '2.10' : '1.90'}&duration=${Math.floor(journey.duration / 60)}`}
                                            className="btn btn-sm btn-primary py-1 px-3 text-xs"
                                        >
                                            Acheter
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Détail des sections (Timeline) */}
                            <div className="relative pl-4 space-y-6">
                                {/* Ligne verticale */}
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

                                {journey.sections.map((section, j) => {
                                    if (section.type === 'waiting' || section.type === 'transfer') return null;

                                    const isWalking = section.mode === 'walking';
                                    const info = section.display_informations;
                                    const color = info?.color ? `#${info.color}` : '#94a3b8'; // Slate-400 default

                                    return (
                                        <div key={j} className="relative z-10 flex gap-4">
                                            {/* Icone / Puce */}
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-white flex-shrink-0"
                                                style={{ backgroundColor: isWalking ? '#f1f5f9' : color, color: isWalking ? '#64748b' : 'white' }}
                                            >
                                                {info ? (
                                                    <span className="font-bold text-xs">{info.code}</span>
                                                ) : (
                                                    <Activity className="w-5 h-5" />
                                                )}
                                            </div>

                                            {/* Contenu */}
                                            <div className="flex-1 py-1">
                                                <div className="flex justify-between">
                                                    <p className="font-bold text-slate-800">
                                                        {isWalking ? 'Marche à pied' : `${info?.physical_mode} ${info?.code} - Direction ${info?.name}`}
                                                    </p>
                                                    <span className="text-sm font-medium text-slate-500">
                                                        {Math.floor(section.duration / 60)} min
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    De {section.from?.name} à {section.to?.name}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
