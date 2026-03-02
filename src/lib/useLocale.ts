import { useState, useEffect } from 'react';
import { type Locale } from '@/i18n/translations';

/**
 * Persists locale preference in localStorage.
 * Falls back to 'tr' if nothing saved.
 */
export function useLocale(): [Locale, (l: Locale) => void] {
    const [locale, setLocaleState] = useState<Locale>('tr');

    useEffect(() => {
        const saved = localStorage.getItem('evlek-locale') as Locale | null;
        if (saved) setLocaleState(saved);
    }, []);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem('evlek-locale', l);
    };

    return [locale, setLocale];
}
