import { getRequestConfig } from 'next-intl/server';
import { locales } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming locale is valid
    if (!locale || !locales.includes(locale as any)) {
        locale = 'fr';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
