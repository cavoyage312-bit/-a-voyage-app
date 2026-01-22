'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import {
    Users,
    Calendar,
    MapPin,
    MessageSquare,
    Mail,
    Phone,
    Briefcase,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Plane,
    Bus
} from 'lucide-react';
import { motion } from 'framer-motion';

export function GroupQuotesList() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    async function fetchQuotes() {
        setLoading(true);
        const { data, error } = await supabase
            .from('group_quotes')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) {
            setQuotes(data);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchQuotes();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('group_quotes')
            .update({ status })
            .eq('id', id);

        if (!error) {
            setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary-600" />
                Demandes de Devis Groupe ({quotes.length})
            </h2>

            {quotes.length === 0 ? (
                <div className="card p-12 text-center text-slate-500">
                    Aucune demande de devis pour le moment.
                </div>
            ) : (
                <div className="grid gap-4">
                    {quotes.map((quote) => (
                        <motion.div
                            key={quote.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-6 border-l-4"
                            style={{
                                borderLeftColor: quote.status === 'pending' ? '#f59e0b' :
                                    quote.status === 'contacted' ? '#3b82f6' : '#10b981'
                            }}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Type & Logistics */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            {quote.travel_type === 'flight' ? <Plane className="w-5 h-5 text-blue-600" /> :
                                                quote.travel_type === 'road' ? <Bus className="w-5 h-5 text-indigo-600" /> :
                                                    <Users className="w-5 h-5 text-purple-600" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">
                                                {quote.origin} → {quote.destination}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {quote.travel_type === 'flight' ? 'Vol de Groupe' :
                                                    quote.travel_type === 'road' ? 'Transport Routier' : 'Séminaire'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(quote.travel_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            {quote.passengers} passagers
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-slate-900">{quote.contact_name}</div>
                                        {quote.company_name && (
                                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                {quote.company_name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm text-slate-500">
                                        <a href={`mailto:${quote.email}`} className="flex items-center gap-2 hover:text-primary-600">
                                            <Mail className="w-3.5 h-3.5" /> {quote.email}
                                        </a>
                                        {quote.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" /> {quote.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message & Status */}
                                <div className="lg:w-64 space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 line-clamp-2 italic">
                                        "{quote.message || 'Pas de message particulier'}"
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <select
                                            value={quote.status}
                                            onChange={(e) => updateStatus(quote.id, e.target.value)}
                                            className="text-xs font-semibold py-1.5 px-3 rounded-lg border-slate-200 bg-white"
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="contacted">Contacté</option>
                                            <option value="resolved">Résolu</option>
                                        </select>
                                        <div className="text-[10px] text-slate-400">
                                            {new Date(quote.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
