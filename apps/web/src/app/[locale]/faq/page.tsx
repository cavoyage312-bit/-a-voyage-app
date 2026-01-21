'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
    const params = useParams();
    const locale = params.locale as string;
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const faqCategories = [
        {
            category: 'Réservations',
            faqs: [
                {
                    question: 'Comment réserver un vol sur ÇA VOYAGE ?',
                    answer: 'Utilisez notre moteur de recherche en indiquant vos dates, destinations et nombre de passagers. Comparez les offres et sélectionnez celle qui vous convient. Remplissez les informations passagers et procédez au paiement sécurisé.',
                },
                {
                    question: 'Puis-je modifier ma réservation après confirmation ?',
                    answer: 'Oui, connectez-vous à votre compte et accédez à "Mes réservations". Les modifications sont soumises aux conditions du prestataire et peuvent entraîner des frais supplémentaires.',
                },
                {
                    question: 'Comment annuler ma réservation ?',
                    answer: 'Rendez-vous dans "Mes réservations", sélectionnez la réservation concernée et cliquez sur "Annuler". Les conditions de remboursement dépendent du prestataire et du type de tarif choisi.',
                },
            ],
        },
        {
            category: 'Paiement',
            faqs: [
                {
                    question: 'Quels modes de paiement acceptez-vous ?',
                    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, et les paiements mobiles (Orange Money, Wave, MTN Money) selon les pays.',
                },
                {
                    question: 'Le paiement est-il sécurisé ?',
                    answer: 'Absolument. Toutes les transactions sont cryptées avec la technologie SSL et traitées par des partenaires certifiés PCI-DSS. Vos données bancaires ne sont jamais stockées sur nos serveurs.',
                },
                {
                    question: 'Quand suis-je débité ?',
                    answer: 'Le débit est effectué immédiatement lors de la confirmation de votre réservation. Pour les locations de voiture, une pré-autorisation peut être effectuée pour la caution.',
                },
            ],
        },
        {
            category: 'Remboursements',
            faqs: [
                {
                    question: 'Comment obtenir un remboursement ?',
                    answer: 'En cas d\'annulation éligible, le remboursement est automatique sous 5 à 14 jours ouvrés. Pour une demande spécifique, contactez notre service client avec votre référence de réservation.',
                },
                {
                    question: 'Que faire si mon vol est annulé par la compagnie ?',
                    answer: 'Vous serez notifié par email. Vous pouvez choisir entre un remboursement intégral ou un report sur un autre vol. Notre équipe vous accompagne dans les démarches.',
                },
            ],
        },
        {
            category: 'Compte',
            faqs: [
                {
                    question: 'Comment créer un compte ?',
                    answer: 'Cliquez sur "S\'inscrire" en haut de page. Renseignez vos informations et validez votre email. Vous pouvez aussi vous inscrire via Google ou Facebook.',
                },
                {
                    question: 'J\'ai oublié mon mot de passe',
                    answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre email et suivez les instructions reçues pour réinitialiser votre mot de passe.',
                },
                {
                    question: 'Comment supprimer mon compte ?',
                    answer: 'Contactez notre service client pour demander la suppression de votre compte. Notez que cette action est irréversible et entraîne la perte de votre historique.',
                },
            ],
        },
    ];

    const filteredCategories = faqCategories.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((cat) => cat.faqs.length > 0);

    let globalIndex = 0;

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
                            <HelpCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
                            Foire aux Questions
                        </h1>
                        <p className="text-white/80">
                            Trouvez rapidement les réponses à vos questions
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-8 sm:py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Search */}
                    <div className="mb-8">
                        <div className="input-group">
                            <Search className="input-icon" />
                            <input
                                type="text"
                                className="input input-with-icon"
                                placeholder="Rechercher une question..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* FAQ List */}
                    {filteredCategories.map((category) => (
                        <div key={category.category} className="mb-8">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">
                                {category.category}
                            </h2>
                            <div className="space-y-3">
                                {category.faqs.map((faq) => {
                                    const index = globalIndex++;
                                    return (
                                        <div key={index} className="card overflow-hidden">
                                            <button
                                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="font-medium text-slate-900 pr-4">
                                                    {faq.question}
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {openIndex === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="px-4 pb-4 text-slate-600">
                                                            {faq.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Aucune question trouvée</p>
                        </div>
                    )}

                    {/* Contact CTA */}
                    <div className="card p-6 text-center bg-primary-50 border-primary-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Vous n'avez pas trouvé votre réponse ?
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Notre équipe est disponible pour vous aider
                        </p>
                        <Link href={`/${locale}/contact`} className="btn btn-primary">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
