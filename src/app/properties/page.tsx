'use client';

import { useState, useEffect, useMemo } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import './properties.css';
import { getProperties, getScoreColor } from '@/lib/properties';
import { type Property } from '@/lib/supabase';
import { getCurrentUser, signOut, onAuthChange } from '@/lib/auth';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { convertPrice, formatCurrency, currencies, type Currency } from '@/lib/currency';
import ChatbotWidget from '@/components/ChatbotWidget';
import AuthModal from '@/components/AuthModal';

function PropertyCard({ property, locale, isFav, onToggleFav, displayCurrency }: { property: Property; locale: Locale; isFav: boolean; onToggleFav: () => void; displayCurrency: Currency }) {
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
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(); }}
                    style={{
                        position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)',
                        border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '1.1rem', transition: 'transform 0.2s',
                    }}
                    title={locale === 'tr' ? 'Favorile' : 'Favorite'}
                >{isFav ? '❤️' : '🤍'}</button>
            </div>

            <div className="property-content">
                <div className="property-price">
                    {formatCurrency(convertPrice(property.price, property.currency, displayCurrency), displayCurrency)}
                    {isRent && <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>/mo</span>}
                </div>
                <h3 className="property-title">{title}</h3>
                <p className="property-location">📍 {property.district}, {property.city}</p>

                <div className="property-meta">
                    <span>🛏️ {property.bedrooms}</span>
                    <span>🚿 {property.bathrooms}</span>
                    <span>📐 {property.area_sqm}m²</span>
                    {property.parking && <span>🅿️</span>}
                    {property.pool && <span>🏊</span>}
                    {property.sea_view && <span>🌊</span>}
                </div>

                {/* KKTC rental badges */}
                {isRent && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {property.available_now && (
                            <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                                🟢 {locale === 'tr' ? 'Hemen Müsait' : 'Available Now'}
                            </span>
                        )}
                        {property.bills_included && (
                            <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)' }}>
                                💡 {locale === 'tr' ? 'Faturalar Dahil' : 'Bills Incl.'}
                            </span>
                        )}
                        {property.deposit_amount > 0 && (
                            <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                                💰 {property.deposit_amount} {locale === 'tr' ? 'kira depozito' : 'mo deposit'}
                            </span>
                        )}
                    </div>
                )}

                {/* Nearby landmarks */}
                {property.nearby_landmarks && property.nearby_landmarks.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        📌 {property.nearby_landmarks.slice(0, 3).join(' • ')}
                    </div>
                )}

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
    const [displayCurrency, setDisplayCurrency] = useState<Currency>('GBP');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [favIds, setFavIds] = useState<string[]>([]);
    const [quickFilters, setQuickFilters] = useState({
        available_now: false, bills_included: false, furnished: false,
        parking: false, pool: false, sea_view: false,
    });

    function toggleQuick(key: keyof typeof quickFilters) {
        setQuickFilters(prev => ({ ...prev, [key]: !prev[key] }));
    }

    const filteredProperties = properties.filter(p => {
        if (quickFilters.available_now && !p.available_now) return false;
        if (quickFilters.bills_included && !p.bills_included) return false;
        if (quickFilters.furnished && !p.furnished) return false;
        if (quickFilters.parking && !p.parking) return false;
        if (quickFilters.pool && !p.pool) return false;
        if (quickFilters.sea_view && !p.sea_view) return false;
        return true;
    });

    useEffect(() => {
        getCurrentUser().then(u => setUser(u as { id: string } | null));
        const { data: { subscription } } = onAuthChange((u) => setUser(u as { id: string } | null));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) getFavorites(user.id).then(setFavIds);
        else setFavIds([]);
    }, [user]);

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
                        {user ? (
                            <button className="btn btn-outline btn-sm" onClick={async () => { await signOut(); setUser(null); }}>
                                🚪 {locale === 'tr' ? 'Çıkış' : 'Logout'}
                            </button>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAuth(true)}>
                                {t(locale, 'nav.login')}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container">
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                {locale === 'tr' ? '🏠 Kuzey Kıbrıs Emlak İlanları' : '🏠 North Cyprus Property Listings'}
                            </h1>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {loading ? (locale === 'tr' ? 'Yükleniyor...' : 'Loading...') :
                                    `${properties.length} ${locale === 'tr' ? 'ilan bulundu' : 'properties found'}`}
                            </p>
                        </div>
                        <a href="/add-property" className="btn btn-primary">
                            ➕ {locale === 'tr' ? 'İlan Ekle' : 'Add Listing'}
                        </a>
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
                        <select value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value as Currency)}
                            style={{ padding: '8px 12px', background: 'var(--bg-darker)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', minWidth: '70px' }}>
                            {currencies.map(c => <option key={c} value={c}>{{ GBP: '£ GBP', EUR: '€ EUR', USD: '$ USD', TRY: '₺ TRY' }[c]}</option>)}
                        </select>
                    </div>

                    {/* Quick filter chips */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {[
                            { key: 'available_now' as const, icon: '🟢', tr: 'Hemen Müsait', en: 'Available Now' },
                            { key: 'bills_included' as const, icon: '💡', tr: 'Faturalar Dahil', en: 'Bills Incl.' },
                            { key: 'furnished' as const, icon: '🛋️', tr: 'Eşyalı', en: 'Furnished' },
                            { key: 'parking' as const, icon: '🅿️', tr: 'Otopark', en: 'Parking' },
                            { key: 'pool' as const, icon: '🏊', tr: 'Havuz', en: 'Pool' },
                            { key: 'sea_view' as const, icon: '🌊', tr: 'Deniz Manzarası', en: 'Sea View' },
                        ].map(f => (
                            <button key={f.key} onClick={() => toggleQuick(f.key)}
                                style={{
                                    padding: '5px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500,
                                    border: quickFilters[f.key] ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: quickFilters[f.key] ? 'rgba(14,165,233,0.15)' : 'transparent',
                                    color: quickFilters[f.key] ? 'var(--primary-light)' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.15s ease',
                                }}>
                                {f.icon} {locale === 'tr' ? f.tr : f.en}
                            </button>
                        ))}
                    </div>

                    {/* Property Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                            <p>{locale === 'tr' ? 'İlanlar yükleniyor...' : 'Loading properties...'}</p>
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                            <p>{locale === 'tr' ? 'İlan bulunamadı' : 'No properties found'}</p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {filteredProperties.map((p) => (
                                <PropertyCard
                                    key={p.id}
                                    property={p}
                                    locale={locale}
                                    isFav={favIds.includes(p.id)}
                                    displayCurrency={displayCurrency}
                                    onToggleFav={async () => {
                                        if (!user) { setShowAuth(true); return; }
                                        const nowFav = await toggleFavorite(user.id, p.id);
                                        setFavIds(prev => nowFav ? [...prev, p.id] : prev.filter(id => id !== p.id));
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} locale={locale} />
            <ChatbotWidget locale={locale} />
        </div>
    );
}
