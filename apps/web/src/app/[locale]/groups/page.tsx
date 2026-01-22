'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Plane,
    Bus,
    Building2,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Star,
    Clock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GroupQuoteForm } from '@/components/groups/GroupQuoteForm';

const advantages = [
    {
        icon: ShieldCheck,
        title: 'Tarifs Négociés',
        description: 'Bénéficiez de tarifs préférentiels bloqués pour l\'ensemble du groupe.'
    },
    {
        icon: Clock,
        title: 'Flexibilité Totale',
        description: 'Changement de noms gratuit jusqu\'à 7 jours avant le départ sur les vols.'
    },
    {
        icon: Users,
        title: 'Accompagnement Dédié',
        description: 'Un conseiller unique pour gérer toute votre logistique de A à Z.'
    }
];

const services = [
    {
        title: 'Vols de Groupe (10+)',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&w=800&q=80',
        description: 'Délégations, mariages, événements sportifs. Nous gérons vos blocs de sièges.'
    },
    {
        title: 'Autocars & Minibus',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        description: 'Location de véhicules avec chauffeur pour vos transferts ou circuits.'
    },
    {
        title: 'Séminaires & MICE',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        description: 'Organisation complète : transport, hébergement et salles de réunion.'
    }
];

export default function GroupsPage() {
    const params = useParams();
    const locale = params.locale as string;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
                        alt="Business travel group"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
                </div>

                <div className="container-custom relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-200 text-sm font-semibold mb-6">
                            Solutions Business & Groupes
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
                            Simplifiez vos voyages <span className="text-primary-400">collectifs</span>
                        </h1>
                        <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                            Que vous soyez une entreprise, une association ou une grande famille,
                            nous gérons toute la logistique de votre voyage à partir de 10 personnes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="#quote-form" className="btn btn-primary btn-lg px-8">
                                Demander un devis
                            </a>
                            <button className="btn bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm btn-lg">
                                Nos services
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Advantages */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom">
                    <div className="grid md:grid-cols-3 gap-8">
                        {advantages.map((adv, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                            >
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                                    <adv.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{adv.title}</h3>
                                <p className="text-slate-600 line-height-relaxed">{adv.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 lg:py-32">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Une expertise complète par type de service
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Nous mobilisons nos meilleurs prestataires pour garantir le succès de votre événement.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden rounded-3xl h-[450px]"
                            >
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                                    <p className="text-slate-200 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {service.description}
                                    </p>
                                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote Form Section */}
            <section id="quote-form" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500 rounded-full blur-[150px]" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-4xl font-bold font-display mb-6">
                                        Obtenez votre devis <br />
                                        <span className="text-primary-400 text-5xl">en moins de 24h</span>
                                    </h2>
                                    <p className="text-slate-400 text-lg">
                                        Remplissez le formulaire ci-contre et nos experts reviendront vers vous avec
                                        une proposition détaillée et optimisée pour votre budget.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary-500/10 rounded-lg">
                                            <CheckCircle2 className="w-6 h-6 text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Aucun frais caché</p>
                                            <p className="text-sm text-slate-500">Nos devis sont transparents et incluent toutes les taxes.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary-500/10 rounded-lg">
                                            <CheckCircle2 className="w-6 h-6 text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Soutien logistique</p>
                                            <p className="text-sm text-slate-500">Aide au montage des listes de passagers et des plans de chambre.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <p className="italic text-slate-300 mb-4">
                                        "L'organisation de notre séminaire à Dakar pour 45 personnes a été un succès total grâce à l'équipe de ÇA VOYAGE. Tout était parfait."
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-700 rounded-full" />
                                        <div>
                                            <p className="font-bold text-white">Marc L.</p>
                                            <p className="text-sm text-slate-500">Directeur RH, Tech Africa</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-2xl text-slate-900 overflow-hidden">
                                <GroupQuoteForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
