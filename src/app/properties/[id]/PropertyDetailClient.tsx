'use client';

import { useState, useEffect } from 'react';
import { type Locale } from '@/i18n/translations';
import { getPropertyById, formatPrice, getScoreColor } from '@/lib/properties';
import { supabase, type Property, type Agent } from '@/lib/supabase';
import { useLocale } from '@/lib/useLocale';
import ChatbotWidget from '@/components/ChatbotWidget';
import PhotoLightbox from '@/components/PhotoLightbox';
import Navbar from '@/components/Navbar';
import '../detail.css';
import '../properties.css';

export default function PropertyDetailClient({ id }: { id: string }) {
    const [locale, setLocale] = useLocale();
    const [property, setProperty] = useState<Property | null>(null);
    const [agent, setAgent] = useState<Agent | null>(null);
    const [similar, setSimilar] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchProperty() {
            setLoading(true);
            const data = await getPropertyById(id);
            setProperty(data);
            if (data) {
                // Fetch agent if exists
                if (data.agent_id) {
                    const { data: agentData } = await supabase
                        .from('agents')
                        .select('*')
                        .eq('user_id', data.agent_id)
                        .single();
                    if (agentData) setAgent(agentData as Agent);
                }
                // Fetch similar listings (same city + type, exclude current)
                const { data: similarData } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('status', 'active')
                    .eq('city', data.city)
                    .eq('type', data.type)
                    .neq('id', id)
                    .limit(3);
                if (similarData) setSimilar(similarData as Property[]);
            }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = property as any;
    const whatsappNum = p.whatsapp || agent?.whatsapp || p.phone || agent?.phone || '905338517878';
    const phoneNum = p.phone || agent?.phone || whatsappNum;
    const telegramUser = p.telegram as string | undefined;
    const listingUrl = `https://evlek.app/properties/${id}`;
    const autoMsgTR = `Merhaba, Evlek'te gördüğüm "${title}" ilanı hakkında bilgi almak istiyorum.\n${listingUrl}`;
    const autoMsgEN = `Hello, I'd like to inquire about "${title}" on Evlek.\n${listingUrl}`;
    const autoMsg = locale === 'tr' ? autoMsgTR : autoMsgEN;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: title, url: listingUrl });
            } catch { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(listingUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="properties" />

            <main className="detail-page">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <a href="/">Evlek</a> / <a href="/properties">{locale === 'tr' ? 'İlanlar' : 'Properties'}</a> / {title}
                    </div>

                    <div className="detail-grid">
                        {/* Left — Visual */}
                        <div className="detail-visual">
                            <div className="detail-main-image">
                                {property.photos && property.photos.length > 0 ? (
                                    <img
                                        src={property.photos[0]}
                                        alt={title}
                                        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}
                                        onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                                    />
                                ) : (
                                    <div className="property-image-placeholder" style={{ height: '400px', fontSize: '6rem' }}>
                                        {property.bedrooms >= 4 ? '🏡' : property.area_sqm > 150 ? '🏢' : '🏠'}
                                    </div>
                                )}
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
                                {property.photos && property.photos.length > 1 && (
                                    <div style={{
                                        position: 'absolute', bottom: '12px', right: '12px',
                                        background: 'rgba(0,0,0,0.7)', color: 'white',
                                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem',
                                        fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(4px)',
                                    }} onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
                                        📷 {property.photos.length} {locale === 'tr' ? 'fotoğraf' : 'photos'}
                                    </div>
                                )}
                            </div>

                            {/* Secondary photo thumbnails */}
                            {property.photos && property.photos.length > 1 && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {property.photos.slice(1, 5).map((photo: string, i: number) => (
                                        <img key={i} src={photo} alt={`${title} - ${i + 2}`}
                                            onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }}
                                            style={{
                                                width: '100px', height: '70px', objectFit: 'cover',
                                                borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                                                border: '2px solid var(--border)', transition: 'border-color 0.2s',
                                            }}
                                            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                        />
                                    ))}
                                    {property.photos.length > 5 && (
                                        <div onClick={() => { setLightboxIndex(5); setLightboxOpen(true); }}
                                            style={{
                                                width: '100px', height: '70px', borderRadius: '8px',
                                                background: 'rgba(27,107,147,0.1)', border: '2px solid var(--border)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                                                color: 'var(--primary)', flexShrink: 0,
                                            }}>
                                            +{property.photos.length - 5}
                                        </div>
                                    )}
                                </div>
                            )}

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
                                    {property.furnished && !(property.features || []).includes('Eşyalı') && <span className="feature-tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>✅ {locale === 'tr' ? 'Eşyalı' : 'Furnished'}</span>}
                                    {property.parking && !(property.features || []).includes('Otopark') && <span className="feature-tag">🅿️ {locale === 'tr' ? 'Otopark' : 'Parking'}</span>}
                                    {property.pool && !(property.features || []).includes('Havuz') && <span className="feature-tag">🏊 {locale === 'tr' ? 'Havuz' : 'Pool'}</span>}
                                    {property.sea_view && !(property.features || []).includes('Deniz Manzarası') && <span className="feature-tag" style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>🌊 {locale === 'tr' ? 'Deniz Manzarası' : 'Sea View'}</span>}
                                </div>
                            </div>

                            {/* KKTC Rental Details */}
                            {isRent && (property.deposit_amount || property.contract_type || property.monthly_fees !== undefined) && (
                                <div className="detail-section">
                                    <h3>🔑 {locale === 'tr' ? 'Kiralama Detayları' : 'Rental Details'}</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                                        {property.deposit_amount > 0 && (
                                            <div style={{ background: 'var(--bg-darker)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.3rem' }}>💰</div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{property.deposit_amount} {locale === 'tr' ? 'kira' : 'month(s)'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Depozito' : 'Deposit'}</div>
                                            </div>
                                        )}
                                        {property.contract_type && (
                                            <div style={{ background: 'var(--bg-darker)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.3rem' }}>📝</div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                                    {{ monthly: locale === 'tr' ? 'Aylık' : 'Monthly', sixmonth: locale === 'tr' ? '6 Ay' : '6 Months', yearly: locale === 'tr' ? 'Yıllık' : 'Yearly', flexible: locale === 'tr' ? 'Esnek' : 'Flexible' }[property.contract_type] || property.contract_type}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Sözleşme' : 'Contract'}</div>
                                            </div>
                                        )}
                                        {property.monthly_fees > 0 && (
                                            <div style={{ background: 'var(--bg-darker)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.3rem' }}>💷</div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>£{property.monthly_fees}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Aylık Aidat' : 'Monthly Fees'}</div>
                                            </div>
                                        )}
                                        <div style={{ background: 'var(--bg-darker)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.3rem' }}>{property.bills_included ? '✅' : '❌'}</div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{property.bills_included ? (locale === 'tr' ? 'Dahil' : 'Included') : (locale === 'tr' ? 'Dahil değil' : 'Not incl.')}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Faturalar' : 'Bills'}</div>
                                        </div>
                                        <div style={{ background: 'var(--bg-darker)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.3rem' }}>{property.available_now ? '🟢' : '🟡'}</div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{property.available_now ? (locale === 'tr' ? 'Evet' : 'Yes') : (locale === 'tr' ? 'Hayır' : 'No')}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'tr' ? 'Hemen Müsait' : 'Available Now'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Title Deed for sale */}
                            {!isRent && property.title_deed_type && (
                                <div className="detail-section">
                                    <h3>📜 {locale === 'tr' ? 'Tapu Bilgisi' : 'Title Deed'}</h3>
                                    <span className="feature-tag" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                        {{ turkish: locale === 'tr' ? 'Türk Koçanı' : 'Turkish Title', equivalent: locale === 'tr' ? 'Eşdeğer Koçan' : 'Equivalent Title', allocation: locale === 'tr' ? 'Tahsis' : 'Allocation', foreign: locale === 'tr' ? 'Yabancı Koçan' : 'Foreign Title', unknown: locale === 'tr' ? 'Bilinmiyor' : 'Unknown' }[property.title_deed_type] || property.title_deed_type}
                                    </span>
                                </div>
                            )}

                            {/* Nearby Landmarks */}
                            {property.nearby_landmarks && property.nearby_landmarks.length > 0 && (
                                <div className="detail-section">
                                    <h3>📍 {locale === 'tr' ? 'Yakın Noktalar' : 'Nearby'}</h3>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {property.nearby_landmarks.map((l: string, i: number) => (
                                            <span key={i} className="feature-tag">📌 {l}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ═══════ OWNER / AGENT PROFILE ═══════ */}
                            <div className="detail-section" style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)', padding: '20px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.3rem', color: 'white', flexShrink: 0,
                                    }}>
                                        {agent?.photo_url ? (
                                            <img src={agent.photo_url} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : '👤'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                            {agent?.company_name || (locale === 'tr' ? 'Evlek Kullanıcısı' : 'Evlek User')}
                                        </div>
                                        {agent?.verified && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                                                ✅ {locale === 'tr' ? 'Doğrulanmış' : 'Verified'}
                                            </span>
                                        )}
                                        {agent?.response_time_hours && (
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                ⚡ {locale === 'tr' ? `Genellikle ${agent.response_time_hours} saat içinde yanıtlar` : `Usually responds in ${agent.response_time_hours}h`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ═══════ CTA ACTIONS ═══════ */}
                            <div className="detail-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <a
                                    href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(autoMsg)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="btn btn-whatsapp btn-lg" style={{ flex: 1 }}
                                >
                                    🟢 WhatsApp
                                </a>
                                {telegramUser && (
                                    <a
                                        href={`https://t.me/${telegramUser.replace('@', '')}?text=${encodeURIComponent(autoMsg)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="btn btn-lg"
                                        style={{ flex: 1, background: 'linear-gradient(135deg, #0088cc, #229ED9)', color: 'white', border: 'none' }}
                                    >
                                        ✈️ Telegram
                                    </a>
                                )}
                                <button className="btn btn-outline btn-lg" style={{ flex: 1 }} onClick={handleShare}>
                                    {copied ? '✅' : '🔗'} {copied ? (locale === 'tr' ? 'Kopyalandı!' : 'Copied!') : (locale === 'tr' ? 'Paylaş' : 'Share')}
                                </button>
                            </div>

                            <a href={`tel:${phoneNum}`}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '12px', textAlign: 'center' }}
                            >
                                📞 {locale === 'tr' ? 'Ara' : 'Call Agent'}
                            </a>

                            {/* Back to listings */}
                            <a href="/properties"
                                style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--primary-light)', fontSize: '0.9rem' }}>
                                ← {locale === 'tr' ? 'Tüm İlanlara Dön' : 'Back to All Listings'}
                            </a>
                        </div>
                    </div>

                    {/* ═══════ MAP ═══════ */}
                    {property.lat && property.lng && (
                        <div style={{ marginTop: '32px' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                                📍 {locale === 'tr' ? 'Konum' : 'Location'}
                            </h2>
                            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', height: '300px' }}>
                                <iframe
                                    width="100%" height="300" style={{ border: 0 }}
                                    loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.lng - 0.01},${property.lat - 0.01},${property.lng + 0.01},${property.lat + 0.01}&layer=mapnik&marker=${property.lat},${property.lng}`}
                                />
                            </div>
                        </div>
                    )}

                    {/* ═══════ SIMILAR LISTINGS ═══════ */}
                    {similar.length > 0 && (
                        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                                {locale === 'tr' ? 'Benzer İlanlar' : 'Similar Listings'}
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {similar.map(s => {
                                    const sTitle = locale === 'tr' ? s.title_tr : s.title_en;
                                    const sPhoto = s.photos?.[0];
                                    return (
                                        <a key={s.id} href={`/properties/${s.id}`} style={{
                                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'block',
                                            transition: 'all 0.2s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                                        >
                                            <div style={{ height: '160px', background: 'var(--bg-darker)', overflow: 'hidden' }}>
                                                {sPhoto ? (
                                                    <img src={sPhoto} alt={sTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--text-muted)' }}>🏠</div>
                                                )}
                                            </div>
                                            <div style={{ padding: '14px' }}>
                                                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '6px' }}>{sTitle}</h3>
                                                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                                                    {formatPrice(s.price, s.currency)}{s.type === 'rent' ? (locale === 'tr' ? '/ay' : '/mo') : ''}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                    📍 {s.district}, {s.city} · 🛏️ {s.bedrooms} · 📐 {s.area_sqm}m²
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ChatbotWidget locale={locale} />

            {/* Photo Lightbox */}
            {lightboxOpen && property?.photos && (
                <PhotoLightbox
                    photos={property.photos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}
