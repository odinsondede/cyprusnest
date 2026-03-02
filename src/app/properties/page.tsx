'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { type Locale, t } from '@/i18n/translations';
import './properties.css';
import { getProperties, getScoreColor, PAGE_SIZE } from '@/lib/properties';
import { type Property } from '@/lib/supabase';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { convertPrice, formatCurrency, currencies, type Currency } from '@/lib/currency';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';
import AuthModal from '@/components/AuthModal';
import { PropertyGridSkeleton } from '@/components/LoadingSkeleton';

function PropertyCard({ property, locale, isFav, onToggleFav, displayCurrency }: { property: Property; locale: Locale; isFav: boolean; onToggleFav: () => void; displayCurrency: Currency }) {
    const title = locale === 'tr' ? property.title_tr : property.title_en;
    const isRent = property.type === 'rent';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = property as any;
    const roomConfig = p.room_config || `${property.bedrooms}+1`;
    const propertyType = p.property_type || 'apartment';
    const ownerType = p.owner_type;
    const ptIcons: Record<string, string> = { apartment: '🏢', villa: '🏡', detached: '🏠', penthouse: '🌆', studio: '🔲', duplex: '🏘️', shop: '🏪', office: '🏛️', warehouse: '🏭', residential_land: '🌳', commercial_land: '🏗️', farmland: '🌾' };
    const ptLabels: Record<string, { tr: string; en: string }> = { apartment: { tr: 'Daire', en: 'Apt' }, villa: { tr: 'Villa', en: 'Villa' }, detached: { tr: 'Müstakil', en: 'House' }, penthouse: { tr: 'Penthouse', en: 'PH' }, studio: { tr: 'Stüdyo', en: 'Studio' }, duplex: { tr: 'Dublex', en: 'Duplex' }, shop: { tr: 'Dükkan', en: 'Shop' }, office: { tr: 'Ofis', en: 'Office' }, warehouse: { tr: 'Depo', en: 'Storage' }, residential_land: { tr: 'Arsa', en: 'Land' }, commercial_land: { tr: 'T.Arsa', en: 'C.Land' }, farmland: { tr: 'Tarla', en: 'Farm' } };
    const isLand = ['residential_land', 'commercial_land', 'farmland'].includes(propertyType);

    return (
        <a href={`/properties/${property.id}`} className="property-card">
            <div className="property-image">
                {property.photos && property.photos.length > 0 ? (
                    <img src={property.photos[0]} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div className="property-image-placeholder">
                        {ptIcons[propertyType] || '🏢'}
                    </div>
                )}
                <div className="property-badges">
                    <span className={`badge badge-${property.type}`}>
                        {isRent ? (locale === 'tr' ? 'Kiralık' : 'Rent') : (locale === 'tr' ? 'Satılık' : 'Sale')}
                    </span>
                    <span style={{ padding: '4px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)' }}>
                        {ptIcons[propertyType] || '🏢'} {locale === 'tr' ? ptLabels[propertyType]?.tr : ptLabels[propertyType]?.en || propertyType}
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
                    {!isLand && <span>🏠 {roomConfig}</span>}
                    {!isLand && <span>🚿 {property.bathrooms}</span>}
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

                {/* Owner type badge */}
                {ownerType && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 500, background: ownerType === 'owner' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', color: ownerType === 'owner' ? '#10b981' : '#6366f1' }}>
                            {ownerType === 'owner' ? '👤' : '🏢'} {ownerType === 'owner' ? (locale === 'tr' ? 'Sahibinden' : 'Owner') : (locale === 'tr' ? 'Emlakçı' : 'Agent')}
                        </span>
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

function PropertiesContent() {
    const searchParams = useSearchParams();
    const [locale, setLocale] = useState<Locale>('tr');
    const [typeFilter, setTypeFilter] = useState<'all' | 'rent' | 'sale'>(() => {
        const t = searchParams.get('type');
        return t === 'rent' || t === 'sale' ? t : 'all';
    });
    const [cityFilter, setCityFilter] = useState<string>(() => {
        return searchParams.get('city') || 'all';
    });
    const [searchQuery, setSearchQuery] = useState(() => {
        return searchParams.get('search') || '';
    });
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'score'>('newest');
    const [displayCurrency, setDisplayCurrency] = useState<Currency>('GBP');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [favIds, setFavIds] = useState<string[]>([]);
    const [quickFilters, setQuickFilters] = useState({
        available_now: false, bills_included: false, furnished: false,
        parking: false, pool: false, sea_view: false,
    });
    const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
    const [roomConfigFilter, setRoomConfigFilter] = useState('all');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (roomConfigFilter !== 'all' && (p as any).room_config !== roomConfigFilter) return false;
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
            const result = await getProperties({
                type: typeFilter === 'all' ? undefined : typeFilter,
                city: cityFilter === 'all' ? undefined : cityFilter,
                search: searchQuery || undefined,
                property_type: propertyTypeFilter === 'all' ? undefined : propertyTypeFilter,
                price_min: priceMin ? Number(priceMin) : undefined,
                price_max: priceMax ? Number(priceMax) : undefined,
                sortBy,
                offset: 0,
            });
            setProperties(result.data);
            setTotalCount(result.count);
            setHasMore(result.hasMore);
            setLoading(false);
        }
        fetchData();
    }, [typeFilter, cityFilter, searchQuery, sortBy, propertyTypeFilter, priceMin, priceMax]);

    async function loadMore() {
        setLoadingMore(true);
        const result = await getProperties({
            type: typeFilter === 'all' ? undefined : typeFilter,
            city: cityFilter === 'all' ? undefined : cityFilter,
            search: searchQuery || undefined,
            sortBy,
            offset: properties.length,
        });
        setProperties(prev => [...prev, ...result.data]);
        setHasMore(result.hasMore);
        setLoadingMore(false);
    }

    const cities = useMemo(() => {
        const c = new Set(properties.map(p => p.city));
        return Array.from(c);
    }, [properties]);

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="properties" />

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

                    {/* Advanced filter toggle */}
                    <button onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                            background: 'none', border: 'none', color: 'var(--primary-light)',
                            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', padding: '4px 0',
                        }}>
                        {showAdvanced ? '▼' : '▶'} {locale === 'tr' ? 'Gelişmiş Filtreler' : 'Advanced Filters'}
                        {(propertyTypeFilter !== 'all' || roomConfigFilter !== 'all' || priceMin || priceMax) && (
                            <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                                {[propertyTypeFilter !== 'all', roomConfigFilter !== 'all', !!priceMin, !!priceMax].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {/* Advanced filter panel */}
                    {showAdvanced && (
                        <div className="advanced-filters-grid" style={{
                            padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', marginBottom: '20px',
                            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px',
                        }}>
                            {/* Property Type */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                                    🏠 {locale === 'tr' ? 'Mülk Tipi' : 'Property Type'}
                                </label>
                                <select value={propertyTypeFilter} onChange={e => setPropertyTypeFilter(e.target.value)}
                                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-darker)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                                    <option value="all">{locale === 'tr' ? 'Tümü' : 'All'}</option>
                                    <optgroup label={locale === 'tr' ? '🏠 Konut' : '🏠 Residential'}>
                                        <option value="apartment">{locale === 'tr' ? 'Daire' : 'Apartment'}</option>
                                        <option value="villa">Villa</option>
                                        <option value="detached">{locale === 'tr' ? 'Müstakil' : 'Detached'}</option>
                                        <option value="penthouse">Penthouse</option>
                                        <option value="studio">{locale === 'tr' ? 'Stüdyo' : 'Studio'}</option>
                                        <option value="duplex">{locale === 'tr' ? 'Dubleks' : 'Duplex'}</option>
                                    </optgroup>
                                    <optgroup label={locale === 'tr' ? '🏪 Ticari' : '🏪 Commercial'}>
                                        <option value="shop">{locale === 'tr' ? 'Dükkan' : 'Shop'}</option>
                                        <option value="office">{locale === 'tr' ? 'Ofis' : 'Office'}</option>
                                        <option value="warehouse">{locale === 'tr' ? 'Depo' : 'Warehouse'}</option>
                                    </optgroup>
                                    <optgroup label={locale === 'tr' ? '🌍 Arsa' : '🌍 Land'}>
                                        <option value="residential_land">{locale === 'tr' ? 'Konut Arsası' : 'Residential Land'}</option>
                                        <option value="commercial_land">{locale === 'tr' ? 'Ticari Arsa' : 'Commercial Land'}</option>
                                        <option value="farmland">{locale === 'tr' ? 'Tarla' : 'Farmland'}</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* Room Config */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                                    🛏️ {locale === 'tr' ? 'Oda' : 'Rooms'}
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {['all', '1+0', '1+1', '2+1', '3+1', '4+1', '5+'].map(rc => (
                                        <button key={rc} onClick={() => setRoomConfigFilter(rc)}
                                            style={{
                                                padding: '5px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500,
                                                border: roomConfigFilter === rc ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                                                background: roomConfigFilter === rc ? 'rgba(14,165,233,0.15)' : 'var(--bg-darker)',
                                                color: roomConfigFilter === rc ? 'var(--primary-light)' : 'var(--text-muted)',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}>
                                            {rc === 'all' ? (locale === 'tr' ? 'Tümü' : 'All') : rc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                                    💰 {locale === 'tr' ? 'Fiyat Aralığı (£)' : 'Price Range (£)'}
                                </label>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <input type="number" placeholder="Min" value={priceMin}
                                        onChange={e => setPriceMin(e.target.value)}
                                        style={{ width: '100%', padding: '7px 10px', background: 'var(--bg-darker)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>–</span>
                                    <input type="number" placeholder="Max" value={priceMax}
                                        onChange={e => setPriceMax(e.target.value)}
                                        style={{ width: '100%', padding: '7px 10px', background: 'var(--bg-darker)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                                </div>
                            </div>

                            {/* Reset */}
                            {(propertyTypeFilter !== 'all' || roomConfigFilter !== 'all' || priceMin || priceMax) && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <button onClick={() => { setPropertyTypeFilter('all'); setRoomConfigFilter('all'); setPriceMin(''); setPriceMax(''); }}
                                        style={{ padding: '6px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
                                        🗑️ {locale === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

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
                        <PropertyGridSkeleton count={6} />
                    ) : filteredProperties.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                            <p>{locale === 'tr' ? 'İlan bulunamadı' : 'No properties found'}</p>
                        </div>
                    ) : (
                        <>
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
                            {hasMore && (
                                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                                    <button onClick={loadMore} disabled={loadingMore} className="btn btn-outline"
                                        style={{ padding: '12px 40px', opacity: loadingMore ? 0.6 : 1 }}>
                                        {loadingMore ? '⏳...' : locale === 'tr' ? `Daha Fazla Göster (${properties.length}/${totalCount})` : `Load More (${properties.length}/${totalCount})`}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} locale={locale} />
            <ChatbotWidget locale={locale} />
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>Yükleniyor...</div>}>
            <PropertiesContent />
        </Suspense>
    );
}
