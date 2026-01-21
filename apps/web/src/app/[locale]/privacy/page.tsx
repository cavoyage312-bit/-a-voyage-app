'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
    const params = useParams();
    const locale = params.locale as string;

    const sections = [
        {
            title: 'Collecte des données',
            content: `Nous collectons les informations que vous nous fournissez lors de la création de compte, des réservations et de l'utilisation de nos services. Cela inclut : nom, prénom, adresse email, numéro de téléphone, informations de paiement et préférences de voyage.`,
        },
        {
            title: 'Utilisation des données',
            content: `Vos données personnelles sont utilisées pour : traiter vos réservations, vous envoyer des confirmations et mises à jour, personnaliser votre expérience, améliorer nos services et, avec votre consentement, vous envoyer des offres promotionnelles.`,
        },
        {
            title: 'Partage des données',
            content: `Nous partageons vos données uniquement avec : les prestataires de services de voyage pour finaliser vos réservations, nos partenaires de paiement pour traiter les transactions, et les autorités compétentes si la loi l'exige.`,
        },
        {
            title: 'Sécurité des données',
            content: `Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l'accès non autorisé, la perte ou l'altération. Nos systèmes sont cryptés et régulièrement audités.`,
        },
        {
            title: 'Cookies et technologies similaires',
            content: `Nous utilisons des cookies pour améliorer votre navigation, mémoriser vos préférences et analyser l'utilisation du site. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.`,
        },
        {
            title: 'Vos droits',
            content: `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez également vous opposer au traitement de vos données à des fins de marketing.`,
        },
        {
            title: 'Conservation des données',
            content: `Nous conservons vos données personnelles pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et conformément aux obligations légales applicables.`,
        },
        {
            title: 'Contact',
            content: `Pour exercer vos droits ou pour toute question relative à cette politique, vous pouvez nous contacter par email à privacy@cavoyage.com ou par courrier à notre adresse postale.`,
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
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-white/80">
                            Dernière mise à jour : Janvier 2024
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-8 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Intro */}
                    <div className="card p-6 mb-8">
                        <p className="text-slate-600 leading-relaxed">
                            Chez ÇA VOYAGE, nous accordons une grande importance à la protection de votre vie privée.
                            Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons
                            vos données personnelles lorsque vous utilisez notre plateforme.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="card p-6 sm:p-8">
                        {sections.map((section, i) => (
                            <motion.section
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="mb-8 last:mb-0"
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-bold text-sm">
                                        {i + 1}
                                    </span>
                                    {section.title}
                                </h2>
                                <p className="text-slate-600 leading-relaxed ml-10">{section.content}</p>
                            </motion.section>
                        ))}

                        <hr className="my-8" />

                        <div className="text-center">
                            <p className="text-slate-500 text-sm mb-4">
                                Des questions sur vos données personnelles ?
                            </p>
                            <Link href={`/${locale}/contact`} className="btn btn-primary">
                                Contactez notre DPO
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
