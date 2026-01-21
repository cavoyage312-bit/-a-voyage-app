'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Bus, Car, ChevronRight, BarChart3, Users, CreditCard, Shield } from 'lucide-react';

export default function PartnerHub() {
    const params = useParams();
    const locale = params.locale as string;

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
                    <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
                        Sélectionnez votre type de partenariat
                    </h2>

                    <div className="grid gap-4 mb-12">
                        {partnerTypes.map((type, i) => (
                            <motion.div
                                key={type.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={type.href}
                                    className="card card-hover p-6 flex items-center gap-4"
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

                    <div className="text-center mb-8">
                        <p className="text-slate-500 mb-4">Pas encore partenaire ?</p>
                        <Link href={`/${locale}/partner/register`} className="btn btn-primary btn-lg">
                            Devenir Partenaire
                        </Link>
                    </div>

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
