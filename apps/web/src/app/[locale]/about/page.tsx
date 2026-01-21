'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    Users,
    Globe,
    Shield,
    Heart,
    Target,
    Award,
    MapPin,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const params = useParams();
    const locale = params.locale as string;

    const values = [
        {
            icon: Heart,
            title: 'Passion du voyage',
            description: 'Nous partageons votre amour des découvertes et des nouvelles expériences.',
        },
        {
            icon: Shield,
            title: 'Confiance & Sécurité',
            description: 'Vos réservations et paiements sont 100% sécurisés.',
        },
        {
            icon: Users,
            title: 'Service client',
            description: 'Une équipe dédiée disponible 24/7 pour vous accompagner.',
        },
        {
            icon: Target,
            title: 'Meilleurs prix',
            description: 'Nous négocions les meilleurs tarifs avec nos partenaires.',
        },
    ];

    const stats = [
        { value: '500K+', label: 'Voyageurs satisfaits' },
        { value: '50+', label: 'Destinations' },
        { value: '200+', label: 'Partenaires' },
        { value: '4.8/5', label: 'Note moyenne' },
    ];

    const team = [
        {
            name: 'Amadou Diallo',
            role: 'Fondateur & CEO',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        },
        {
            name: 'Marie Koné',
            role: 'Directrice des Opérations',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
        },
        {
            name: 'Jean-Pierre Eba',
            role: 'Directeur Technique',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
        },
        {
            name: 'Fatou Sow',
            role: 'Responsable Partenariats',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="relative py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=1080&fit=crop"
                        alt="Travel"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/70" />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white mb-6">
                            Voyager ensemble, simplement
                        </h1>
                        <p className="text-xl text-white/90">
                            Depuis 2020, ÇA VOYAGE connecte les voyageurs africains et européens
                            aux meilleures offres de transport et d'hébergement.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white py-12 sm:py-16 border-b border-slate-100">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-700 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-slate-500 text-sm sm:text-base">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story */}
            <section className="section bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-6">
                                Notre histoire
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    ÇA VOYAGE est né d'un constat simple : réserver un voyage en Afrique
                                    était souvent compliqué, avec des options dispersées et des prix peu transparents.
                                </p>
                                <p>
                                    Notre fondateur, Amadou Diallo, a créé cette plateforme pour simplifier
                                    l'accès aux voyages pour tous. Aujourd'hui, nous proposons des vols,
                                    hôtels, bus et locations de voitures dans plus de 50 destinations.
                                </p>
                                <p>
                                    Notre mission : rendre le voyage accessible, transparent et agréable
                                    pour tous les voyageurs, qu'ils soient en Afrique ou en Europe.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-80 sm:h-96 rounded-2xl overflow-hidden"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800&h=600&fit=crop"
                                alt="Team working"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section bg-gradient-hero">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
                            Nos valeurs
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Ce qui nous guide au quotidien
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card p-6 text-center"
                            >
                                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-7 h-7 text-primary-700" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{value.title}</h3>
                                <p className="text-slate-500 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
                            Notre équipe
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Des passionnés de voyage à votre service
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card card-hover overflow-hidden group"
                            >
                                <div className="relative h-64">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                                    <p className="text-sm text-primary-700">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary-700">
                <div className="container-custom text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Rejoignez l'aventure
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        Inscrivez-vous gratuitement et commencez à explorer le monde avec ÇA VOYAGE
                    </p>
                    <Link href={`/${locale}/auth/signup`} className="btn btn-white btn-lg">
                        Créer mon compte
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
