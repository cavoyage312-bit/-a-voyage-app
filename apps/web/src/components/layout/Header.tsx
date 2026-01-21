'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown, User, Check, Briefcase, Sparkles, Settings } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { locales, localeNames, localeFlags, Locale } from '@/routing';

export function Header() {
    const t = useTranslations('nav');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;

    const navItems = [
        { href: `/${locale}/flights`, label: t('flights'), icon: '✈️' },
        { href: `/${locale}/hotels`, label: t('hotels'), icon: '🏨' },
        { href: `/${locale}/buses`, label: t('buses'), icon: '🚌' },
        { href: `/${locale}/cars`, label: t('cars'), icon: '🚗' },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const switchLocale = (newLocale: Locale) => {
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        window.location.href = newPathname;
    };

    const isActive = (href: string) => pathname.startsWith(href);

    return (
        <header className="sticky top-0 z-50 header-gradient shadow-xl">
            <div className="container-custom">
                <nav className="flex items-center justify-between h-20 lg:h-24">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center gap-4 group">
                        <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl overflow-hidden bg-white shadow-lg transition-transform group-hover:scale-105">
                            <Image src="/logo.png" alt="Ça Voyage" fill className="object-contain p-1" priority />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xl lg:text-2xl font-bold font-display text-white tracking-tight leading-tight">Ça Voyage</span>
                            <span className="text-xs lg:text-sm text-white/70 leading-tight">Voyagez ensemble, simplement.</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-2xl px-3 py-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${isActive(item.href) ? 'bg-white text-primary-700 shadow-lg' : 'text-white hover:text-white hover:bg-white/20'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Devenir Partenaire - AMÉLIORED */}
                        <Link
                            href={`/${locale}/partner/register`}
                            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm overflow-hidden transition-all
                         bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg 
                         hover:shadow-accent-500/40 hover:shadow-xl hover:scale-105"
                        >
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span>Devenir Partenaire</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        {/* Language Switcher */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/15 transition-all text-sm font-medium"
                            >
                                <span className="text-lg">{localeFlags[locale]}</span>
                                <span className="uppercase font-semibold">{locale}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-down z-50">
                                    {locales.map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => { switchLocale(loc); setIsLangOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${locale === loc ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
                                                }`}
                                        >
                                            <span className="text-xl">{localeFlags[loc]}</span>
                                            <span className="font-medium flex-1">{localeNames[loc]}</span>
                                            {locale === loc && <Check className="w-4 h-4 text-primary-700" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-px h-8 bg-white/25" />

                        {/* Admin Dashboard */}
                        <Link
                            href={`/${locale}/admin`}
                            className="bg-white/15 hover:bg-white/25 text-white p-2.5 rounded-xl transition-all shadow-lg border border-white/20"
                            title="Administration"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>

                        <div className="w-px h-8 bg-white/25" />

                        {/* Auth */}
                        <Link href={`/${locale}/auth/login`} className="px-4 py-2.5 rounded-xl text-white hover:bg-white/15 transition-all text-sm font-semibold">
                            {t('login')}
                        </Link>
                        <Link href={`/${locale}/auth/signup`} className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-xl font-bold text-sm hover:bg-white/95 hover:shadow-xl transition-all shadow-lg">
                            <User className="w-4 h-4" />
                            {t('signup')}
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <button className="lg:hidden p-3 rounded-xl hover:bg-white/15 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden py-6 border-t border-white/15 animate-slide-down">
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl text-center transition-all ${isActive(item.href) ? 'bg-white text-primary-700 shadow-lg' : 'text-white/90 hover:bg-white/15'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-sm font-semibold">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Devenir Partenaire - Mobile */}
                        <Link
                            href={`/${locale}/partner/register`}
                            className="w-full flex items-center justify-center gap-2 py-3.5 mb-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold shadow-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Sparkles className="w-5 h-5" />
                            Devenir Partenaire
                        </Link>

                        <div className="flex gap-3 pt-4 border-t border-white/15">
                            <Link href={`/${locale}/auth/login`} className="flex-1 py-3 border-2 border-white/40 text-white hover:bg-white/15 rounded-xl text-center font-semibold text-base" onClick={() => setIsMenuOpen(false)}>
                                {t('login')}
                            </Link>
                            <Link href={`/${locale}/auth/signup`} className="flex-1 py-3 bg-white text-primary-700 hover:bg-white/95 rounded-xl text-center font-bold text-base shadow-lg" onClick={() => setIsMenuOpen(false)}>
                                {t('signup')}
                            </Link>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/15">
                            <p className="text-white/60 text-sm mb-3 text-center">Langue / Language</p>
                            <div className="grid grid-cols-5 gap-2">
                                {locales.map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => { switchLocale(loc); setIsMenuOpen(false); }}
                                        className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${locale === loc ? 'bg-white text-primary-700' : 'text-white/80 hover:bg-white/15'
                                            }`}
                                    >
                                        <span className="text-xl">{localeFlags[loc]}</span>
                                        <span className="text-xs font-medium uppercase">{loc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
