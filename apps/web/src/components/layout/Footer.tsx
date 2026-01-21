'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ChevronRight
} from 'lucide-react';

export function Footer() {
    const t = useTranslations('footer');
    const params = useParams();
    const locale = params.locale as string;

    const services = [
        { label: 'Vols', href: `/${locale}/flights` },
        { label: 'Hôtels', href: `/${locale}/hotels` },
        { label: 'Bus', href: `/${locale}/buses` },
        { label: 'Location voitures', href: `/${locale}/cars` },
    ];

    const company = [
        { label: t('about'), href: `/${locale}/about` },
        { label: t('contact'), href: `/${locale}/contact` },
        { label: 'Partenaires', href: `/${locale}/partners` },
        { label: 'Carrières', href: `/${locale}/careers` },
    ];

    const support = [
        { label: t('help'), href: `/${locale}/help` },
        { label: 'FAQ', href: `/${locale}/faq` },
        { label: t('terms'), href: `/${locale}/terms` },
        { label: t('privacy'), href: `/${locale}/privacy` },
    ];

    const socials = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Youtube, href: '#', label: 'Youtube' },
    ];

    return (
        <footer className="bg-slate-900 text-white">
            {/* Main Footer */}
            <div className="container-custom py-10 sm:py-12 lg:py-16">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-2">
                        <Link href={`/${locale}`} className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white">
                                <Image
                                    src="/logo.png"
                                    alt="Ça Voyage"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <div>
                                <span className="text-xl font-bold font-display">Ça Voyage</span>
                                <p className="text-xs text-slate-400">Voyagez ensemble, simplement.</p>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs">
                            Votre partenaire de voyage pour l'Afrique et l'Europe.
                            Réservez vols, hôtels, bus et voitures en quelques clics.
                        </p>

                        {/* Contact - Mobile friendly */}
                        <div className="space-y-2 text-sm">
                            <a href="mailto:contact@cavoyage.com" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                                contact@cavoyage.com
                            </a>
                            <a href="tel:+33123456789" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                <Phone className="w-4 h-4" />
                                +33 1 23 45 67 89
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
                            Services
                        </h4>
                        <ul className="space-y-2.5">
                            {services.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
                            Entreprise
                        </h4>
                        <ul className="space-y-2.5">
                            {company.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
                            Support
                        </h4>
                        <ul className="space-y-2.5">
                            {support.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                                    >
                                        <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-slate-500 text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
                            {t('copyright')}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 order-1 sm:order-2">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center 
                           text-slate-400 hover:bg-primary-600 hover:text-white transition-all"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
