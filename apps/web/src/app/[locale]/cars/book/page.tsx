'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
    Car,
    User,
    Mail,
    Phone,
    CreditCard,
    Shield,
    Check,
    ChevronRight,
    Calendar,
    MapPin,
    FileText,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CarBookingPage() {
    const t = useTranslations('booking');
    const params = useParams();
    const locale = params.locale as string;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseExpiry: '',
    });

    // Mock car data
    const car = {
        name: 'Peugeot 3008',
        category: 'SUV',
        image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop',
        pickupLocation: 'Aéroport CDG, Paris',
        pickupDate: '20 Mars 2024',
        pickupTime: '10:00',
        returnDate: '25 Mars 2024',
        returnTime: '10:00',
        days: 5,
        pricePerDay: 55,
        features: ['Automatique', 'Climatisation', '5 places', 'GPS'],
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
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">Location de voiture</h1>
                            <p className="text-white/80 text-sm">{car.name} - {car.category}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b border-slate-200 py-4">
                <div className="container-custom">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {[
                            { num: 1, label: 'Conducteur' },
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
                                            Informations du conducteur
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
                                        </div>
                                    </div>

                                    <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary-700" />
                                            Permis de conduire
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Numéro de permis *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={formData.licenseNumber}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, licenseNumber: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Date d'expiration *
                                                </label>
                                                <input
                                                    type="date"
                                                    className="input"
                                                    value={formData.licenseExpiry}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, licenseExpiry: e.target.value })
                                                    }
                                                    required
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
                                <form onSubmit={handleSubmit}>
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
                                                {t('securePayment')} - Caution de 500€ préautorisée
                                            </span>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-lg w-full">
                                        {t('payNow')} - {car.pricePerDay * car.days} €
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
                                        Votre location est confirmée
                                    </p>
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6 inline-block">
                                        <p className="text-sm text-slate-500 mb-1">{t('bookingReference')}</p>
                                        <p className="text-2xl font-bold font-mono text-primary-700">
                                            CV-CAR-{Math.random().toString(36).substr(2, 6).toUpperCase()}
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

                    {/* Sidebar - Car Summary */}
                    <div className="lg:col-span-1">
                        <div className="card overflow-hidden sticky top-24">
                            {/* Car Image */}
                            <div className="relative h-40 sm:h-48">
                                <Image
                                    src={car.image}
                                    alt={car.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="badge badge-primary">{car.category}</span>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-4">{car.name}</h3>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {car.features.map((feature) => (
                                        <span
                                            key={feature}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600"
                                        >
                                            <Check className="w-3 h-3 text-primary-600" />
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Rental Details */}
                                <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{car.pickupLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>{car.pickupDate} → {car.returnDate}</span>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {/* Price Breakdown */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">{car.pricePerDay} € x {car.days} jours</span>
                                        <span className="font-medium">{car.pricePerDay * car.days} €</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Assurance tous risques</span>
                                        <span className="font-medium text-primary-600">Incluse</span>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-900">{t('total')}</span>
                                    <span className="price-badge text-xl">{car.pricePerDay * car.days} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
