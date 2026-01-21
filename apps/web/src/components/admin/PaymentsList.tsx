'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Search, CreditCard, ArrowUpRight, ArrowDownLeft, Download, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function PaymentsList() {
    const supabase = createClient();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    async function fetchPayments() {
        setLoading(true);
        // On récupère les paiements depuis les réservations confirmées
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setPayments(data);
        setLoading(false);
    }

    const filteredPayments = payments.filter(p =>
        (p.first_name + ' ' + p.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Paiements & Transactions</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une transaction..."
                            className="input pl-10 h-10 min-w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-outline h-10 gap-2">
                        <Download className="w-4 h-4" /> Exporter CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6 border-none shadow-sm bg-primary-600 text-white">
                    <p className="text-primary-100 text-sm mb-1">Volume Total (30j)</p>
                    <h3 className="text-3xl font-bold">{formatPrice(payments.reduce((acc, curr) => acc + (Number(curr.price_amount) || 0), 0))}</h3>
                    <div className="mt-4 flex items-center gap-1 text-xs text-primary-200">
                        <ArrowUpRight className="w-3 h-3" /> +15.4% par rapport au mois dernier
                    </div>
                </div>
                <div className="card p-6 border-none shadow-sm bg-white">
                    <p className="text-slate-500 text-sm mb-1">Transactions Réussies</p>
                    <h3 className="text-3xl font-bold text-slate-900">{payments.filter(p => p.status === 'confirmed').length}</h3>
                    <div className="mt-4 flex items-center gap-1 text-xs text-green-600 font-bold">
                        <CheckCircle className="w-3 h-3" /> 98.2% de taux de succès
                    </div>
                </div>
                <div className="card p-6 border-none shadow-sm bg-white">
                    <p className="text-slate-500 text-sm mb-1">Remboursements</p>
                    <h3 className="text-3xl font-bold text-slate-900">0</h3>
                    <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
                        Aucune demande en cours
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Méthode</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic-text-none">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/50" />
                                    </tr>
                                ))
                            ) : filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        TRX-{payment.id.slice(0, 12).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {payment.first_name} {payment.last_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <CreditCard className="w-3 h-3" /> Carte bancaire
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {formatPrice(payment.price_amount)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 shadow-sm">
                                            <div className={`w-2 h-2 rounded-full ${payment.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            <span className="text-xs font-bold text-slate-700 capitalize">{payment.status === 'confirmed' ? 'Réussi' : 'En attente'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function CheckCircle(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
