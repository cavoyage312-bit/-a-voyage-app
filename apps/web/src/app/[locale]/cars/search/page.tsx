'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Car, Fuel, Users, Gauge, Briefcase, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

function CarSearchContent() {
    const t = useTranslations('cars');
    const searchParams = useSearchParams();
    const params = useParams();
    const locale = params.locale as string;

    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const location = searchParams.get('location') || ''; // Ex: PAR
    const pickupDate = searchParams.get('pickupDate');

    useEffect(() => {
        async function fetchCars() {
            setLoading(true);
            try {
                const cityCode = location.match(/\(([A-Z]{3})\)/)?.[1] || location;

                if (!cityCode) {
                    // Fallback si pas de code, on cherche qd meme
                    const res = await fetch(`/api/cars/search?location=PAR`); // Default Paris for demo if empty
                    const json = await res.json();
                    if (json.data) setCars(json.data);
                    setLoading(false);
                    return;
                }

                const res = await fetch(`/api/cars/search?location=${cityCode}`);
                const json = await res.json();

                if (json.data) {
                    setCars(json.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchCars();
    }, [searchParams, location]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-8">
                <div className="container-custom">
                    <h1 className="text-2xl font-bold mb-2">Location de voiture à {location}</h1>
                    <p className="text-slate-400">
                        {pickupDate ? `À partir du ${pickupDate}` : 'Dates flexibles'} • {cars.length} véhicules trouvés
                    </p>
                </div>
            </div>

            <div className="container-custom py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                        <p className="text-slate-500">Recherche des meilleurs tarifs...</p>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-slate-900">Aucun véhicule disponible</h3>
                        <p className="text-slate-500">Veuillez modifier votre recherche</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {cars.map((car, index) => (
                            <motion.div
                                key={car.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card p-6 flex flex-col md:flex-row gap-6 md:items-center"
                            >
                                {/* Image */}
                                <div className="w-full md:w-64 h-40 relative rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    <Image
                                        src={car.vehicle.image}
                                        alt={car.vehicle.description}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm text-slate-900">
                                        {car.category}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{car.vehicle.description}</h3>
                                            <p className="text-sm text-slate-500">ou similaire</p>
                                        </div>
                                        <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">
                                            {car.provider.code}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>{car.vehicle.seats} places</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Briefcase className="w-4 h-4 text-slate-400" />
                                            <span>2 valises</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Gauge className="w-4 h-4 text-slate-400" />
                                            <span>{car.vehicle.transmission}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Fuel className="w-4 h-4 text-slate-400" />
                                            <span>Climatisé</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded"><Check className="w-3 h-3" /> Kilométrage illimité</span>
                                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded"><Check className="w-3 h-3" /> Annulation gratuite</span>
                                    </div>
                                </div>

                                {/* Price & CTA */}
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 md:min-w-[150px]">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary-600">
                                            {Math.floor(car.quotation.monetaryAmount)}€
                                        </p>
                                        <p className="text-sm text-slate-500">Total pour 1 jour</p>
                                    </div>
                                    <button className="btn btn-primary w-full md:w-auto mt-0 md:mt-4">
                                        Choisir
                                    </button>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CarSearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-slate-500">Chargement de la recherche...</p>
            </div>
        }>
            <CarSearchContent />
        </Suspense>
    );
}
