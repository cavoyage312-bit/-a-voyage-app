'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Save, RefreshCw, Landmark, Percent, DollarSign, ShieldCheck, Info } from 'lucide-react';

export default function AdminSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [settings, setSettings] = useState({
        flight_margin_fixed: 15,
        flight_margin_percent: 5,
        payment_fee_percent: 2.9
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        setLoading(true);
        const { data, error } = await supabase
            .from('app_settings')
            .select('*')
            .eq('id', 'global')
            .single();

        if (data) {
            setSettings({
                flight_margin_fixed: data.flight_margin_fixed,
                flight_margin_percent: data.flight_margin_percent,
                payment_fee_percent: data.payment_fee_percent
            });
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        setMessage(null);

        const { error } = await supabase
            .from('app_settings')
            .upsert({
                id: 'global',
                ...settings,
                updated_at: new Date().toISOString()
            });

        if (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde : ' + error.message });
        } else {
            setMessage({ type: 'success', text: 'Réglages enregistrés avec succès !' });
        }
        setSaving(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-custom max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Configuration des Marges</h1>
                    <p className="text-slate-500">Gérez vos commissions et frais de plateforme en temps réel.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        <ShieldCheck className="w-5 h-5" />
                        {message.text}
                    </div>
                )}

                <div className="card p-8 space-y-8">
                    {/* Flight Margin Fixed */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Marge Fixe par Billet</h3>
                                <p className="text-xs text-slate-500">Ajouté systématiquement à chaque réservation de vol.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="input-group flex-1">
                                <input
                                    type="number"
                                    className="input pr-12"
                                    value={settings.flight_margin_fixed}
                                    onChange={(e) => setSettings({ ...settings, flight_margin_fixed: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">€</span>
                            </div>
                            <div className="text-sm text-slate-400 font-mono">Commission fixe</div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Flight Margin Percentage */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                                <Percent className="w-5 h-5 text-accent-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Marge en Pourcentage</h3>
                                <p className="text-xs text-slate-500">Pourcentage ajouté sur le prix total du billet.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="input-group flex-1">
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input pr-12"
                                    value={settings.flight_margin_percent}
                                    onChange={(e) => setSettings({ ...settings, flight_margin_percent: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                            </div>
                            <div className="text-sm text-slate-400 font-mono">Commission variable</div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Payment Fees */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Landmark className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Frais de Transaction (Banque/Stripe)</h3>
                                <p className="text-xs text-slate-500">Estimation des frais que la banque vous prélèvera.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="input-group flex-1">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input pr-12"
                                    value={settings.payment_fee_percent}
                                    onChange={(e) => setSettings({ ...settings, payment_fee_percent: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                            </div>
                            <div className="text-sm text-slate-400 font-mono">Coût bancaire estimé</div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl flex gap-4 mt-10">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Info className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-sm text-blue-800 leading-relaxed">
                            <p className="font-bold mb-1">Comment le prix est calculé :</p>
                            Prix Client = (Prix Amadeus + {settings.flight_margin_fixed}€) × {1 + (settings.flight_margin_percent / 100)} × {1 + (settings.payment_fee_percent / 100)}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary w-full btn-lg gap-3"
                    >
                        {saving ? <RefreshCw className="animate-spin" /> : <Save />}
                        {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </div>
        </div>
    );
}
