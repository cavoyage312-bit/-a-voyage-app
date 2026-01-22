'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Coffee, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function HotelSearchPage() {
    const t = useTranslations('hotels');
    const searchParams = useSearchParams();
    const params = useParams();
    const locale = params.locale as string;

    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const destination = searchParams.get('destination') || ''; // Ex: PAR
    const checkin = searchParams.get('checkin');

    useEffect(() => {
        async function fetchHotels() {
            setLoading(true);
            try {
                // Nettoyer le code ville (ex: "Paris (PAR)" -> "PAR")
                const cityCode = destination.match(/\(([A-Z]{3})\)/)?.[1] || destination;

                if (!cityCode) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(`/api/hotels/search?destination=${cityCode}`);
                const json = await res.json();

                if (json.data) {
                    setHotels(json.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchHotels();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-8">
                <div className="container-custom">
                    <h1 className="text-2xl font-bold mb-2">Hôtels à {destination}</h1>
                    <p className="text-slate-400">
                        {checkin ? `Pour le ${checkin}` : 'Dates flexibles'} • {hotels.length} établissements trouvés
                    </p>
                </div>
            </div>

            <div className="container-custom py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                        <p className="text-slate-500">Recherche des meilleurs hôtels...</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-slate-900">Aucun hôtel trouvé</h3>
                        <p className="text-slate-500">Essayez une autre destination (ex: PAR pour Paris, LON pour Londres)</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hotels.map((hotel, index) => (
                            <motion.div
                                key={hotel.hotelId || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card card-hover overflow-hidden flex flex-col"
                            >
                                <div className="relative h-48 bg-slate-200">
                                    <Image
                                        src={hotel.image}
                                        alt={hotel.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        {hotel.rating}
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="mb-2">
                                        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">Hôtel</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{hotel.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">{hotel.address?.cityName || destination}</span>
                                    </div>

                                    <div className="flex gap-3 mb-4">
                                        <span className="flex items-center gap-1 text-xs text-slate-500"><Wifi className="w-3 h-3" /> Wifi Gratuit</span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500"><Coffee className="w-3 h-3" /> Petit déj</span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-slate-900">{hotel.price.amount}€</p>
                                            <p className="text-xs text-slate-400">/ nuit</p>
                                        </div>
                                        <button className="btn btn-primary btn-sm">
                                            Voir
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
