'use client';

import { useState, useMemo } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import './properties.css';
import { sampleProperties, formatPrice, getScoreColor, type Property } from '@/data/properties';
import ChatbotWidget from '@/components/ChatbotWidget';

function PropertyCard({ property, locale }: { property: Property; locale: Locale }) {
    const title = property.title[locale] || property.title['en'];
    const desc = property.description[locale] || property.description['en'];

    return (
        <a href={`/properties/${property.id}`} className="property-card">
            {/* Image placeholder */}
            <div className="property-image">
                <div className="property-image-placeholder">
                    {property.propertyType === 'villa' ? '🏡' :
                        property.propertyType === 'penthouse' ? '🏢' :
                            property.propertyType === 'studio' ? '🏠' :
                                property.propertyType === 'land' ? '🌿' : '🏢'}
                </div>
                <div className="property-badges">
                    <span className={`badge badge-${property.type}`}>
                        {property.type === 'rent' ? (locale === 'tr' ? 'Kiralık' : 'Rent') : (locale === 'tr' ? 'Satılık' : 'Sale')}
                    </span>
                    {property.isNew && <span className="badge badge-new">{locale === 'tr' ? 'Yeni' : 'New'}</span>}
                    {property.isFeatured && <span className="badge badge-featured">⭐</span>}
                </div>
                <div className="property-score" style={{ borderColor: getScoreColor(property.score) }}>
                    <span style={{ color: getScoreColor(property.score) }}>{property.score}</span>
                </div>
            </div>

            {/* Content */}
            <div className="property-content">
                <div className="property-price">
                    {formatPrice(property.price, property.currency, property.priceLabel)}
                </div>
                <h3 className="property-title">{title}</h3>
                <p className="property-location">📍 {property.location.district}, {property.location.city}</p>
                <p className="property-desc">{desc}</p>

                <div className="property-meta">
                    <span>🛏️ {property.bedrooms}</span>
                    <span>🚿 {property.bathrooms}</span>
                    <span>📐 {property.area}m²</span>
                </div>

                <div className="property-features">
                    {property.features.slice(0, 3).map((f) => (
                        <span key={f} className="feature-tag">{f}</span>
                    ))}
                    {property.features.length > 3 && (
                        <span className="feature-tag feature-more">+{property.features.length - 3}</span>
                    )}
                </div>

                <div className="property-agent">
                    <span className="agent-name">
                        {property.agent.verified && '✅ '}{property.agent.name}
                    </span>
                    <span className="agent-company">{property.agent.company}</span>
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

    const cities = useMemo(() => {
        const c = new Set(sampleProperties.map(p => p.location.city));
        return Array.from(c);
    }, []);

    const filtered = useMemo(() => {
        let result = sampleProperties;

        if (typeFilter !== 'all') {
            result = result.filter(p => p.type === typeFilter);
        }
        if (cityFilter !== 'all') {
            result = result.filter(p => p.location.city === cityFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                (p.title[locale] || p.title['en']).toLowerCase().includes(q) ||
                p.location.district.toLowerCase().includes(q) ||
                p.location.city.toLowerCase().includes(q)
            );
        }

        switch (sortBy) {
            case 'price-low': result = [...result].sort((a, b) => a.price - b.price); break;
            case 'price-high': result = [...result].sort((a, b) => b.price - a.price); break;
            case 'score': result = [...result].sort((a, b) => b.score - a.score); break;
            default: result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return result;
    }, [typeFilter, cityFilter, searchQuery, sortBy, locale]);

    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <div dir={dir}>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo">
                        <span className="logo-icon">🏠</span>
                        <span className="logo-text">CyprusNest</span>
                    </a>
                    <ul className="navbar-links">
                        <li><a href="/properties?type=rent">{t(locale, 'nav.rent')}</a></li>
                        <li><a href="/properties?type=sale">{t(locale, 'nav.buy')}</a></li>
                        <li><a href="#staging">{t(locale, 'nav.staging')}</a></li>
                        <li><a href="#legal">{t(locale, 'nav.legal')}</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                        <button className="btn btn-ghost">{t(locale, 'nav.login')}</button>
                        <button className="btn btn-primary">{t(locale, 'nav.register')}</button>
                    </div>
                </div>
            </nav>

            <main className="properties-page">
                <div className="container">
                    {/* Filters */}
                    <div className="filters-bar">
                        <div className="filters-row">
                            <input
                                type="text"
                                className="filter-search"
                                placeholder={t(locale, 'hero.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <div className="filter-group">
                                <button
                                    className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setTypeFilter('all')}
                                >
                                    {locale === 'tr' ? 'Tümü' : 'All'}
                                </button>
                                <button
                                    className={`filter-btn ${typeFilter === 'rent' ? 'active' : ''}`}
                                    onClick={() => setTypeFilter('rent')}
                                >
                                    🔑 {t(locale, 'nav.rent')}
                                </button>
                                <button
                                    className={`filter-btn ${typeFilter === 'sale' ? 'active' : ''}`}
                                    onClick={() => setTypeFilter('sale')}
                                >
                                    🏷️ {t(locale, 'nav.buy')}
                                </button>
                            </div>

                            <select className="filter-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                                <option value="all">{locale === 'tr' ? 'Tüm Şehirler' : 'All Cities'}</option>
                                {cities.map(c => (<option key={c} value={c}>{c}</option>))}
                            </select>

                            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
                                <option value="newest">{locale === 'tr' ? 'En Yeni' : 'Newest'}</option>
                                <option value="price-low">{locale === 'tr' ? 'Fiyat ↑' : 'Price ↑'}</option>
                                <option value="price-high">{locale === 'tr' ? 'Fiyat ↓' : 'Price ↓'}</option>
                                <option value="score">{locale === 'tr' ? 'Puan ↓' : 'Score ↓'}</option>
                            </select>
                        </div>

                        <div className="results-count">
                            {filtered.length} {locale === 'tr' ? 'sonuç bulundu' : 'results found'}
                        </div>
                    </div>

                    {/* Property Grid */}
                    <div className="properties-grid">
                        {filtered.map((property) => (
                            <PropertyCard key={property.id} property={property} locale={locale} />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>{locale === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}</h3>
                            <p>{locale === 'tr' ? 'Filtrelerinizi değiştirmeyi deneyin' : 'Try adjusting your filters'}</p>
                        </div>
                    )}
                </div>
            </main>

            {/* AI Chatbot */}
            <ChatbotWidget locale={locale} />
        </div>
    );
}
