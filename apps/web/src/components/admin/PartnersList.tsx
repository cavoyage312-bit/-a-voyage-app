'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Building2, User, Mail, Phone, CheckCircle, XCircle, Clock, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function PartnersList() {
    const supabase = createClient();
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedPartner, setSelectedPartner] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Current Admin User:', user);
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                console.log('Current Admin Profile:', profile);
            }
        };
        checkUser();
        fetchPartners();
    }, []);

    async function fetchPartners() {
        setLoading(true);
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setPartners(data);
        setLoading(false);
    }

    async function updateStatus(id: string, status: 'approved' | 'rejected', userId?: string) {
        console.log('Update Status:', { id, status, userId });
        // 1. Mettre à jour le statut dans la table partners
        const { error: partnerError } = await supabase
            .from('partners')
            .update({ status })
            .eq('id', id);

        if (partnerError) {
            console.error('Partner Error:', partnerError);
            alert(`Erreur: ${partnerError.message}`);
            return;
        }

        // 2. Si approuvé et qu'on a un user_id, on change son rôle dans profiles
        if (status === 'approved' && userId) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: 'partner' })
                .eq('id', userId);

            if (profileError) console.error('Profile Error:', profileError);

            if (profileError) {
                console.error('Erreur lors de la mise à jour du rôle:', profileError);
                alert('Partenaire approuvé, mais erreur lors de la mise à jour du rôle utilisateur.');
            }
        }

        fetchPartners();
        setSelectedPartner(null);
    }

    const filteredPartners = partners.filter(p =>
        (p.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.contact_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Demandes Partenaires</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une entreprise..."
                        className="input pl-10 h-10 min-w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card shadow-sm border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Entreprise / Contact</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Date Demande</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic-text-none">
                            {loading ? (
                                [1, 2].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/50" />
                                    </tr>
                                ))
                            ) : filteredPartners.length > 0 ? (
                                filteredPartners.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedPartner(partner)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{partner.company_name}</span>
                                                    <span className="text-xs text-slate-500">{partner.contact_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-blue-50 text-blue-700">
                                                {partner.service_type || 'Activités'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {format(new Date(partner.created_at), 'dd/MM/yyyy', { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${partner.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                partner.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {partner.status === 'approved' ? 'Approuvé' :
                                                    partner.status === 'pending' ? 'En attente' : 'Rejeté'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                {partner.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(partner.id, 'approved', partner.user_id)}
                                                            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="Approuver"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(partner.id, 'rejected')}
                                                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Rejeter"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setSelectedPartner(partner)}
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                                        Aucune demande partenaire pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Détails */}
            {selectedPartner && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900">Détails de la demande</h3>
                            <button onClick={() => setSelectedPartner(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <DetailItem icon={Building2} label="Entreprise" value={selectedPartner.company_name} color="text-orange-600" />
                                <DetailItem icon={User} label="Contact" value={selectedPartner.contact_name} />
                                <DetailItem icon={Mail} label="Email" value={selectedPartner.email} />
                                <DetailItem icon={Phone} label="Téléphone" value={selectedPartner.phone} />
                                <DetailItem icon={Globe} label="Site Web" value={selectedPartner.details?.website || '--'} />
                                <DetailItem icon={Clock} label="Date demande" value={format(new Date(selectedPartner.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })} />
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description / Message</p>
                                    <p className="text-slate-700 text-sm whitespace-pre-wrap">{selectedPartner.details?.description || 'Aucune description fournie.'}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Localisation</p>
                                    <p className="text-slate-700 text-sm">
                                        {selectedPartner.details?.address}, {selectedPartner.details?.city}, {selectedPartner.details?.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setSelectedPartner(null)} className="btn btn-outline btn-sm">Fermer</button>
                            {selectedPartner.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(selectedPartner.id, 'rejected')}
                                        className="btn bg-red-50 text-red-600 hover:bg-red-100 btn-sm border-none"
                                    >
                                        Rejeter
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedPartner.id, 'approved', selectedPartner.user_id)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Approuver le partenaire
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function DetailItem({ icon: Icon, label, value, color = "text-primary-600" }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-semibold text-slate-900 break-all">{value || '--'}</p>
            </div>
        </div>
    );
}
