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
    Home,
    Car,
    Train,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import { PartnerBanner } from '@/components/layout/PartnerBanner';

export default function HomePage() {
    const t = useTranslations('home');
    const params = useParams();
    const locale = params.locale as string;

    const services = [
        {
            id: 'flights',
            title: t('services.flights.title'),
            desc: t('services.flights.desc'),
            icon: Plane,
            href: `/${locale}/flights`,
            color: 'bg-blue-500',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'hotels',
            title: t('services.hotels.title'),
            desc: t('services.hotels.desc'),
            icon: Building2,
            href: `/${locale}/hotels`,
            color: 'bg-emerald-500',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'cars',
            title: t('services.cars.title'),
            desc: t('services.cars.desc'),
            icon: Car,
            href: `/${locale}/cars`,
            color: 'bg-amber-500',
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'transit',
            title: t('services.transit.title'),
            desc: t('services.transit.desc'),
            icon: Train,
            href: `/${locale}/transit`,
            color: 'bg-purple-500',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'apartments',
            title: t('services.apartments.title'),
            desc: t('services.apartments.desc'),
            icon: Home,
            href: `/${locale}/apartments`,
            color: 'bg-rose-500',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
        }
    ];

    const features = [
        { icon: Shield, title: t('features.payment.title'), desc: t('features.payment.desc') },
        { icon: CreditCard, title: t('features.prices.title'), desc: t('features.prices.desc') },
        { icon: Headphones, title: t('features.support.title'), desc: t('features.support.desc') },
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
                            {t.rich('title', {
                                br: () => <br />,
                                span: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">{chunks}</span>
                            })}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-300 max-w-2xl mx-auto whitespace-pre-line"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>

                    {/* Services Grid (Super App Buttons) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                            >
                                <Link href={service.href} prefetch={false} className="group relative block h-40 sm:h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
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
                                {t('popularSubtitle')}
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/flights`}
                            className="text-primary-700 font-semibold hover:text-primary-800 flex items-center gap-1 text-sm sm:text-base self-start sm:self-auto"
                        >
                            {t('seeAll')} <ArrowRight className="w-4 h-4" />
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
                                <Link href={`/${locale}/flights/search?to=${dest.city}`} prefetch={false}>
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

            {/* Features Section - Premium Redesign */}
            <section className="py-24 bg-slate-50/50 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary-100 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-50 rounded-full blur-[120px] opacity-50" />

                <div className="container-custom relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                            >
                                <div className="group relative bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2">
                                    <div className="relative mb-8">
                                        {/* Icon Gloow */}
                                        <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary-50 to-emerald-50 rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            <feature.icon className="w-10 h-10 text-primary-600 drop-shadow-sm" />
                                        </div>
                                    </div>

                                    <h3 className="font-display font-black text-2xl text-slate-900 mb-4 tracking-tight">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        {feature.desc}
                                    </p>

                                    {/* Subtle bottom accent line */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary-400 to-emerald-400 rounded-full group-hover:w-1/3 transition-all duration-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Banner - Nouveau CTA */}
            <PartnerBanner locale={locale} />

            {/* CTA App Mobile - Version Premium */}
            <section className="py-24 lg:py-32 bg-slate-950 text-white overflow-hidden relative">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
                </div>

                <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-sm font-bold mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>{t('app.badge')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-6 tracking-tight leading-[1.1]">
                            {t.rich('app.title', {
                                br: () => <br className="hidden lg:block" />,
                                span: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">{chunks}</span>
                            })}
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            {t('app.desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="group bg-white text-slate-950 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-primary-500/20 active:scale-95">
                                <svg className="w-6 h-6" viewBox="0 0 384 512" fill="currentColor">
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-22.2-84.6-21.8-44 1.2-84.6 25.9-107.4 65.5-46.6 81.6-11.9 202.9 33.1 268.3 22 31.8 48.4 67 82.2 65.7 32.1-1.3 44.3-20.7 83.1-20.7 38.4 0 49.3 20.7 83.1 20.1 34.5-.6 57.3-31.1 79.4-63.1 25.4-36.8 35.8-72.5 36.1-74.4-1-.4-69.5-26.7-69.6-106.3zM281.2 87.6c19-23 31.8-55 28.3-87.6-28.1 1.1-62.1 18.7-82.3 42.4-18.1 21-33.8 53.6-29.5 85.1 31.2 2.4 63.8-17.1 83.5-39.9z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">{t('app.downloadOn')}</p>
                                    <p className="text-base leading-none">App Store</p>
                                </div>
                            </button>

                            <button className="group bg-slate-800 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-700 transition-all flex items-center justify-center gap-3 border border-white/5 shadow-xl active:scale-95">
                                <svg className="w-6 h-6" viewBox="0 0 512 512" fill="currentColor">
                                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3L272.9 256 47 0zm421.7 205.1l-65.7-37.7L339 231.7l129.7 129.7c18.8-10.5 31.3-30.8 31.3-54 0-23.3-12.6-43.7-31.3-54.1zm-143.4 121.3l-123.6 123.6L385.4 350l-60.1-23.6z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-0.5">{t('app.availableOn')}</p>
                                    <p className="text-base leading-none">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        className="flex-1 relative"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-500/20 rounded-full blur-[80px] z-0" />

                        {/* Mock Phone Realistic */}
                        <div className="relative w-72 h-[580px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 mx-auto shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden z-10">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center">
                                <div className="w-12 h-1 bg-slate-900 rounded-full mb-1"></div>
                            </div>

                            {/* Screen Content - IA Generated Image */}
                            <div className="w-full h-full relative">
                                <Image
                                    src="/img/app-preview.png"
                                    alt="App Screenshot"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Floating elements - Adjusted Positions */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 -right-4 lg:-right-10 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-20 hidden sm:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/60 font-medium">{t('app.ticketValidated')}</p>
                                    <p className="text-sm font-bold text-white">Paris → Dakar</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-20 -left-4 lg:-left-10 p-5 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20 hidden sm:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                                    <Star className="w-6 h-6 text-white shrink-0" />
                                </div>
                                <p className="text-sm font-bold text-white leading-tight whitespace-pre-line">{t('app.realTime')}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
