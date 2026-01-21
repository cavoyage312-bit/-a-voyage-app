'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';

export default function SignupPage() {
    const t = useTranslations('auth');
    const params = useParams();
    const locale = params.locale as string;

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle signup
        console.log('Signup:', formData);
    };

    const benefits = [
        'Réservation rapide et sécurisée',
        'Suivi de vos voyages',
        'Offres exclusives membres',
        'Support prioritaire 24/7',
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop"
                    alt="Travel destination"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-primary-900/80 to-primary-700/60" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-white max-w-md">
                        <h2 className="text-4xl font-bold font-display mb-6">
                            Rejoignez Ça Voyage
                        </h2>
                        <p className="text-xl text-white/80 mb-8">
                            Créez votre compte et profitez de tous les avantages
                        </p>
                        <ul className="space-y-4">
                            {benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="text-white/90">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">
                            {t('signup')}
                        </h1>
                        <p className="text-slate-500">
                            Créez votre compte gratuitement
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Jean"
                                    value={formData.firstName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, firstName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Dupont"
                                    value={formData.lastName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, lastName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t('email')}
                            </label>
                            <div className="input-group">
                                <Mail className="input-icon w-5 h-5" />
                                <input
                                    type="email"
                                    className="input input-with-icon"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t('password')}
                            </label>
                            <div className="input-group">
                                <Lock className="input-icon w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input input-with-icon pr-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {t('confirmPassword')}
                            </label>
                            <div className="input-group">
                                <Lock className="input-icon w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input input-with-icon"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                className="rounded border-slate-300 mt-1"
                                checked={formData.acceptTerms}
                                onChange={(e) =>
                                    setFormData({ ...formData, acceptTerms: e.target.checked })
                                }
                                required
                            />
                            <span className="text-sm text-slate-600">
                                J'accepte les{' '}
                                <Link
                                    href={`/${locale}/terms`}
                                    className="text-primary-700 hover:underline"
                                >
                                    conditions d'utilisation
                                </Link>{' '}
                                et la{' '}
                                <Link
                                    href={`/${locale}/privacy`}
                                    className="text-primary-700 hover:underline"
                                >
                                    politique de confidentialité
                                </Link>
                            </span>
                        </label>

                        <button type="submit" className="btn btn-primary btn-lg w-full">
                            Créer mon compte
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500">
                                    {t('orContinueWith')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button className="btn btn-outline py-3 w-full">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                            <button className="btn btn-outline py-3 w-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-slate-600">
                        {t('hasAccount')}{' '}
                        <Link
                            href={`/${locale}/auth/login`}
                            className="text-primary-700 hover:text-primary-800 font-semibold"
                        >
                            {t('login')}
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
