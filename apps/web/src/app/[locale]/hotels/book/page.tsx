'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
    Building2,
    User,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    Shield,
    Check,
    ChevronRight,
    Star,
    Wifi,
    Car,
    Coffee,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { createClient } from '@/lib/supabase';

export default function HotelBookingPage() {
    const t = useTranslations('booking');
    const params = useParams();
    const locale = params.locale as string;

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
    });

    // Mock hotel data
    const hotel = {
        name: 'Hôtel Terrou-Bi',
        location: 'Dakar, Sénégal',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
        stars: 5,
        rating: 4.8,
        reviews: 324,
        checkIn: '15 Mars 2024',
        checkOut: '18 Mars 2024',
        nights: 3,
        roomType: 'Chambre Deluxe Vue Mer',
        price: 180,
        amenities: ['Wi-Fi', 'Parking', 'Petit-déjeuner', 'Piscine'],
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="header-gradient py-6">
                <div className="container-custom">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">{t('title')}</h1>
                            <p className="text-white/80 text-sm">{hotel.name} - {hotel.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b border-slate-200 py-4">
                <div className="container-custom">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {[
                            { num: 1, label: 'Informations' },
                            { num: 2, label: 'Paiement' },
                            { num: 3, label: 'Confirmation' },
                        ].map((s, i) => (
                            <div key={s.num} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.num
                                        ? 'bg-primary-700 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                        }`}
                                >
                                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                                </div>
                                <span
                                    className={`ml-2 text-sm font-medium hidden sm:inline ${step >= s.num ? 'text-primary-700' : 'text-slate-500'
                                        }`}
                                >
                                    {s.label}
                                </span>
                                {i < 2 && (
                                    <ChevronRight className="w-5 h-5 text-slate-300 mx-2 sm:mx-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container-custom py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && (
                                <form onSubmit={handleSubmit}>
                                    <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                            <User className="w-5 h-5 text-primary-700" />
                                            Informations du voyageur
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    {t('firstName')} *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={formData.firstName}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, firstName: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    {t('lastName')} *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={formData.lastName}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, lastName: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    {t('email')} *
                                                </label>
                                                <input
                                                    type="email"
                                                    className="input"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, email: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    {t('phone')} *
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="input"
                                                    value={formData.phone}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, phone: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Demandes spéciales (optionnel)
                                                </label>
                                                <textarea
                                                    className="input min-h-[100px]"
                                                    placeholder="Lit bébé, étage élevé, etc."
                                                    value={formData.specialRequests}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, specialRequests: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-lg w-full">
                                        Continuer vers le paiement
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);

                                    try {
                                        const supabase = createClient();
                                        const { data: { session } } = await supabase.auth.getSession();
                                        const token = session?.access_token;

                                        const res = await fetch('/api/bookings', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                ...(token && { 'Authorization': `Bearer ${token}` })
                                            },
                                            body: JSON.stringify({
                                                type: 'hotel',
                                                status: 'confirmed',
                                                email: formData.email,
                                                first_name: formData.firstName,
                                                last_name: formData.lastName,
                                                price_amount: hotel.price * hotel.nights,
                                                price_currency: 'EUR',
                                                details: {
                                                    hotelId: 'MOCK-HTL-01',
                                                    name: hotel.name,
                                                    location: hotel.location,
                                                    checkIn: hotel.checkIn,
                                                    checkOut: hotel.checkOut,
                                                    roomType: hotel.roomType
                                                }
                                            })
                                        });

                                        if (!res.ok) {
                                            const err = await res.json();
                                            alert('Erreur: ' + (err.error || 'Erreur inconnue'));
                                            setLoading(false);
                                            return;
                                        }

                                        setStep(3);
                                    } catch (err) {
                                        console.error(err);
                                        alert('Une erreur est survenue');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}>
                                    <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-primary-700" />
                                            {t('payment')}
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Numéro de carte
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="1234 5678 9012 3456"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                                        Date d'expiration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        placeholder="MM/AA"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        placeholder="123"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-primary-700" />
                                            <span className="text-sm text-slate-600">
                                                {t('securePayment')} - Vos données sont cryptées
                                            </span>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2">
                                        {loading ? <span className="animate-spin">⌛</span> : null}
                                        {t('payNow')} - {hotel.price * hotel.nights} €
                                    </button>
                                </form>
                            )}

                            {step === 3 && (
                                <div className="card p-6 sm:p-8 text-center">
                                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-10 h-10 text-primary-700" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                        Merci {formData.firstName} !
                                    </h2>
                                    <p className="text-lg text-slate-600 mb-6">
                                        {t('bookingConfirmed')}
                                    </p>
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6 inline-block">
                                        <p className="text-sm text-slate-500 mb-1">{t('bookingReference')}</p>
                                        <p className="text-2xl font-bold font-mono text-primary-700">
                                            CV-HTL-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6">{t('emailSent')}</p>
                                    <Link href={`/${locale}`} className="btn btn-primary btn-lg">
                                        Retour à l'accueil
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar - Hotel Summary */}
                    <div className="lg:col-span-1">
                        <div className="card overflow-hidden sticky top-24">
                            {/* Hotel Image */}
                            <div className="relative h-40 sm:h-48">
                                <Image
                                    src={hotel.image}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{hotel.name}</h3>
                                        <p className="text-sm text-slate-500">{hotel.location}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="font-semibold text-sm">{hotel.rating}</span>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: hotel.stars }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                {/* Room Info */}
                                <div className="bg-slate-50 rounded-xl p-3 mb-4">
                                    <p className="font-medium text-sm text-slate-900">{hotel.roomType}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                        <span>{hotel.checkIn} → {hotel.checkOut}</span>
                                        <span>{hotel.nights} nuits</span>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {hotel.amenities.map((amenity) => (
                                        <span
                                            key={amenity}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs"
                                        >
                                            <Check className="w-3 h-3" />
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                <hr className="my-4" />

                                {/* Price Breakdown */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">{hotel.price} € x {hotel.nights} nuits</span>
                                        <span className="font-medium">{hotel.price * hotel.nights} €</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Taxes et frais</span>
                                        <span className="font-medium">Inclus</span>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-900">{t('total')}</span>
                                    <span className="price-badge text-xl">{hotel.price * hotel.nights} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
