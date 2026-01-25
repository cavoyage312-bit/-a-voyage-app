'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Bus, Car, ChevronRight, BarChart3, Users, CreditCard, Shield, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function PartnerHub() {
    const params = useParams();
    const locale = params.locale as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [partnerStatus, setPartnerStatus] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: partnerData } = await supabase
                    .from('partners')
                    .select('status')
                    .eq('user_id', user.id)
                    .single();

                if (partnerData) {
                    setPartnerStatus(partnerData.status);
                }
            }
            setLoading(false);
        };

        checkStatus();
    }, []);

    const partnerTypes = [
        {
            id: 'hotel',
            icon: Building2,
            title: 'Dashboard Hôtel',
            description: 'Gérez vos chambres, réservations et avis clients',
            color: 'bg-primary-100 text-primary-700',
            href: `/${locale}/partner/hotel`,
        },
        {
            id: 'bus',
            icon: Bus,
            title: 'Dashboard Bus',
            description: 'Gérez vos trajets, horaires et flotte de bus',
            color: 'bg-orange-100 text-orange-600',
            href: `/${locale}/partner/bus`,
        },
        {
            id: 'car',
            icon: Car,
            title: 'Dashboard Location',
            description: 'Gérez votre parc automobile et locations',
            color: 'bg-blue-100 text-blue-600',
            href: `/${locale}/partner/car`,
        },
    ];

    const features = [
        { icon: BarChart3, title: 'Statistiques détaillées', description: 'Suivez vos performances en temps réel' },
        { icon: Users, title: 'Gestion clients', description: 'Gérez vos réservations facilement' },
        { icon: CreditCard, title: 'Paiements sécurisés', description: 'Recevez vos revenus rapidement' },
        { icon: Shield, title: 'Support dédié', description: 'Une équipe à votre écoute 7j/7' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="header-gradient py-12 sm:py-16">
                <div className="container-custom text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
                            Espace Partenaires
                        </h1>
                        <p className="text-white/80 max-w-xl mx-auto">
                            Accédez à votre tableau de bord pour gérer votre activité
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-slate-100 mb-12">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">Vérification de votre statut...</p>
                        </div>
                    ) : partnerStatus === 'pending' ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-amber-50 rounded-3xl border border-amber-100 mb-12 text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-2">Demande en cours d'examen</h2>
                            <p className="text-amber-700 max-w-md mx-auto mb-6">
                                Votre demande de partenariat a bien été reçue. Notre équipe l'étudie actuellement. Vous recevrez un accès complet dès validation.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Actualiser le statut
                            </button>
                        </div>
                    ) : partnerStatus === 'rejected' ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-3xl border border-red-100 mb-12 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-red-900 mb-2">Demande refusée</h2>
                            <p className="text-red-700 max-w-md mx-auto mb-6">
                                Malheureusement, votre demande n'a pas été retenue pour le moment. Vous pouvez nous contacter pour plus d'informations.
                            </p>
                            <Link href={`/${locale}/contact`} className="btn bg-red-600 hover:bg-red-700 text-white">
                                Contacter le support
                            </Link>
                        </div>
                    ) : partnerStatus === 'approved' ? (
                        <div className="grid gap-4 mb-12">
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-emerald-900 font-bold">Partenariat validé !</p>
                                    <p className="text-emerald-700 text-sm">Sélectionnez votre dashboard ci-dessous.</p>
                                </div>
                            </div>
                            {partnerTypes.map((type, i) => (
                                <motion.div
                                    key={type.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={type.href}
                                        className="card card-hover p-6 flex items-center gap-4 border-emerald-100"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type.color}`}>
                                            <type.icon className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-slate-900">{type.title}</h3>
                                            <p className="text-slate-500 text-sm">{type.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mb-12 p-12 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <Shield className="w-8 h-8 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Devenez Partenaire</h2>
                            <p className="text-slate-500 max-w-md mx-auto mb-8">
                                Proposez vos services sur Ça Voyage et boostez votre visibilité auprès de milliers de voyageurs.
                            </p>
                            <Link href={`/${locale}/partner/register`} className="btn btn-primary btn-lg px-12">
                                Déposer une demande
                            </Link>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature, i) => (
                            <div key={i} className="text-center p-4">
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <feature.icon className="w-6 h-6 text-primary-700" />
                                </div>
                                <h3 className="font-semibold text-slate-900 text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-slate-500">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
