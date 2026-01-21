import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['fr', 'en', 'de', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    pt: 'Português',
};

export const localeFlags: Record<Locale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    de: '🇩🇪',
    es: '🇪🇸',
    pt: '🇵🇹',
};

export const routing = defineRouting({
    locales: ['fr', 'en', 'de', 'es', 'pt'],
    defaultLocale: 'fr',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
