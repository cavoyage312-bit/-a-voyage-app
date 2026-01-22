'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, Briefcase, Building2, Bus, Car } from 'lucide-react';
import { motion } from 'framer-motion';

interface PartnerBannerProps {
    locale: string;
}

export function PartnerBanner({ locale }: PartnerBannerProps) {
    return (
        <section className="container-custom py-16 md:py-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary-900 via-slate-900 to-teal-900 p-8 md:p-16 lg:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/20 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-teal-300 text-sm font-black mb-8 tracking-widest uppercase"
                        >
                            <Briefcase className="w-4 h-4" />
                            <span>Opportunité Business</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-8 tracking-tighter">
                            Faites décoller votre <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
                                activité de voyage.
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-medium leading-relaxed mb-12">
                            Rejoignez la plateforme qui connecte hôteliers, transporteurs et loueurs de voitures à une audience mondiale. Simple, rapide et sans frais d'entrée.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                            <Link
                                href={`/${locale}/partner/register`}
                                className="group relative flex items-center gap-3 px-10 py-6 bg-white text-primary-900 rounded-2xl font-black text-xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 transition-all"
                            >
                                <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
                                <span>Devenir Partenaire</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Feature Highlight Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: "spring", damping: 20 }}
                        className="w-full lg:w-[450px]"
                    >
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 shadow-3xl">
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-teal-400">
                                        <Building2 className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-lg mb-1">Hôtellerie</h4>
                                        <p className="text-white/50 text-base leading-snug">Gérez vos nuitées et optimisez votre taux d'occupation.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-400">
                                        <Bus className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-lg mb-1">Transport</h4>
                                        <p className="text-white/50 text-base leading-snug">Vendez vos billets de bus et navettes en temps réel.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-400">
                                        <Car className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-lg mb-1">Location</h4>
                                        <p className="text-white/50 text-base leading-snug">Louez vos véhicules en toute sécurité et simplicité.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5 text-center">
                                <div className="flex justify-center -space-x-3 mb-6">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-teal-600 flex items-center justify-center text-xs font-black text-white">
                                        +200
                                    </div>
                                </div>
                                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Collaborations Réussies</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
