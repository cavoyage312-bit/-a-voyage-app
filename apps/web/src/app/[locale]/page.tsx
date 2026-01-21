'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SearchTabs } from '@/components/search/SearchTabs';
import {
    Shield,
    CreditCard,
    Headphones,
    Star,
    ArrowRight,
    Plane,
    Building2,
    Car,
    Train
} from 'lucide-react';

export default function HomePage() {
    const t = useTranslations('home');
    const params = useParams();
    const locale = params.locale as string;

    const services = [
        {
            id: 'flights',
            title: 'Vols',
            desc: 'Meilleurs tarifs garantis',
            icon: Plane,
            href: `/${locale}/flights`,
            color: 'bg-blue-500',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'hotels',
            title: 'Hôtels',
            desc: 'Partout dans le monde',
            icon: Building2,
            href: `/${locale}/hotels`,
            color: 'bg-emerald-500',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'cars',
            title: 'Voitures',
            desc: 'Location & Transferts',
            icon: Car,
            href: `/${locale}/cars`,
            color: 'bg-amber-500',
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'transit',
            title: 'Transports',
            desc: 'Bus, Métro & Itinéraires',
            icon: Train,
            href: `/${locale}/transit`,
            color: 'bg-purple-500',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=80'
        }
    ];

    const features = [
        { icon: Shield, title: 'Paiement sécurisé', desc: 'Transactions 100% sécurisées' },
        { icon: CreditCard, title: 'Meilleurs prix', desc: 'Garantie du prix le plus bas' },
        { icon: Headphones, title: 'Support 24/7', desc: 'Assistance à tout moment' },
    ];

    const destinations = [
        {
            city: 'Dakar',
            country: 'Sénégal',
            image: 'https://images.unsplash.com/photo-1617965897295-a55e52849c8a?w=600&h=400&fit=crop',
            price: 350,
            flag: '🇸🇳',
        },
        {
            city: 'Abidjan',
            country: "Côte d'Ivoire",
            image: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=600&h=400&fit=crop',
            price: 420,
            flag: '🇨🇮',
        },
        {
            city: 'Casablanca',
            country: 'Maroc',
            image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=600&h=400&fit=crop',
            price: 180,
            flag: '🇲🇦',
        },
        {
            city: 'Lagos',
            country: 'Nigeria',
            image: 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=600&h=400&fit=crop',
            price: 380,
            flag: '🇳🇬',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section - Super App Style */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden rounded-b-[3rem] bg-slate-900 shadow-xl">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6 tracking-tight"
                        >
                            Tout votre voyage,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                dans une seule app.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-300 max-w-2xl mx-auto"
                        >
                            Vols, Hôtels, Voitures et Transports urbains.
                            Planifiez, réservez et voyagez sans limites.
                        </motion.p>
                    </div>

                    {/* Services Grid (Super App Buttons) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                            >
                                <Link href={service.href} className="group relative block h-40 sm:h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className={`absolute inset-0 opacity-60 transition-opacity group-hover:opacity-70 ${service.color}`} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                        <service.icon className="w-10 h-10 mb-3 drop-shadow-md" />
                                        <h3 className="text-xl font-bold font-display drop-shadow-md">{service.title}</h3>
                                        <p className="text-xs text-white/90 mt-1 font-medium">{service.desc}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Search Tab (Optional, floated below) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 max-w-4xl mx-auto"
                    >
                        <SearchTabs />
                    </motion.div>
                </div>
            </section>

            {/* Popular Destinations */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-slate-900">
                                {t('popularDestinations')}
                            </h2>
                            <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base">
                                Les destinations les plus recherchées
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/flights`}
                            className="text-primary-700 font-semibold hover:text-primary-800 flex items-center gap-1 text-sm sm:text-base self-start sm:self-auto"
                        >
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Destinations Grid - Responsive */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {destinations.map((dest, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <Link href={`/${locale}/flights/search?to=${dest.city}`}>
                                    <div className="card card-hover overflow-hidden h-full">
                                        <div className="relative aspect-[4/3] sm:aspect-[4/3]">
                                            <Image
                                                src={dest.image}
                                                alt={dest.city}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Price badge */}
                                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                                <span className="price-badge text-sm sm:text-base">
                                                    {dest.price} €
                                                </span>
                                            </div>

                                            {/* City info */}
                                            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <span className="text-lg sm:text-xl">{dest.flag}</span>
                                                    <div>
                                                        <h3 className="font-bold text-white text-sm sm:text-lg leading-tight">
                                                            {dest.city}
                                                        </h3>
                                                        <p className="text-white/80 text-xs sm:text-sm">
                                                            {dest.country}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA App Mobile (Optionnel) */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-primary-500 to-transparent"></div>
                <div className="container-custom relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Partout avec vous.</h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto md:mx-0">
                            Retrouvez vos billets d'avion, vos réservations d'hôtel et vos tickets de métro directement sur votre mobile.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                                <span className="text-xl"></span> App Store
                            </button>
                            <button className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                                <span className="text-xl">🤖</span> Google Play
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        {/* Mock Phone simplified */}
                        <div className="relative w-64 h-[500px] bg-slate-800 rounded-[3rem] border-8 border-slate-700 mx-auto shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-700 rounded-b-xl z-20"></div>
                            <div className="w-full h-full bg-slate-900 relative">
                                {/* Screen Content */}
                                <div className="p-6 pt-12 space-y-4">
                                    <div className="h-8 w-3/4 bg-slate-700 rounded mb-6"></div>
                                    <div className="h-32 bg-primary-600 rounded-2xl"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 bg-slate-700 rounded-xl"></div>
                                        <div className="h-24 bg-slate-700 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
