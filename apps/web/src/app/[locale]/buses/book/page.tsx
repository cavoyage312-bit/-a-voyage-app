'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
    Bus,
    User,
    Mail,
    Phone,
    CreditCard,
    Shield,
    Check,
    ChevronRight,
    Clock,
    MapPin,
} from 'lucide-react';
import Link from 'next/link';

export default function BusBookingPage() {
    const t = useTranslations('booking');
    const params = useParams();
    const locale = params.locale as string;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        seatPreference: 'window',
    });

    // Mock bus data
    const bus = {
        company: 'Sonef Transport',
        from: 'Abidjan',
        to: 'Yamoussoukro',
        departure: '06:00',
        arrival: '10:30',
        duration: '4h 30min',
        date: '20 Mars 2024',
        price: 5000,
        currency: 'XOF',
        seat: '12A',
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
                            <Bus className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">Réservation Bus</h1>
                            <p className="text-white/80 text-sm">{bus.from} → {bus.to}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b border-slate-200 py-4">
                <div className="container-custom">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {[
                            { num: 1, label: 'Passager' },
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
                                            Informations du passager
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
                                                    Préférence de siège
                                                </label>
                                                <div className="flex gap-4">
                                                    {['window', 'aisle'].map((pref) => (
                                                        <label key={pref} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="seatPreference"
                                                                value={pref}
                                                                checked={formData.seatPreference === pref}
                                                                onChange={(e) =>
                                                                    setFormData({ ...formData, seatPreference: e.target.value })
                                                                }
                                                                className="text-primary-700"
                                                            />
                                                            <span className="text-sm">
                                                                {pref === 'window' ? 'Fenêtre' : 'Couloir'}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
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

                                        {/* Mobile Money Options */}
                                        <div className="mb-6">
                                            <p className="text-sm font-medium text-slate-700 mb-3">
                                                Choisir un mode de paiement
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Orange Money', 'MTN Money', 'Wave', 'Carte bancaire'].map((method) => (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        className="p-4 border-2 border-slate-200 rounded-xl hover:border-primary-500 transition-colors text-sm font-medium"
                                                    >
                                                        {method}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-primary-700" />
                                            <span className="text-sm text-slate-600">
                                                {t('securePayment')}
                                            </span>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-lg w-full">
                                        {t('payNow')} - {bus.price.toLocaleString()} {bus.currency}
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
                                        Votre billet de bus est confirmé
                                    </p>
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6 inline-block">
                                        <p className="text-sm text-slate-500 mb-1">{t('bookingReference')}</p>
                                        <p className="text-2xl font-bold font-mono text-primary-700">
                                            CV-BUS-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6">
                                        Un SMS et email de confirmation ont été envoyés
                                    </p>
                                    <Link href={`/${locale}`} className="btn btn-primary btn-lg">
                                        Retour à l'accueil
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar - Trip Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-4 sm:p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Récapitulatif
                            </h3>

                            {/* Route Info */}
                            <div className="border border-slate-200 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
                                        🚌
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{bus.company}</p>
                                        <p className="text-xs text-slate-500">{bus.date}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-primary-600" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{bus.departure}</p>
                                            <p className="text-sm text-slate-500">{bus.from}</p>
                                        </div>
                                    </div>
                                    <div className="ml-1.5 border-l-2 border-dashed border-slate-300 h-6" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-primary-600" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{bus.arrival}</p>
                                            <p className="text-sm text-slate-500">{bus.to}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Clock className="w-4 h-4" />
                                        {bus.duration}
                                    </div>
                                    <div className="font-medium">Siège {bus.seat}</div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-slate-900">{t('total')}</span>
                                <span className="price-badge text-xl">{bus.price.toLocaleString()} {bus.currency}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
