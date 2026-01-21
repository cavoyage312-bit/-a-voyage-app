'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, CreditCard, ArrowLeft, Bus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function TicketPage() {
    const searchParams = useSearchParams();
    const params = useParams();
    const locale = params.locale as string;
    const supabase = createClient();

    const price = searchParams.get('price') || '2.00';
    const duration = searchParams.get('duration') || '30';

    const [step, setStep] = useState<'payment' | 'ticket'>('payment');
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);

        // 1. Simuler paiement
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 2. Sauvegarder dans Supabase
        try {
            const { error } = await supabase.from('bookings').insert({
                type: 'transit',
                status: 'active',
                price_amount: parseFloat(price),
                price_currency: 'EUR',
                details: {
                    title: 'Ticket Unitaire Multimodal',
                    duration: duration + ' min',
                    validity: '1h',
                    zone: '1-3'
                }
            });

            if (error) {
                console.error('Supabase error:', error);
            } else {
                console.log('Ticket saved via Supabase !');
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
        setStep('ticket');
    };

    if (step === 'ticket') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
                >
                    {/* Header Ticket */}
                    <div className="bg-primary-600 p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full"></div>
                        </div>
                        <h1 className="text-xl font-bold font-display relative z-10">M-Ticket</h1>
                        <p className="text-primary-100 text-sm relative z-10">Valable 1 heure</p>
                    </div>

                    <div className="p-8 text-center">
                        <div className="border-4 border-slate-900 rounded-xl p-2 inline-block mb-6">
                            {/* Simulation QR Code visuel */}
                            <div className="w-48 h-48 bg-slate-900 relative flex items-center justify-center">
                                <div className="grid grid-cols-5 gap-1 w-full h-full p-2">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                                    ))}
                                </div>
                                <QrCode className="absolute text-white w-12 h-12 mix-blend-difference" />
                            </div>
                        </div>

                        <p className="text-2xl font-bold text-slate-900 mb-1">{price} €</p>
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Actif maintenant
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Date</span>
                                <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Heure</span>
                                <span className="font-bold text-slate-900">{new Date().toLocaleTimeString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Durée</span>
                                <span className="font-bold text-slate-900">{duration} min</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-6">
                            Présentez ce code au chauffeur ou au portique.
                            Luminosité maximale recommandée.
                        </p>

                        <Link href={`/${locale}/transit`} className="btn btn-outline w-full">
                            Fermer
                        </Link>
                    </div>

                    {/* Effet "déchiré" ticket en bas (optionnel, simple CSS border trick) */}
                    <div className="absolute bottom-0 w-full h-4 bg-slate-900" style={{ clipPath: 'polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)' }}></div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
            <div className="card w-full max-w-md p-8">
                <Link href={`/${locale}/transit`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>

                <h1 className="text-2xl font-bold text-slate-900 mb-6">Acheter un ticket</h1>

                <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                            <Bus className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Ticket Unitaire</p>
                            <p className="text-xs text-slate-500">Valable 1 voyage</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{price} €</span>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="label">Numéro de carte</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="text" className="input pl-10 font-mono" placeholder="0000 0000 0000 0000" defaultValue="4242 4242 4242 4242" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Expiration</label>
                            <input type="text" className="input font-mono" placeholder="MM/YY" defaultValue="12/25" />
                        </div>
                        <div>
                            <label className="label">CVC</label>
                            <input type="text" className="input font-mono" placeholder="123" defaultValue="123" />
                        </div>
                    </div>
                </form>

                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="btn btn-primary w-full btn-lg mt-8 flex items-center justify-center gap-2"
                >
                    {loading ? 'Traitement...' : `Payer ${price} €`}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                    Paiement sécurisé par Stripe
                </p>
            </div>
        </div>
    );
}
