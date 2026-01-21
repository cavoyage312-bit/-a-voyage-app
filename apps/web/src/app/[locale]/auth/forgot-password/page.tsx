'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
    const params = useParams();
    const locale = params.locale as string;

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <Link
                        href={`/${locale}/auth/login`}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la connexion
                    </Link>

                    {!submitted ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">
                                    Mot de passe oublié ?
                                </h1>
                                <p className="text-slate-500">
                                    Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Adresse email
                                    </label>
                                    <div className="input-group">
                                        <Mail className="input-icon w-5 h-5" />
                                        <input
                                            type="email"
                                            className="input input-with-icon"
                                            placeholder="votre@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg w-full">
                                    Envoyer le lien de réinitialisation
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-primary-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Email envoyé !
                            </h2>
                            <p className="text-slate-500 mb-6">
                                Nous avons envoyé un lien de réinitialisation à{' '}
                                <span className="font-semibold text-slate-700">{email}</span>
                            </p>
                            <p className="text-sm text-slate-400 mb-6">
                                Vous n'avez pas reçu l'email ? Vérifiez vos spams ou{' '}
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-primary-700 hover:underline"
                                >
                                    réessayez
                                </button>
                            </p>
                            <Link
                                href={`/${locale}/auth/login`}
                                className="btn btn-outline w-full"
                            >
                                Retour à la connexion
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop"
                    alt="Travel destination"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/60" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold font-display mb-4">
                            Pas de panique !
                        </h2>
                        <p className="text-xl text-white/80 max-w-md">
                            Nous allons vous aider à récupérer l'accès à votre compte
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
