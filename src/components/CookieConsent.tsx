'use client';

import { useState, useEffect } from 'react';
import { type Locale } from '@/i18n/translations';

const texts = {
    tr: {
        message: 'Bu site, deneyiminizi iyileştirmek için çerezler kullanmaktadır.',
        learnMore: 'Gizlilik Politikası',
        accept: 'Kabul Et',
    },
    en: {
        message: 'This site uses cookies to improve your experience.',
        learnMore: 'Privacy Policy',
        accept: 'Accept',
    },
    ru: {
        message: 'Этот сайт использует файлы cookie для улучшения вашего опыта.',
        learnMore: 'Политика конфиденциальности',
        accept: 'Принять',
    },
    de: {
        message: 'Diese Website verwendet Cookies, um Ihre Erfahrung zu verbessern.',
        learnMore: 'Datenschutz',
        accept: 'Akzeptieren',
    },
    ar: {
        message: 'يستخدم هذا الموقع ملفات تعريف الارتباط لتحسين تجربتك.',
        learnMore: 'سياسة الخصوصية',
        accept: 'قبول',
    },
};

export default function CookieConsent({ locale }: { locale: Locale }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('evlek-cookies-accepted');
        if (!accepted) {
            // Small delay so it doesn't flash on load
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('evlek-cookies-accepted', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    const t = texts[locale] || texts.en;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: 'var(--bg-card, #ffffff)',
            borderTop: '1px solid var(--border, #e2e8f0)',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.08)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.4s ease',
        }}>
            <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: 'var(--text-secondary, #475569)',
                textAlign: 'center',
            }}>
                🍪 {t.message}{' '}
                <a
                    href="/legal/privacy"
                    style={{
                        color: 'var(--primary, #1B6B93)',
                        textDecoration: 'underline',
                        fontWeight: 500,
                    }}
                >
                    {t.learnMore}
                </a>
            </p>
            <button
                onClick={handleAccept}
                style={{
                    background: 'var(--primary, #1B6B93)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 24px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
                {t.accept}
            </button>
        </div>
    );
}
