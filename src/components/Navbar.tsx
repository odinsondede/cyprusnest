'use client';

import { useState, useEffect } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import { getCurrentUser, signOut, onAuthChange } from '@/lib/auth';
import AuthModal from './AuthModal';

interface NavbarProps {
    locale: Locale;
    onLocaleChange: (locale: Locale) => void;
    activePage?: 'home' | 'properties' | 'legal' | 'blog' | 'admin' | 'add-property';
}

export default function Navbar({ locale, onLocaleChange, activePage }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState<{ id: string } | null>(null);

    useEffect(() => {
        getCurrentUser().then(u => setUser(u as { id: string } | null));
        const { data: { subscription } } = onAuthChange((u) => setUser(u as { id: string } | null));
        return () => subscription.unsubscribe();
    }, []);

    const linkStyle = (page: string) => activePage === page ? { color: 'var(--primary-light)' } : {};

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo">
                        <span className="logo-icon">🏠</span>
                        <span className="logo-text">CyprusNest</span>
                    </a>
                    <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                    <ul className={`navbar-links ${menuOpen ? 'nav-open' : ''}`}>
                        <li><a href="/properties" onClick={() => setMenuOpen(false)} style={linkStyle('properties')}>{t(locale, 'nav.rent')}</a></li>
                        <li><a href="/properties" onClick={() => setMenuOpen(false)}>{t(locale, 'nav.buy')}</a></li>
                        <li><a href="/legal" onClick={() => setMenuOpen(false)} style={linkStyle('legal')}>{t(locale, 'nav.legal')}</a></li>
                        <li><a href="/blog" onClick={() => setMenuOpen(false)} style={linkStyle('blog')}>Blog</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => onLocaleChange(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                        {user ? (
                            <>
                                <a href="/profile" className="btn btn-outline btn-sm" style={activePage === 'profile' as unknown ? { borderColor: 'var(--primary)' } : {}}>
                                    👤 {locale === 'tr' ? 'Profil' : 'Profile'}
                                </a>
                                <button className="btn btn-outline btn-sm" onClick={async () => { await signOut(); setUser(null); }}>
                                    🚪 {locale === 'tr' ? 'Çıkış' : 'Logout'}
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAuth(true)}>
                                {t(locale, 'nav.login')}
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} locale={locale} />
        </>
    );
}
