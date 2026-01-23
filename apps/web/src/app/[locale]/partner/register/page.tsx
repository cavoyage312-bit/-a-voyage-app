'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Building2,
    Bus,
    Car,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Check,
    ChevronRight,
    Shield,
    TrendingUp,
    Users,
    CreditCard,
    Home,
} from 'lucide-react';
import Image from 'next/image';

export default function PartnerRegisterPage() {
    const params = useParams();
    const locale = params.locale as string;

    const [step, setStep] = useState(1);
    const [partnerType, setPartnerType] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        website: '',
        description: '',
        acceptTerms: false,
    });
    const [submitted, setSubmitted] = useState(false);

    const partnerTypes = [
        {
            id: 'hotel',
            icon: Building2,
            title: 'Hôtel / Hébergement',
            description: 'Hôtels, auberges, résidences, appartements',
            features: ['Gestion des chambres', 'Calendrier disponibilités', 'Avis clients'],
        },
        {
            id: 'apartment',
            icon: Home, // You'll need to import Home from lucide-react if not already
            title: 'Propriétaire d\'Appartement',
            description: 'Louez votre appartement ou maison',
            features: ['Gestion des annonces', 'Messagerie directe', 'Revenus sécurisés'],
        },
        {
            id: 'bus',
            icon: Bus,
            title: 'Transport Bus',
            description: 'Compagnies de bus, gares routières',
            features: ['Gestion des trajets', 'Réservation sièges', 'Horaires dynamiques'],
        },
        {
            id: 'car',
            icon: Car,
            title: 'Location Voiture',
            description: 'Agences de location, loueurs indépendants',
            features: ['Gestion du parc', 'Tarification flexible', 'Contrats numériques'],
        },
    ];

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Augmentez vos revenus',
            description: 'Accédez à des milliers de voyageurs chaque jour',
        },
        {
            icon: Users,
            title: 'Gérez facilement',
            description: 'Dashboard intuitif pour gérer vos réservations',
        },
        {
            icon: CreditCard,
            title: 'Paiements sécurisés',
            description: 'Recevez vos paiements rapidement et en toute sécurité',
        },
        {
            icon: Shield,
            title: 'Support dédié',
            description: 'Une équipe partenaire à votre écoute 7j/7',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && partnerType) {
            setStep(2);
        } else if (step === 2) {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card p-8 sm:p-12 text-center max-w-lg"
                >
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-primary-700" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                        Demande envoyée !
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Merci pour votre intérêt ! Notre équipe partenariats examinera votre demande
                        et vous contactera sous 48h ouvrées.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-slate-500 mb-1">Email de confirmation envoyé à</p>
                        <p className="font-semibold text-slate-900">{formData.email}</p>
                    </div>
                    <Link href={`/${locale}`} className="btn btn-primary btn-lg">
                        Retour à l'accueil
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="relative py-16 sm:py-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop"
                        alt="Business"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-700/80" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                                <Building2 className="w-4 h-4" />
                                Espace Partenaires
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-4">
                                Développez votre activité avec ÇA VOYAGE
                            </h1>
                            <p className="text-lg sm:text-xl text-white/90 mb-8">
                                Rejoignez notre réseau de partenaires et touchez des milliers de voyageurs
                                en Afrique et en Europe.
                            </p>

                            {/* Benefits */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                                    >
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white text-sm">{benefit.title}</h3>
                                            <p className="text-white/70 text-xs">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="container-custom py-12 sm:py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Progress */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-700' : 'text-slate-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary-700 text-white' : 'bg-slate-200'
                                }`}>
                                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                            </div>
                            <span className="font-medium text-sm hidden sm:inline">Type de partenariat</span>
                        </div>
                        <div className="w-8 h-px bg-slate-300" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-700' : 'text-slate-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary-700 text-white' : 'bg-slate-200'
                                }`}>
                                2
                            </div>
                            <span className="font-medium text-sm hidden sm:inline">Informations</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                                    Quel type de partenaire êtes-vous ?
                                </h2>
                                <p className="text-slate-500 text-center mb-8">
                                    Sélectionnez la catégorie qui correspond à votre activité
                                </p>

                                <div className="grid gap-4">
                                    {partnerTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setPartnerType(type.id)}
                                            className={`card p-6 text-left transition-all ${partnerType === type.id
                                                ? 'ring-2 ring-primary-700 bg-primary-50'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${partnerType === type.id ? 'bg-primary-700 text-white' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    <type.icon className="w-7 h-7" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-slate-900">{type.title}</h3>
                                                    <p className="text-slate-500 text-sm mb-3">{type.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {type.features.map((feature, i) => (
                                                            <span key={i} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                                                                <Check className="w-3 h-3 text-primary-600" />
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${partnerType === type.id ? 'border-primary-700 bg-primary-700' : 'border-slate-300'
                                                    }`}>
                                                    {partnerType === type.id && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!partnerType}
                                    className="btn btn-primary btn-lg w-full mt-8"
                                >
                                    Continuer
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-primary-700 text-sm font-medium mb-6 flex items-center gap-1 hover:underline"
                                >
                                    ← Retour
                                </button>

                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    Informations de votre établissement
                                </h2>

                                <div className="card p-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nom de l'établissement *
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Ex: Hôtel Terrou-Bi"
                                                value={formData.businessName}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nom du contact *
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Jean Dupont"
                                                value={formData.contactName}
                                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Email professionnel *
                                            </label>
                                            <input
                                                type="email"
                                                className="input"
                                                placeholder="contact@hotel.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Téléphone *
                                            </label>
                                            <input
                                                type="tel"
                                                className="input"
                                                placeholder="+221 77 000 00 00"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Site web (optionnel)
                                            </label>
                                            <input
                                                type="url"
                                                className="input"
                                                placeholder="https://www.hotel.com"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Ville *
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Dakar"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Pays *
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Sénégal"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Adresse complète *
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Route de la Corniche, Almadies"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Description de votre établissement
                                            </label>
                                            <textarea
                                                className="input min-h-[100px]"
                                                placeholder="Présentez brièvement votre établissement..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-primary-700 rounded mt-0.5"
                                                checked={formData.acceptTerms}
                                                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                                required
                                            />
                                            <span className="text-sm text-slate-600">
                                                J'accepte les{' '}
                                                <Link href={`/${locale}/terms`} className="text-primary-700 hover:underline">
                                                    conditions générales
                                                </Link>
                                                {' '}et la{' '}
                                                <Link href={`/${locale}/privacy`} className="text-primary-700 hover:underline">
                                                    politique de confidentialité
                                                </Link>
                                                {' '}de ÇA VOYAGE.
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!formData.acceptTerms}
                                    className="btn btn-primary btn-lg w-full mt-6"
                                >
                                    Envoyer ma demande
                                </button>
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
