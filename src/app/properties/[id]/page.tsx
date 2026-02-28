'use client';

import { use, useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import { sampleProperties, formatPrice, getScoreColor, getScoreLabel } from '@/data/properties';
import ChatbotWidget from '@/components/ChatbotWidget';
import '../detail.css';
import '../properties.css';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [locale, setLocale] = useState<Locale>('en');
    const [activeImage, setActiveImage] = useState(0);
    const [showStagingDemo, setShowStagingDemo] = useState(false);
    const [stagingStyle, setStagingStyle] = useState('modern');

    const property = sampleProperties.find(p => p.id === id);

    if (!property) {
        return (
            <div style={{ padding: '200px 0', textAlign: 'center' }}>
                <h1>Property not found</h1>
                <a href="/properties" className="btn btn-primary" style={{ marginTop: '20px' }}>← Back to listings</a>
            </div>
        );
    }

    const title = property.title[locale] || property.title['en'];
    const desc = property.description[locale] || property.description['en'];
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    const stagingStyles = [
        { id: 'modern', label: '🏢 Modern', color: '#0ea5e9' },
        { id: 'scandinavian', label: '🌿 Scandinavian', color: '#10b981' },
        { id: 'mediterranean', label: '☀️ Mediterranean', color: '#f59e0b' },
        { id: 'classic', label: '🏛️ British Classic', color: '#8b5cf6' },
        { id: 'arabic', label: '🕌 Arabic', color: '#ef4444' },
        { id: 'minimalist', label: '⬜ Minimalist', color: '#64748b' },
    ];

    return (
        <div dir={dir}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo">
                        <span className="logo-icon">🏠</span>
                        <span className="logo-text">CyprusNest</span>
                    </a>
                    <ul className="navbar-links">
                        <li><a href="/properties">{t(locale, 'nav.rent')}</a></li>
                        <li><a href="/properties">{t(locale, 'nav.buy')}</a></li>
                        <li><a href="#staging">{t(locale, 'nav.staging')}</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                        <button className="btn btn-primary">{t(locale, 'nav.register')}</button>
                    </div>
                </div>
            </nav>

            <main className="detail-page">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <a href="/">CyprusNest</a> / <a href="/properties">{locale === 'tr' ? 'İlanlar' : 'Properties'}</a> / {title}
                    </div>

                    {/* Main Grid */}
                    <div className="detail-grid">
                        {/* Left Column — Visual */}
                        <div className="detail-visual">
                            {/* Main Image */}
                            <div className="detail-main-image">
                                <div className="property-image-placeholder" style={{ height: '400px', fontSize: '6rem' }}>
                                    {property.propertyType === 'villa' ? '🏡' : property.propertyType === 'penthouse' ? '🏢' : '🏠'}
                                </div>
                                <div className="property-badges" style={{ top: '16px', left: '16px' }}>
                                    <span className={`badge badge-${property.type}`}>
                                        {property.type === 'rent' ? (locale === 'tr' ? 'Kiralık' : 'Rent') : (locale === 'tr' ? 'Satılık' : 'Sale')}
                                    </span>
                                    {property.isNew && <span className="badge badge-new">{locale === 'tr' ? 'Yeni' : 'New'}</span>}
                                </div>
                                <div className="detail-score" style={{ borderColor: getScoreColor(property.score) }}>
                                    <div className="score-value" style={{ color: getScoreColor(property.score) }}>{property.score}</div>
                                    <div className="score-label">{getScoreLabel(property.score)}</div>
                                </div>
                            </div>

                            {/* AI Staging Demo */}
                            <div className="staging-section" id="staging">
                                <div className="staging-header">
                                    <h3>🖼️ AI Virtual Staging</h3>
                                    <button
                                        className={`btn ${showStagingDemo ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setShowStagingDemo(!showStagingDemo)}
                                    >
                                        {showStagingDemo ? (locale === 'tr' ? 'Gizle' : 'Hide') : (locale === 'tr' ? 'Mobilyalı Göster' : 'Show Furnished')}
                                    </button>
                                </div>

                                {showStagingDemo && (
                                    <div className="staging-demo">
                                        <p className="staging-desc">
                                            {locale === 'tr'
                                                ? 'AI ile bu mülkün mobilyalı halini görün. Bir dekorasyon stili seçin:'
                                                : 'See how this property looks furnished with AI. Choose a design style:'}
                                        </p>
                                        <div className="staging-styles">
                                            {stagingStyles.map(s => (
                                                <button
                                                    key={s.id}
                                                    className={`staging-style-btn ${stagingStyle === s.id ? 'active' : ''}`}
                                                    onClick={() => setStagingStyle(s.id)}
                                                    style={{ '--accent': s.color } as React.CSSProperties}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="staging-result">
                                            <div className="staging-before">
                                                <span className="staging-label">{locale === 'tr' ? 'Önce' : 'Before'}</span>
                                                <div className="property-image-placeholder" style={{ height: '200px', fontSize: '3rem' }}>🏠</div>
                                            </div>
                                            <div className="staging-arrow">→</div>
                                            <div className="staging-after">
                                                <span className="staging-label">{locale === 'tr' ? 'Sonra' : 'After'} ({stagingStyles.find(s => s.id === stagingStyle)?.label})</span>
                                                <div className="property-image-placeholder staging-furnished" style={{ height: '200px', fontSize: '3rem' }}>
                                                    🛋️
                                                </div>
                                            </div>
                                        </div>
                                        <p className="staging-note">
                                            {locale === 'tr'
                                                ? '⚡ AI 30 saniyede render eder. Gerçek fotoğraflarla çalışır.'
                                                : '⚡ AI renders in 30 seconds. Works with real photos.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column — Info */}
                        <div className="detail-info">
                            <div className="detail-price-box">
                                <div className="detail-price">{formatPrice(property.price, property.currency, property.priceLabel)}</div>
                                <div className="detail-price-note">
                                    {property.type === 'sale' && (locale === 'tr' ? `£${Math.round(property.price / property.area)}/m²` : `£${Math.round(property.price / property.area)}/m²`)}
                                </div>
                            </div>

                            <h1 className="detail-title">{title}</h1>
                            <p className="detail-location">📍 {property.location.district}, {property.location.city}</p>

                            <div className="detail-specs">
                                <div className="spec-item"><span className="spec-icon">🛏️</span><span className="spec-value">{property.bedrooms}</span><span className="spec-label">{locale === 'tr' ? 'Yatak' : 'Beds'}</span></div>
                                <div className="spec-item"><span className="spec-icon">🚿</span><span className="spec-value">{property.bathrooms}</span><span className="spec-label">{locale === 'tr' ? 'Banyo' : 'Baths'}</span></div>
                                <div className="spec-item"><span className="spec-icon">📐</span><span className="spec-value">{property.area}</span><span className="spec-label">m²</span></div>
                                <div className="spec-item"><span className="spec-icon">🏢</span><span className="spec-value">{property.propertyType}</span><span className="spec-label">{locale === 'tr' ? 'Tip' : 'Type'}</span></div>
                            </div>

                            <div className="detail-section">
                                <h3>{locale === 'tr' ? 'Açıklama' : 'Description'}</h3>
                                <p className="detail-desc">{desc}</p>
                            </div>

                            <div className="detail-section">
                                <h3>{locale === 'tr' ? 'Özellikler' : 'Features'}</h3>
                                <div className="detail-features">
                                    {property.features.map(f => (
                                        <span key={f} className="feature-tag">{f}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Agent Card */}
                            <div className="agent-card-detail">
                                <div className="agent-avatar">{property.agent.name.charAt(0)}</div>
                                <div className="agent-info-detail">
                                    <div className="agent-name-detail">{property.agent.verified && '✅ '}{property.agent.name}</div>
                                    <div className="agent-company-detail">{property.agent.company}</div>
                                    <div className="agent-phone">{property.agent.phone}</div>
                                </div>
                            </div>

                            <div className="detail-actions">
                                <a
                                    href={`https://wa.me/${property.agent.phone.replace(/[\s\+\-x]/g, '')}?text=${encodeURIComponent(
                                        locale === 'tr'
                                            ? `Merhaba, CyprusNest'te gördüğüm "${title}" (İlan #${property.id}) hakkında bilgi almak istiyorum.`
                                            : `Hello, I'd like to inquire about "${title}" (Listing #${property.id}) that I saw on CyprusNest.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-whatsapp btn-lg"
                                    style={{ flex: 1 }}
                                >
                                    💬 WhatsApp
                                </a>
                                <button className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                                    📅 {locale === 'tr' ? 'Tur Planla' : 'Schedule Tour'}
                                </button>
                            </div>

                            <a
                                href={`tel:${property.agent.phone.replace(/[\s\-x]/g, '')}`}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '12px', textAlign: 'center' }}
                            >
                                📞 {locale === 'tr' ? 'Ara' : 'Call Agent'}
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
