'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Car,
    MapPin,
    Calendar,
    Users,
    Search,
    Fuel,
    Settings,
    Snowflake,
    Star,
    Check,
    Briefcase,
    Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const carCategories = [
    { id: 'economy', name: 'Économique', icon: '🚗' },
    { id: 'compact', name: 'Compacte', icon: '🚙' },
    { id: 'suv', name: 'SUV', icon: '🚐' },
    { id: 'luxury', name: 'Luxe', icon: '🏎️' },
];

const mockCars = [
    {
        id: '1',
        name: 'Toyota Corolla',
        category: 'Économique',
        image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=400&h=250&fit=crop',
        price: 35,
        currency: 'EUR',
        features: ['Climatisation', 'Automatique', '5 places'],
        rating: 4.6,
        reviews: 234,
    },
    {
        id: '2',
        name: 'Peugeot 3008',
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop',
        price: 55,
        currency: 'EUR',
        features: ['Climatisation', 'Automatique', '5 places', 'GPS'],
        rating: 4.8,
        reviews: 189,
    },
    {
        id: '3',
        name: 'Mercedes Classe C',
        category: 'Luxe',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop',
        price: 95,
        currency: 'EUR',
        features: ['Climatisation', 'Automatique', '5 places', 'GPS', 'Cuir'],
        rating: 4.9,
        reviews: 156,
    },
    {
        id: '4',
        name: 'Renault Clio',
        category: 'Compacte',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=250&fit=crop',
        price: 28,
        currency: 'EUR',
        features: ['Climatisation', 'Manuelle', '5 places'],
        rating: 4.4,
        reviews: 312,
    },
];

export default function CarsPage() {
    const params = useParams();
    const locale = params.locale as string;

    const [formData, setFormData] = useState({
        location: '',
        pickupDate: '',
        pickupTime: '10:00',
        returnDate: '',
        returnTime: '10:00',
        luggage: 2,
    });
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setShowResults(true);

        try {
            // Extraire le code IATA si présent (ex: "Paris (PAR)" -> "PAR")
            const cityCode = formData.location.match(/\(([A-Z]{3})\)/)?.[1] || formData.location;

            const res = await fetch(`/api/cars/search?location=${cityCode}`);
            const json = await res.json();
            if (json.data) {
                setCars(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch cars:', error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                const resultsSection = document.getElementById('cars-results');
                resultsSection?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const filteredCars = selectedCategory
        ? cars.filter(
            (car) => car.category.toLowerCase() === selectedCategory.toLowerCase()
        )
        : cars;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=600&fit=crop"
                        alt="Car rental"
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
                            🚗 Location de voiture
                        </h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Louez la voiture idéale pour vos déplacements
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Lieu de prise en charge
                                    </label>
                                    <div className="input-group">
                                        <MapPin className="input-icon w-5 h-5" />
                                        <input
                                            type="text"
                                            className="input input-with-icon"
                                            placeholder="Aéroport, ville ou adresse"
                                            value={formData.location}
                                            onChange={(e) =>
                                                setFormData({ ...formData, location: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Date de prise en charge
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="input-group">
                                            <Calendar className="input-icon w-5 h-5" />
                                            <input
                                                type="date"
                                                className="input input-with-icon"
                                                value={formData.pickupDate}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, pickupDate: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <input
                                            type="time"
                                            className="input"
                                            value={formData.pickupTime}
                                            onChange={(e) =>
                                                setFormData({ ...formData, pickupTime: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Date de retour
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="input-group">
                                            <Calendar className="input-icon w-5 h-5" />
                                            <input
                                                type="date"
                                                className="input input-with-icon"
                                                value={formData.returnDate}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, returnDate: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <input
                                            type="time"
                                            className="input"
                                            value={formData.returnTime}
                                            onChange={(e) =>
                                                setFormData({ ...formData, returnTime: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Capacité de bagages nécessaire
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
                                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                                <option key={n} value={n}>
                                                    {n} bagage{n > 1 ? 's' : ''} (Grand format)
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

            {/* Results or Categories */}
            <section className="py-12" id="cars-results">
                <div className="container-custom">
                    {showResults ? (
                        <>
                            {/* Categories Filter */}
                            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                                <button
                                    className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-outline'
                                        } btn-sm whitespace-nowrap`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    Tous
                                </button>
                                {carCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'
                                            } btn-sm whitespace-nowrap`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                                    <p className="text-slate-500">Recherche des meilleures offres...</p>
                                </div>
                            ) : filteredCars.length === 0 ? (
                                <div className="text-center py-20">
                                    <h3 className="text-xl font-bold text-slate-900">Aucun véhicule disponible</h3>
                                    <p className="text-slate-500">Essayez une autre destination ou modifiez vos critères.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCars.map((car, index) => (
                                        <motion.div
                                            key={car.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="card card-hover overflow-hidden"
                                        >
                                            <div className="relative h-48">
                                                <Image
                                                    src={car.vehicle?.image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80'}
                                                    alt={car.vehicle?.description || 'Car'}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <span className="badge badge-primary">{car.category}</span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                                                            {car.vehicle?.description || 'Véhicule'}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                                            <span className="font-bold text-primary-600">{car.provider?.code}</span>
                                                            <span>•</span>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                                4.5
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {car.vehicle?.seats && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                                                            <Users className="w-3 h-3 text-primary-600" />
                                                            {car.vehicle.seats} places
                                                        </span>
                                                    )}
                                                    {car.vehicle?.transmission && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                                                            <Settings className="w-3 h-3 text-primary-600" />
                                                            {car.vehicle.transmission}
                                                        </span>
                                                    )}
                                                    {car.vehicle?.ac && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                                                            <Check className="w-3 h-3 text-primary-600" />
                                                            Climatisation
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <div>
                                                        <span className="text-2xl font-bold text-primary-700">
                                                            {car.quotation?.monetaryAmount || car.price} {car.quotation?.currencyCode || '€'}
                                                        </span>
                                                        <span className="text-sm text-slate-500"> / jour</span>
                                                    </div>
                                                    <Link
                                                        href={`/${locale}/cars/book?id=${car.id}`}
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
                                Nos catégories de véhicules
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {carCategories.map((cat, index) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="card card-hover p-6 text-center cursor-pointer"
                                        onClick={() => {
                                            setSelectedCategory(cat.id);
                                            setShowResults(true);
                                        }}
                                    >
                                        <span className="text-5xl mb-3 block">{cat.icon}</span>
                                        <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Benefits */}
                            <div className="mt-16">
                                <h2 className="text-2xl font-bold font-display text-slate-900 mb-6">
                                    Pourquoi nous choisir ?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="card p-6 text-center">
                                        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Car className="w-7 h-7 text-primary-700" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2">
                                            Large choix de véhicules
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            De l'économique au luxe, trouvez le véhicule parfait
                                        </p>
                                    </div>
                                    <div className="card p-6 text-center">
                                        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Check className="w-7 h-7 text-primary-700" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2">
                                            Réservation simple
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Réservez en quelques clics, confirmation immédiate
                                        </p>
                                    </div>
                                    <div className="card p-6 text-center">
                                        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Star className="w-7 h-7 text-primary-700" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2">
                                            Partenaires vérifiés
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Tous nos partenaires sont vérifiés et notés
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
