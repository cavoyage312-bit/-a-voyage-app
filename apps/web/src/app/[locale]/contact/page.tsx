'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    Clock,
    Check,
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const params = useParams();
    const locale = params.locale as string;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'contact@cavoyage.com',
            href: 'mailto:contact@cavoyage.com',
        },
        {
            icon: Phone,
            label: 'Téléphone',
            value: '+33 1 23 45 67 89',
            href: 'tel:+33123456789',
        },
        {
            icon: MapPin,
            label: 'Adresse',
            value: '123 Avenue des Voyages, 75001 Paris',
            href: '#',
        },
        {
            icon: Clock,
            label: 'Horaires',
            value: 'Lun-Ven 9h-18h, Sam 10h-14h',
            href: '#',
        },
    ];

    const faqs = [
        {
            question: 'Comment modifier ma réservation ?',
            answer: 'Connectez-vous à votre compte et accédez à "Mes réservations".',
        },
        {
            question: 'Quels modes de paiement acceptez-vous ?',
            answer: 'Carte bancaire, PayPal, Orange Money, Wave et MTN Money.',
        },
        {
            question: 'Puis-je annuler ma réservation ?',
            answer: 'Oui, selon les conditions du prestataire. Consultez votre confirmation.',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="header-gradient py-12 sm:py-16">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
                            Contactez-nous
                        </h1>
                        <p className="text-white/80">
                            Notre équipe est là pour vous aider
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-8 sm:py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 mb-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">
                                Nos coordonnées
                            </h2>
                            <div className="space-y-4">
                                {contactInfo.map((info, i) => (
                                    <a
                                        key={i}
                                        href={info.href}
                                        className="flex items-start gap-3 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <info.icon className="w-5 h-5 text-primary-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">{info.label}</p>
                                            <p className="font-medium text-slate-900">{info.value}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">
                                Questions fréquentes
                            </h2>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i}>
                                        <p className="font-medium text-slate-900 text-sm">{faq.question}</p>
                                        <p className="text-sm text-slate-500 mt-1">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href={`/${locale}/faq`}
                                className="btn btn-outline w-full mt-4"
                            >
                                Voir toutes les FAQ
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-6 sm:p-8">
                            {!submitted ? (
                                <>
                                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                                        Envoyez-nous un message
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Nom complet *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Jean Dupont"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, name: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    className="input"
                                                    placeholder="jean@email.com"
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
                                                Sujet *
                                            </label>
                                            <select
                                                className="input"
                                                value={formData.subject}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, subject: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">Sélectionnez un sujet</option>
                                                <option value="booking">Question sur une réservation</option>
                                                <option value="refund">Demande de remboursement</option>
                                                <option value="technical">Problème technique</option>
                                                <option value="partnership">Partenariat</option>
                                                <option value="other">Autre</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Message *
                                            </label>
                                            <textarea
                                                className="input min-h-[150px]"
                                                placeholder="Comment pouvons-nous vous aider ?"
                                                value={formData.message}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, message: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-lg w-full">
                                            <Send className="w-5 h-5" />
                                            Envoyer le message
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-10 h-10 text-primary-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        Message envoyé !
                                    </h2>
                                    <p className="text-slate-500 mb-6">
                                        Merci {formData.name}. Notre équipe vous répondra sous 24h.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSubmitted(false);
                                            setFormData({ name: '', email: '', subject: '', message: '' });
                                        }}
                                        className="btn btn-outline"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
