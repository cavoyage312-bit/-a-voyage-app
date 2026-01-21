'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Building2, Bus, Car, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

export function PartnerBanner() {
    const params = useParams();
    const locale = params.locale as string;
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-white rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-white rounded-full blur-2xl" />
            </div>

            <div className="container-custom py-3 sm:py-4 relative">
                <div className="flex items-center justify-center gap-3 sm:gap-6 text-center">
                    {/* Icons - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Bus className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Car className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                        <span className="font-bold text-sm sm:text-base">
                            🚀 Vous êtes hôtelier, transporteur ou loueur ?
                        </span>
                        <span className="text-white/90 text-xs sm:text-sm">
                            Rejoignez notre réseau de partenaires !
                        </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/${locale}/partner/register`}
                        className="flex items-center gap-1 px-4 py-2 bg-white text-accent-600 rounded-full font-bold text-xs sm:text-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                        Devenir Partenaire
                        <ChevronRight className="w-4 h-4" />
                    </Link>

                    {/* Close button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
