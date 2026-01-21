'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
    const params = useParams();
    const locale = params.locale as string;

    const sections = [
        {
            title: 'Acceptation des conditions',
            content: `En accédant et en utilisant le site ÇA VOYAGE (ci-après "le Site"), vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.`,
        },
        {
            title: 'Description des services',
            content: `ÇA VOYAGE est une plateforme de réservation de voyages permettant aux utilisateurs de rechercher et réserver des vols, hôtels, bus et voitures de location. Nous agissons en tant qu'intermédiaire entre vous et les prestataires de services de voyage.`,
        },
        {
            title: 'Inscription et compte',
            content: `Pour effectuer une réservation, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte.`,
        },
        {
            title: 'Réservations et paiements',
            content: `Toutes les réservations sont soumises à disponibilité et confirmation par le prestataire de services. Les prix affichés incluent les taxes applicables sauf indication contraire. Le paiement est sécurisé et traité par nos partenaires de paiement certifiés.`,
        },
        {
            title: 'Annulations et remboursements',
            content: `Les conditions d'annulation varient selon le type de réservation et le prestataire. Veuillez consulter les conditions spécifiques lors de votre réservation. Les remboursements seront traités selon les politiques du prestataire concerné.`,
        },
        {
            title: 'Responsabilité',
            content: `ÇA VOYAGE agit en tant qu'intermédiaire et ne peut être tenu responsable des services fournis par les prestataires tiers. Nous nous efforçons de fournir des informations exactes mais ne garantissons pas l'exhaustivité des informations affichées.`,
        },
        {
            title: 'Propriété intellectuelle',
            content: `Tout le contenu du Site (textes, images, logos, design) est protégé par les droits d'auteur et appartient à ÇA VOYAGE ou à ses partenaires. Toute reproduction non autorisée est interdite.`,
        },
        {
            title: 'Modification des conditions',
            content: `Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur le Site. Il est de votre responsabilité de consulter régulièrement ces conditions.`,
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
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
                            Conditions Générales d'Utilisation
                        </h1>
                        <p className="text-white/80">
                            Dernière mise à jour : Janvier 2024
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-8 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Table of contents */}
                    <div className="card p-6 mb-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Sommaire</h2>
                        <nav className="space-y-2">
                            {sections.map((section, i) => (
                                <a
                                    key={i}
                                    href={`#section-${i}`}
                                    className="flex items-center gap-2 text-primary-700 hover:text-primary-800 text-sm"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="card p-6 sm:p-8">
                        {sections.map((section, i) => (
                            <motion.section
                                key={i}
                                id={`section-${i}`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="mb-8 last:mb-0"
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-3">
                                    {i + 1}. {section.title}
                                </h2>
                                <p className="text-slate-600 leading-relaxed">{section.content}</p>
                            </motion.section>
                        ))}

                        <hr className="my-8" />

                        <div className="text-center">
                            <p className="text-slate-500 text-sm mb-4">
                                Pour toute question concernant ces conditions, contactez-nous.
                            </p>
                            <Link href={`/${locale}/contact`} className="btn btn-outline">
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
