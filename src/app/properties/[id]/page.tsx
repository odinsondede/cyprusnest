'use client';

import { use, useState, useEffect } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import { getPropertyById, formatPrice, getScoreColor } from '@/lib/properties';
import { type Property } from '@/lib/supabase';
import ChatbotWidget from '@/components/ChatbotWidget';
import '../detail.css';
import '../properties.css';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [locale, setLocale] = useState<Locale>('en');
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProperty() {
            setLoading(true);
            const data = await getPropertyById(id);
            setProperty(data);
            setLoading(false);
        }
        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '200px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                <p>{locale === 'tr' ? 'İlan yükleniyor...' : 'Loading property...'}</p>
            </div>
        );
    }

    if (!property) {
        return (
            <div style={{ padding: '200px 0', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--text-primary)' }}>{locale === 'tr' ? 'İlan bulunamadı' : 'Property not found'}</h1>
                <a href="/properties" className="btn btn-primary" style={{ marginTop: '20px' }}>← {locale === 'tr' ? 'İlanlara Dön' : 'Back to listings'}</a>
            </div>
        );
    }

    const title = locale === 'tr' ? property.title_tr : property.title_en;
    const desc = locale === 'tr' ? (property.description_tr || property.description_en) : (property.description_en || property.description_tr);
    const isRent = property.type === 'rent';
    const whatsappNumber = '905338517878'; // Default CyprusNest number

    return (
        <div>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo">
                        <span className="logo-icon">🏠</span>
                        <span className="logo-text">CyprusNest</span>
                    </a>
                    <ul className="navbar-links">
                        <li><a href="/properties">{t(locale, 'nav.rent')}</a></li>
                        <li><a href="/properties">{t(locale, 'nav.buy')}</a></li>
                        <li><a href="/legal">{t(locale, 'nav.legal')}</a></li>
                        <li><a href="/blog">Blog</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                    </div>
                </div>
            </nav>

            <main className="detail-page">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <a href="/">CyprusNest</a> / <a href="/properties">{locale === 'tr' ? 'İlanlar' : 'Properties'}</a> / {title}
                    </div>

                    <div className="detail-grid">
                        {/* Left — Visual */}
                        <div className="detail-visual">
                            <div className="detail-main-image">
                                <div className="property-image-placeholder" style={{ height: '400px', fontSize: '6rem' }}>
                                    {property.bedrooms >= 4 ? '🏡' : property.area_sqm > 150 ? '🏢' : '🏠'}
                                </div>
                                <div className="property-badges" style={{ top: '16px', left: '16px' }}>
                                    <span className={`badge badge-${property.type}`}>
                                        {isRent ? (locale === 'tr' ? 'Kiralık' : 'Rent') : (locale === 'tr' ? 'Satılık' : 'Sale')}
                                    </span>
                                    {property.furnished && <span className="badge badge-new">{locale === 'tr' ? 'Eşyalı' : 'Furnished'}</span>}
                                </div>
                                {property.cyprusnest_score && (
                                    <div className="detail-score" style={{ borderColor: getScoreColor(property.cyprusnest_score) }}>
                                        <div className="score-value" style={{ color: getScoreColor(property.cyprusnest_score) }}>{property.cyprusnest_score}</div>
                                        <div className="score-label">Score</div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Info Bar */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)', padding: '20px', marginTop: '16px',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem' }}>🛏️</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.bedrooms}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Yatak' : 'Beds'}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem' }}>🚿</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.bathrooms}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Banyo' : 'Baths'}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem' }}>📐</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.area_sqm}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>m²</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem' }}>👁️</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{property.views_count}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Görüntüleme' : 'Views'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Right — Info */}
                        <div className="detail-info">
                            <div className="detail-price-box">
                                <div className="detail-price">
                                    {formatPrice(property.price, property.currency)}
                                    {isRent && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>/mo</span>}
                                </div>
                                {property.type === 'sale' && property.area_sqm > 0 && (
                                    <div className="detail-price-note">
                                        £{Math.round(property.price / property.area_sqm)}/m²
                                    </div>
                                )}
                            </div>

                            <h1 className="detail-title">{title}</h1>
                            <p className="detail-location">📍 {property.district}, {property.city}</p>

                            {desc && (
                                <div className="detail-section">
                                    <h3>{locale === 'tr' ? 'Açıklama' : 'Description'}</h3>
                                    <p className="detail-desc">{desc}</p>
                                </div>
                            )}

                            <div className="detail-section">
                                <h3>{locale === 'tr' ? 'Özellikler' : 'Features'}</h3>
                                <div className="detail-features">
                                    {(property.features || []).map((f: string) => (
                                        <span key={f} className="feature-tag">{f}</span>
                                    ))}
                                    {property.furnished && <span className="feature-tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>✅ {locale === 'tr' ? 'Eşyalı' : 'Furnished'}</span>}
                                </div>
                            </div>

                            {/* CTA Actions */}
                            <div className="detail-actions">
                                <a
                                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                        locale === 'tr'
                                            ? `Merhaba, CyprusNest'te gördüğüm "${title}" hakkında bilgi almak istiyorum.`
                                            : `Hello, I'd like to inquire about "${title}" that I saw on CyprusNest.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-whatsapp btn-lg"
                                    style={{ flex: 1 }}
                                >
                                    💬 WhatsApp
                                </a>
                                <button
                                    className="btn btn-outline btn-lg"
                                    style={{ flex: 1 }}
                                    onClick={() => alert(locale === 'tr' ? '🚧 Yakında aktif olacak!' : '🚧 Coming soon!')}
                                >
                                    ❤️ {locale === 'tr' ? 'Favorile' : 'Favorite'}
                                </button>
                            </div>

                            <a
                                href={`tel:+${whatsappNumber}`}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '12px', textAlign: 'center' }}
                            >
                                📞 {locale === 'tr' ? 'Ara' : 'Call Agent'}
                            </a>

                            {/* Back to listings */}
                            <a
                                href="/properties"
                                style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--primary-light)', fontSize: '0.9rem' }}
                            >
                                ← {locale === 'tr' ? 'Tüm İlanlara Dön' : 'Back to All Listings'}
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
