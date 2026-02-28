'use client';

import { useState, useEffect, useMemo } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import './properties.css';
import { getProperties, formatPrice, getScoreColor } from '@/lib/properties';
import { type Property } from '@/lib/supabase';
import ChatbotWidget from '@/components/ChatbotWidget';

function PropertyCard({ property, locale }: { property: Property; locale: Locale }) {
    const title = locale === 'tr' ? property.title_tr : property.title_en;
    const isRent = property.type === 'rent';

    return (
        <a href={`/properties/${property.id}`} className="property-card">
            <div className="property-image">
                <div className="property-image-placeholder">
                    {property.bedrooms >= 4 ? '🏡' :
                        property.bedrooms === 0 ? '🏠' :
                            property.area_sqm > 150 ? '🏢' : '🏢'}
                </div>
                <div className="property-badges">
                    <span className={`badge badge-${property.type}`}>
                        {isRent ? (locale === 'tr' ? 'Kiralık' : 'Rent') : (locale === 'tr' ? 'Satılık' : 'Sale')}
                    </span>
                    {property.furnished && <span className="badge badge-new">{locale === 'tr' ? 'Eşyalı' : 'Furnished'}</span>}
                </div>
                {property.cyprusnest_score && (
                    <div className="property-score" style={{ borderColor: getScoreColor(property.cyprusnest_score) }}>
                        <span style={{ color: getScoreColor(property.cyprusnest_score) }}>{property.cyprusnest_score}</span>
                    </div>
                )}
            </div>

            <div className="property-content">
                <div className="property-price">
                    {formatPrice(property.price, property.currency)}
                    {isRent && <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>/mo</span>}
                </div>
                <h3 className="property-title">{title}</h3>
                <p className="property-location">📍 {property.district}, {property.city}</p>

                <div className="property-meta">
                    <span>🛏️ {property.bedrooms}</span>
                    <span>🚿 {property.bathrooms}</span>
                    <span>📐 {property.area_sqm}m²</span>
                </div>

                <div className="property-features">
                    {(property.features || []).slice(0, 3).map((f: string) => (
                        <span key={f} className="feature-tag">{f}</span>
                    ))}
                    {(property.features || []).length > 3 && (
                        <span className="feature-tag feature-more">+{property.features.length - 3}</span>
                    )}
                </div>

                <div className="property-agent">
                    <span className="agent-name">👁️ {property.views_count} {locale === 'tr' ? 'görüntüleme' : 'views'}</span>
                </div>
            </div>
        </a>
    );
}

export default function PropertiesPage() {
    const [locale, setLocale] = useState<Locale>('en');
    const [typeFilter, setTypeFilter] = useState<'all' | 'rent' | 'sale'>('all');
    const [cityFilter, setCityFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'score'>('newest');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getProperties({
                type: typeFilter === 'all' ? undefined : typeFilter,
                city: cityFilter === 'all' ? undefined : cityFilter,
                search: searchQuery || undefined,
                sortBy,
            });
            setProperties(data);
            setLoading(false);
        }
        fetchData();
    }, [typeFilter, cityFilter, searchQuery, sortBy]);

    const cities = useMemo(() => {
        const c = new Set(properties.map(p => p.city));
        return Array.from(c);
    }, [properties]);

    return (
        <div>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo">
                        <span className="logo-icon">🏠</span>
                        <span className="logo-text">CyprusNest</span>
                    </a>
                    <ul className="navbar-links">
                        <li><a href="/properties" style={{ color: 'var(--primary-light)' }}>{t(locale, 'nav.rent')}</a></li>
                        <li><a href="/properties">{t(locale, 'nav.buy')}</a></li>
                        <li><a href="/legal">{t(locale, 'nav.legal')}</a></li>
                        <li><a href="/blog">Blog</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                        <button className="btn btn-outline btn-sm" onClick={() => alert(locale === 'tr' ? '🚧 Yakında aktif olacak!' : '🚧 Coming soon!')}>
                            {t(locale, 'nav.login')}
                        </button>
                    </div>
                </div>
            </nav>

            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container">
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                            {locale === 'tr' ? '🏠 Kuzey Kıbrıs Emlak İlanları' : '🏠 North Cyprus Property Listings'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {loading ? (locale === 'tr' ? 'Yükleniyor...' : 'Loading...') :
                                `${properties.length} ${locale === 'tr' ? 'ilan bulundu' : 'properties found'}`}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="filters-bar" style={{
                        display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap',
                        padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                    }}>
                        <input
                            type="text"
                            placeholder={locale === 'tr' ? '🔍 Ara: bölge, şehir...' : '🔍 Search: area, city...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1, minWidth: '200px', padding: '8px 12px',
                                background: 'var(--bg-darker)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                            }}
                        />
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | 'rent' | 'sale')}
                            style={{ padding: '8px 12px', background: 'var(--bg-darker)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                            <option value="all">{locale === 'tr' ? 'Tümü' : 'All'}</option>
                            <option value="rent">{locale === 'tr' ? 'Kiralık' : 'Rent'}</option>
                            <option value="sale">{locale === 'tr' ? 'Satılık' : 'Sale'}</option>
                        </select>
                        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
                            style={{ padding: '8px 12px', background: 'var(--bg-darker)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                            <option value="all">{locale === 'tr' ? 'Tüm Şehirler' : 'All Cities'}</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            style={{ padding: '8px 12px', background: 'var(--bg-darker)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                            <option value="newest">{locale === 'tr' ? '🕐 En Yeni' : '🕐 Newest'}</option>
                            <option value="price-low">{locale === 'tr' ? '💰 Fiyat ↑' : '💰 Price ↑'}</option>
                            <option value="price-high">{locale === 'tr' ? '💰 Fiyat ↓' : '💰 Price ↓'}</option>
                            <option value="score">{locale === 'tr' ? '⭐ Puan' : '⭐ Score'}</option>
                        </select>
                    </div>

                    {/* Property Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                            <p>{locale === 'tr' ? 'İlanlar yükleniyor...' : 'Loading properties...'}</p>
                        </div>
                    ) : properties.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                            <p>{locale === 'tr' ? 'İlan bulunamadı' : 'No properties found'}</p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {properties.map((p) => (
                                <PropertyCard key={p.id} property={p} locale={locale} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
