'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown, User, Users, Check, Briefcase, Sparkles, Settings, Plane, Hotel, Bus, Car, Building2 } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { locales, localeNames, localeFlags, Locale } from '@/routing';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function Header() {
    const t = useTranslations('nav');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as Locale;
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profile);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) {
                setProfile(null);
            } else {
                getUser();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const navItems = [
        { href: `/${locale}/flights`, label: t('flights'), icon: <Plane className="w-5 h-5" /> },
        { href: `/${locale}/hotels`, label: t('hotels'), icon: <Hotel className="w-5 h-5" /> },
        { href: `/${locale}/buses`, label: t('buses'), icon: <Bus className="w-5 h-5" /> },
        { href: `/${locale}/cars`, label: t('cars'), icon: <Car className="w-5 h-5" /> },
        { href: `/${locale}/apartments`, label: t('apartments'), icon: <Building2 className="w-5 h-5" /> },
        { href: `/${locale}/groups`, label: t('groups'), icon: <Users className="w-5 h-5" /> },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push(`/${locale}`);
        router.refresh();
    };

    const switchLocale = (newLocale: Locale) => {
        const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
        window.location.href = newPathname;
    };

    const isActive = (href: string) => pathname.startsWith(href);

    return (
        <header className="sticky top-0 z-50 w-full bg-primary-800/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all duration-300">
            <div className="container-custom">
                <nav className="flex items-center justify-between h-20 lg:h-24 gap-4">
                    {/* Logo Section */}
                    <Link href={`/${locale}`} className="flex items-center gap-3 lg:gap-4 group flex-shrink-0 transition-transform active:scale-95">
                        <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,12%)] transition-all duration-500 group-hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] group-hover:rotate-3 flex-shrink-0">
                            <Image src="/logo.png" alt="Ça Voyage" fill className="object-contain p-1.5" priority />
                        </div>
                        <div className="hidden sm:flex flex-col whitespace-nowrap">
                            <h1 className="text-xl lg:text-2xl font-black font-display text-white tracking-tighter leading-tight group-hover:text-teal-300 transition-colors">
                                Ça Voyage
                            </h1>
                            <p className="text-[10px] lg:text-sm font-medium text-white/60 leading-tight tracking-wide uppercase">
                                Voyagez ensemble, simplement.
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Premium Glassmorphism */}
                    <div className="flex-1 hidden lg:flex justify-center px-4">
                        <div className="flex items-center gap-1 xl:gap-2 bg-black/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/5">
                            {navItems.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative flex items-center gap-3 px-5 xl:px-8 py-2.5 xl:py-3 rounded-xl text-sm xl:text-base font-bold transition-all duration-300 whitespace-nowrap group/nav ${active ? 'bg-white text-primary-800 shadow-xl scale-[1.02]' : 'text-white/90 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span className={`transition-transform duration-300 group-hover/nav:scale-110 ${active ? 'scale-105' : 'opacity-70 group-hover/nav:opacity-100'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="relative z-10">{item.label}</span>
                                        {!active && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/nav:translate-x-full transition-transform duration-1000" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-3 xl:gap-6 flex-shrink-0">
                        {/* Language & Utility Group */}
                        <div className="flex items-center gap-2 xl:gap-3">
                            {/* Language Switcher */}
                            <div className="relative hidden sm:block" ref={langRef}>
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/15 transition-all text-sm font-black border border-white/5 hover:border-white/10"
                                >
                                    <span className="text-lg filter saturate-150">{localeFlags[locale]}</span>
                                    <span className="uppercase tracking-widest">{locale}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isLangOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden animate-scale-in z-[60]">
                                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1">Choisir Langue</p>
                                        </div>
                                        <div className="py-1">
                                            {locales.map((loc) => (
                                                <button
                                                    key={loc}
                                                    onClick={() => { switchLocale(loc); setIsLangOpen(false); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${locale === loc ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:pl-6'
                                                        }`}
                                                >
                                                    <span className="text-xl filter saturate-150">{localeFlags[loc]}</span>
                                                    <span className="flex-1">{localeNames[loc]}</span>
                                                    {locale === loc && (
                                                        <div className="w-2 h-2 rounded-full bg-primary-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Auth Group */}
                            <div className="hidden md:flex items-center gap-3 xl:gap-4 ml-2">
                                {user ? (
                                    <div className="relative" ref={profileRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-1.5 pr-4 rounded-2xl border border-white/10 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-primary-900 font-black shadow-lg">
                                                {profile?.first_name?.[0]}{profile?.last_name?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div className="text-left hidden xl:block">
                                                <p className="text-xs font-black text-white leading-none mb-1">{profile?.first_name || 'Utilisateur'}</p>
                                                <p className="text-[10px] text-white/50 leading-none">Compte {profile?.role || 'Basic'}</p>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-2"
                                                >
                                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                                        <p className="text-sm font-bold text-slate-900">{profile?.first_name} {profile?.last_name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                    </div>

                                                    {profile?.role === 'admin' && (
                                                        <Link href={`/${locale}/admin`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                                            <Settings className="w-4 h-4 text-slate-400" />
                                                            Administration
                                                        </Link>
                                                    )}

                                                    {(profile?.role === 'partner' || profile?.role === 'admin') && (
                                                        <Link href={`/${locale}/partner`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                                            <Briefcase className="w-4 h-4 text-slate-400" />
                                                            Espace Partenaire
                                                        </Link>
                                                    )}

                                                    <Link href={`/${locale}/profile`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        Mon Profil
                                                    </Link>

                                                    <div className="h-px bg-slate-50 my-1" />

                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Déconnexion
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href={`/${locale}/auth/login`}
                                            className="px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:text-teal-300 transition-colors whitespace-nowrap"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href={`/${locale}/auth/signup`}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-500 text-primary-900 rounded-xl font-black text-sm hover:from-teal-300 hover:to-emerald-400 hover:shadow-[0_10px_25px_rgba(20,184,166,0.4)] active:scale-95 transition-all shadow-lg whitespace-nowrap"
                                        >
                                            <User className="w-4 h-4" />
                                            {t('signup')}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all active:scale-90 border border-white/10"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu - Premium Design */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scaleY: 0.9, originY: 0 }}
                            animate={{ opacity: 1, scaleY: 1, originY: 0 }}
                            exit={{ opacity: 0, scaleY: 0.9, originY: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden border-t border-white/10 bg-primary-900/95 backdrop-blur-2xl overflow-hidden shadow-2xl absolute left-0 right-0 z-50 rounded-b-3xl"
                        >
                            <div className="container-custom py-8 flex flex-col gap-8 max-h-[85vh] overflow-y-auto no-scrollbar">
                                <div className="grid grid-cols-2 gap-3">
                                    {navItems.map((item, idx) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`flex flex-col items-center gap-2 p-5 rounded-2xl transition-all ${isActive(item.href)
                                                    ? 'bg-white text-primary-800 shadow-xl scale-[1.02]'
                                                    : 'text-white/80 hover:bg-white/10 active:bg-white/20 border border-white/5'
                                                    }`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span className="text-3xl">{item.icon}</span>
                                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile Auth & Social */}
                                <div className="flex flex-col gap-4">
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                                                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center text-primary-900 font-black text-2xl">
                                                    {profile?.first_name?.[0]}{profile?.last_name?.[0] || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-lg leading-tight">{profile?.first_name} {profile?.last_name}</p>
                                                    <p className="text-white/50 text-sm">{user.email}</p>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/${locale}/profile`}
                                                className="py-5 border-2 border-white/20 text-white hover:bg-white/10 rounded-2xl text-center font-bold text-lg active:scale-95 transition-all"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Mon Profil
                                            </Link>

                                            {profile?.role === 'admin' && (
                                                <Link
                                                    href={`/${locale}/admin`}
                                                    className="py-5 border-2 border-white/20 text-white hover:bg-white/10 rounded-2xl text-center font-bold text-lg active:scale-95 transition-all"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Administration
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                                className="py-5 bg-red-500/10 text-red-500 border-2 border-red-500/20 rounded-2xl text-center font-black text-lg active:scale-95 transition-all"
                                            >
                                                Déconnexion
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={`/${locale}/auth/login`}
                                                className="py-5 border-2 border-white/20 text-white hover:bg-white/10 rounded-2xl text-center font-bold text-lg active:scale-95 transition-all"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {t('login')}
                                            </Link>
                                            <Link
                                                href={`/${locale}/auth/signup`}
                                                className="py-5 bg-gradient-to-r from-teal-400 to-emerald-500 text-primary-900 rounded-2xl text-center font-black text-lg shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {t('signup')}
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Language Selector Mobile */}
                                <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10">
                                    {locales.map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => { switchLocale(loc); setIsMenuOpen(false); }}
                                            className={`flex flex-col items-center gap-1 transition-all ${locale === loc ? 'scale-125 saturate-150' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                                                }`}
                                        >
                                            <span className="text-3xl">{localeFlags[loc]}</span>
                                            <span className="text-[10px] font-black uppercase text-white">{loc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
