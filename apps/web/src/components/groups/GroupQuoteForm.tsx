'use client';

import { useState } from 'react';
import {
    Plane,
    Bus,
    Building2,
    Calendar,
    Users,
    MapPin,
    Send,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TravelType = 'flight' | 'road' | 'combined';

export function GroupQuoteForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        travelType: 'flight' as TravelType,
        origin: '',
        destination: '',
        date: '',
        passengers: 10,
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        message: ''
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/groups/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Failed to submit quote:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Demande envoyée !</h3>
                <p className="text-slate-500 mb-8">
                    Merci {formData.contactName}. Un expert de ÇA VOYAGE vous contactera par email sous 24h.
                </p>
                <button
                    onClick={() => { setStep(1); setSubmitted(false); }}
                    className="btn btn-outline"
                >
                    Faire une autre demande
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary-600' : 'bg-slate-100'
                            }`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <h4 className="text-lg font-bold text-slate-900 mb-4">Quel type de voyage organisez-vous ?</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { id: 'flight', icon: Plane, label: 'Vol de Groupe' },
                                { id: 'road', icon: Bus, label: 'Route (Bus)' },
                                { id: 'combined', icon: Building2, label: 'Séminaire' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, travelType: type.id as TravelType })}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.travelType === type.id
                                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                        }`}
                                >
                                    <type.icon className="w-6 h-6" />
                                    <span className="text-sm font-semibold">{type.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={nextStep}
                                className="btn btn-primary w-full py-4 rounded-xl"
                            >
                                Continuer <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-bold text-slate-900 mb-4">Détails de l'itinéraire</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Départ</label>
                                <div className="input-group">
                                    <MapPin className="input-icon" />
                                    <input
                                        type="text"
                                        className="input input-with-icon"
                                        placeholder="Ville de départ"
                                        value={formData.origin}
                                        onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Arrivée</label>
                                <div className="input-group">
                                    <MapPin className="input-icon" />
                                    <input
                                        type="text"
                                        className="input input-with-icon"
                                        placeholder="Ville d'arrivée"
                                        value={formData.destination}
                                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Date souhaitée</label>
                                <div className="input-group">
                                    <Calendar className="input-icon" />
                                    <input
                                        type="date"
                                        className="input input-with-icon"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Taille du groupe (est.)</label>
                                <div className="input-group">
                                    <Users className="input-icon" />
                                    <input
                                        type="number"
                                        min="10"
                                        className="input input-with-icon"
                                        value={formData.passengers}
                                        onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400">À partir de 10 personnes minimum</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={prevStep} className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 flex-1 py-4">
                                <ChevronLeft className="w-5 h-5 mr-2" /> Retour
                            </button>
                            <button type="button" onClick={nextStep} className="btn btn-primary flex-[2] py-4">
                                Continuer <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-bold text-slate-900 mb-4">Vos coordonnées</h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Entreprise / Organisation</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ex: Tech Africa Corp"
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Nom du contact</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Votre nom"
                                        value={formData.contactName}
                                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email professionnel</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="email@compagnie.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Message / Besoins spécifiques</label>
                                <textarea
                                    className="input min-h-[100px] py-3"
                                    placeholder="Précisez ici vos attentes (besoins Wi-Fi, repas, hôtel...)"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={prevStep} className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 flex-1 py-4">
                                <ChevronLeft className="w-5 h-5 mr-2" /> Retour
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex-[2] py-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Envoi...
                                    </>
                                ) : (
                                    <>
                                        Envoyer ma demande <Send className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}
