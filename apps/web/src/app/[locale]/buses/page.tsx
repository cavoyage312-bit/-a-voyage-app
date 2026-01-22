'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Bus,
    MapPin,
    Calendar,
    Users,
    Search,
    Clock,
    ArrowRight,
    Filter,
    Star,
    Briefcase,
    Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const mockBusRoutes = [
    {
        id: '1',
        company: 'Sonef Transport',
        logo: '🚌',
        from: 'Abidjan',
        to: 'Yamoussoukro',
        departure: '06:00',
        arrival: '10:30',
        duration: '4h 30min',
        price: 5000,
        currency: 'XOF',
        seats: 12,
        rating: 4.5,
    },
    {
        id: '2',
        company: 'UTB',
        logo: '🚌',
        from: 'Abidjan',
        to: 'Yamoussoukro',
        departure: '08:00',
        arrival: '12:00',
        duration: '4h',
        price: 6500,
        currency: 'XOF',
        seats: 8,
        rating: 4.8,
    },
    {
        id: '3',
        company: 'TCV Express',
        logo: '🚌',
        from: 'Abidjan',
        to: 'Yamoussoukro',
        departure: '14:00',
        arrival: '18:30',
        duration: '4h 30min',
        price: 4500,
        currency: 'XOF',
        seats: 20,
        rating: 4.2,
    },
];

const popularRoutes = [
    { from: 'Dakar', to: 'Saint-Louis', country: '🇸🇳', price: '3 500 XOF' },
    { from: 'Abidjan', to: 'Yamoussoukro', country: '🇨🇮', price: '5 000 XOF' },
    { from: 'Casablanca', to: 'Marrakech', country: '🇲🇦', price: '150 MAD' },
    { from: 'Lagos', to: 'Ibadan', country: '🇳🇬', price: '2 500 NGN' },
];

export default function BusesPage() {
    const params = useParams();
    const locale = params.locale as string;
    const router = useRouter();

    const [formData, setFormData] = useState({
        from: '',
        to: '',
        date: '',
        passengers: 1,
        luggage: 1,
    });
    const [busRoutes, setBusRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setShowResults(true);

        try {
            const res = await fetch(`/api/buses/search?from=${formData.from}&to=${formData.to}`);
            const json = await res.json();
            if (json.data) {
                setBusRoutes(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch buses:', error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                const resultsSection = document.getElementById('results-section');
                resultsSection?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&h=600&fit=crop"
                        alt="Bus travel"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-800/70" />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
                            🚌 Réservez votre bus
                        </h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Voyagez confortablement à travers l'Afrique et l'Europe
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-4xl mx-auto"
                    >
                        <form onSubmit={handleSearch} className="search-box">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Départ
                                    </label>
                                    <div className="input-group">
                                        <MapPin className="input-icon w-5 h-5" />
                                        <input
                                            type="text"
                                            className="input input-with-icon"
                                            placeholder="Ville de départ"
                                            value={formData.from}
                                            onChange={(e) =>
                                                setFormData({ ...formData, from: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Arrivée
                                    </label>
                                    <div className="input-group">
                                        <MapPin className="input-icon w-5 h-5" />
                                        <input
                                            type="text"
                                            className="input input-with-icon"
                                            placeholder="Ville d'arrivée"
                                            value={formData.to}
                                            onChange={(e) =>
                                                setFormData({ ...formData, to: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Date
                                    </label>
                                    <div className="input-group">
                                        <Calendar className="input-icon w-5 h-5" />
                                        <input
                                            type="date"
                                            className="input input-with-icon"
                                            value={formData.date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, date: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Passagers
                                    </label>
                                    <div className="input-group">
                                        <Users className="input-icon w-5 h-5" />
                                        <select
                                            className="input input-with-icon"
                                            value={formData.passengers}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    passengers: parseInt(e.target.value),
                                                })
                                            }
                                        >
                                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                                <option key={n} value={n}>
                                                    {n} passager{n > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Bagages
                                    </label>
                                    <div className="input-group">
                                        <Briefcase className="input-icon w-5 h-5" />
                                        <select
                                            className="input input-with-icon"
                                            value={formData.luggage}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    luggage: parseInt(e.target.value),
                                                })
                                            }
                                        >
                                            {[0, 1, 2, 3].map((n) => (
                                                <option key={n} value={n}>
                                                    {n === 0 ? 'Aucun bagage' : `${n} bagage${n > 1 ? 's' : ''}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-full md:w-auto">
                                <Search className="w-5 h-5" />
                                Rechercher
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Results or Popular Routes */}
            <section className="py-12" id="results-section">
                <div className="container-custom">
                    {showResults ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {busRoutes.length} trajets trouvés
                                </h2>
                                <button className="btn btn-outline btn-sm">
                                    <Filter className="w-4 h-4" />
                                    Filtres
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                                    <p className="text-slate-500">Recherche des meilleurs trajets...</p>
                                </div>
                            ) : busRoutes.length === 0 ? (
                                <div className="text-center py-20">
                                    <h3 className="text-xl font-bold text-slate-900">Aucun trajet trouvé</h3>
                                    <p className="text-slate-500">Essayez d'autres villes ou une autre date.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {busRoutes.map((route, index) => (
                                        <motion.div
                                            key={route.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="card card-hover p-6"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                {/* Company */}
                                                <div className="flex items-center gap-3 md:w-40">
                                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                                                        {route.logo}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {route.company}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            <span className="text-xs text-slate-500">
                                                                {route.rating}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Route Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between md:justify-start md:gap-8">
                                                        <div className="text-center">
                                                            <p className="text-xl font-bold text-slate-900">
                                                                {route.departure}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{route.from}</p>
                                                        </div>
                                                        <div className="flex-1 px-4 max-w-xs">
                                                            <div className="text-center text-sm text-slate-500 mb-1">
                                                                {route.duration}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-primary-600 rounded-full" />
                                                                <div className="flex-1 h-0.5 bg-slate-200" />
                                                                <Bus className="w-4 h-4 text-primary-600" />
                                                                <div className="flex-1 h-0.5 bg-slate-200" />
                                                                <div className="w-2 h-2 bg-primary-600 rounded-full" />
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xl font-bold text-slate-900">
                                                                {route.arrival}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{route.to}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price & CTA */}
                                                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-slate-100">
                                                    <div className="text-right">
                                                        <p className="price-badge text-xl">
                                                            {route.price.toLocaleString()} {route.currency}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {route.seats} places dispo
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={`/${locale}/buses/book?id=${route.id}`}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Réserver
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold font-display text-slate-900 mb-6">
                                Trajets populaires
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {popularRoutes.map((route, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="card card-hover p-4 cursor-pointer"
                                        onClick={() => {
                                            setFormData({ ...formData, from: route.from, to: route.to });
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">{route.country}</span>
                                            <Bus className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <p className="font-semibold text-slate-900">
                                            {route.from} → {route.to}
                                        </p>
                                        <p className="text-sm text-primary-700 font-medium mt-1">
                                            À partir de {route.price}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
