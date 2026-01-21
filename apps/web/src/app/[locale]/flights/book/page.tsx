'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, Clock, CreditCard, Check, User, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function FlightBookingPage() {
    const t = useTranslations('flights');
    const searchParams = useSearchParams();
    const params = useParams();
    const locale = params.locale as string;
    const flightId = searchParams.get('flightId');
    const supabase = createClient();

    const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
    const [loading, setLoading] = useState(false);
    const [bookingRef, setBookingRef] = useState('CV-' + Math.floor(Math.random() * 100000));

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        passport: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePayment = async () => {
        setLoading(true);

        // 1. Simulation processing paiement
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 2. Sauvegarde Supabase
        try {
            const flightDetails = {
                flightId: flightId || '#TEST',
                origin: searchParams.get('origin') || 'PAR',
                destination: searchParams.get('dest') || 'DKR',
                date: '2024-04-12', // Idéalement viendrait des props
                company: 'Air France' // Mock car on n'a pas persisté l'état du vol sélectionné
            };

            const { error } = await supabase.from('bookings').insert({
                type: 'flight',
                status: 'confirmed',
                email: formData.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                price_amount: 189.00,
                price_currency: 'EUR',
                details: flightDetails
            });

            if (error) {
                console.error('Supabase error:', error);
                // On continue quand meme pour la démo, mais on log l'erreur
            }

        } catch (err) {
            console.error('Save failed:', err);
        }

        setLoading(false);
        setStep('confirmation');
    };

    if (step === 'confirmation') {
        return <ConfirmationView locale={locale} refCode={bookingRef} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-custom max-w-5xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 font-display">
                    {step === 'details' ? 'Finaliser votre réservation' : 'Paiement sécurisé'}
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === 'details' ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                {/* Formulaire Passager */}
                                <div className="card p-8 mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <User className="w-6 h-6 text-primary-600" />
                                        Informations passager
                                    </h2>

                                    <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="label">Prénom</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input"
                                                    placeholder="Ex: Jean"
                                                    value={formData.firstName}
                                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="label">Nom</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input"
                                                    placeholder="Ex: Dupont"
                                                    value={formData.lastName}
                                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="label">Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="input"
                                                    placeholder="jean.dupont@email.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="label">Numéro de téléphone</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="input"
                                                    placeholder="+33 6 12 34 56 78"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="label">Numéro de passeport / CNI</label>
                                            <input
                                                type="text"
                                                required
                                                className="input"
                                                placeholder="AB123456"
                                                value={formData.passport}
                                                onChange={e => setFormData({ ...formData, passport: e.target.value })}
                                            />
                                        </div>
                                    </form>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" form="booking-form" className="btn btn-primary btn-lg px-8">
                                        Continuer vers le paiement
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {/* Mock Payment Form */}
                                <div className="card p-8">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <CreditCard className="w-6 h-6 text-primary-600" />
                                        Paiement
                                    </h2>

                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 text-blue-700 text-sm">
                                        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                        <p>Ceci est une démonstration. Aucun montant ne sera débité.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="label">Numéro de carte</label>
                                            <input type="text" className="input font-mono" placeholder="0000 0000 0000 0000" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Expiration</label>
                                                <input type="text" className="input font-mono" placeholder="MM/YY" />
                                            </div>
                                            <div>
                                                <label className="label">CVC</label>
                                                <input type="text" className="input font-mono" placeholder="123" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label">Titulaire de la carte</label>
                                            <input type="text" className="input" placeholder="NOM PRENOM" />
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        <button
                                            onClick={() => setStep('details')}
                                            className="btn btn-outline flex-1"
                                        >
                                            Retour
                                        </button>
                                        <button
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>Traitement...</>
                                            ) : (
                                                <>Payer 189.00 €</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar - Recap */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-slate-900">Récapitulatif</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <Plane className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Vol Aller</p>
                                        <p className="text-sm text-slate-500">Vol {flightId || '#AF123'}</p>
                                        <p className="text-xs text-slate-400 mt-1">Direct • 2h30</p>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100" />

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Billet adulte (x1)</span>
                                    <span className="font-medium text-slate-900">150.00 €</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Taxes & frais</span>
                                    <span className="font-medium text-slate-900">39.00 €</span>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 mb-4" />

                            <div className="flex justify-between items-end mb-6">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="text-xl font-bold text-primary-600">189.00 €</span>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 text-center">
                                Annulation gratuite jusqu'à 24h avant le départ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConfirmationView({ locale, refCode }: { locale: string, refCode: string }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card max-w-lg w-full p-8 text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Réservation confirmée !</h1>
                <p className="text-slate-500 mb-8">
                    Votre paiement a été accepté. Vous recevrez vos billets par email dans quelques instants.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl text-left mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-500">Référence</span>
                        <span className="font-mono font-bold text-slate-900">{refCode}</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Montant payé</span>
                        <span className="font-bold text-slate-900">189.00 €</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link href={`/${locale}/account/bookings`} className="btn btn-primary w-full">
                        Voir ma réservation
                    </Link>
                    <Link href={`/${locale}`} className="btn btn-outline w-full">
                        Retour à l'accueil
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
