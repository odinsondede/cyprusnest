'use client';

import { useState, useEffect, useRef } from 'react';
import { type Locale, t } from '@/i18n/translations';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { uploadPropertyPhoto } from '@/lib/storage';
import AuthModal from '@/components/AuthModal';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';
import '../properties/properties.css';

const cities = ['Lefkoşa', 'Girne', 'Gazimağusa', 'İskele', 'Güzelyurt', 'Lefke'];

export default function AddPropertyPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [showAuth, setShowAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        title_tr: '', title_en: '',
        description_tr: '', description_en: '',
        type: 'rent' as 'rent' | 'sale',
        price: '',
        city: 'Lefkoşa',
        district: '',
        bedrooms: '1', bathrooms: '1', area_sqm: '',
        furnished: false,
        features: '',
        // KKTC fields
        deposit_amount: '1',
        contract_type: 'yearly' as 'monthly' | 'sixmonth' | 'yearly' | 'flexible',
        title_deed_type: 'turkish' as 'turkish' | 'equivalent' | 'allocation' | 'foreign' | 'unknown',
        bills_included: false,
        available_now: true,
        monthly_fees: '0',
        nearby_landmarks: '',
        parking: false,
        pool: false,
        sea_view: false,
    });

    const isTR = locale === 'tr';

    useEffect(() => {
        getCurrentUser().then(u => setUser(u as { id: string; email?: string } | null));
        const { data: { subscription } } = onAuthChange((u) => setUser(u as { id: string; email?: string } | null));
        return () => subscription.unsubscribe();
    }, []);

    function updateForm(field: string, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) { setShowAuth(true); return; }
        setLoading(true);
        setError('');

        const featuresArr = form.features
            .split(',')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        const landmarksArr = form.nearby_landmarks
            .split(',')
            .map(l => l.trim())
            .filter(l => l.length > 0);

        // Upload photos
        const photoUrls: string[] = [];
        if (photos.length > 0) {
            setUploadProgress(isTR ? 'Fotoğraflar yükleniyor...' : 'Uploading photos...');
            for (let i = 0; i < photos.length; i++) {
                setUploadProgress(`${isTR ? 'Fotoğraf' : 'Photo'} ${i + 1}/${photos.length}`);
                const url = await uploadPropertyPhoto(photos[i]);
                if (url) photoUrls.push(url);
            }
            setUploadProgress('');
        }

        const { error: insertError } = await supabase.from('properties').insert({
            title_tr: form.title_tr,
            title_en: form.title_en || form.title_tr,
            description_tr: form.description_tr,
            description_en: form.description_en || form.description_tr,
            type: form.type,
            status: 'pending',
            price: Number(form.price),
            currency: 'GBP',
            city: form.city,
            district: form.district,
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            area_sqm: Number(form.area_sqm),
            furnished: form.furnished,
            features: featuresArr,
            photos: photoUrls,
            cyprusnest_score: null,
            views_count: 0,
            deposit_amount: Number(form.deposit_amount),
            contract_type: form.contract_type,
            title_deed_type: form.title_deed_type,
            bills_included: form.bills_included,
            available_now: form.available_now,
            monthly_fees: Number(form.monthly_fees),
            nearby_landmarks: landmarksArr,
            parking: form.parking,
            pool: form.pool,
            sea_view: form.sea_view,
        });

        if (insertError) {
            setError(insertError.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    }

    const inputStyle = {
        padding: '12px 14px', background: 'var(--bg-darker)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%',
    };

    const labelStyle = {
        display: 'block', marginBottom: '6px', fontSize: '0.85rem',
        color: 'var(--text-muted)', fontWeight: 600 as const,
    };

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="add-property" />

            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.6rem' }}>
                        {isTR ? '➕ Yeni İlan Ekle' : '➕ Add New Listing'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        {isTR ? 'İlanınız incelendikten sonra yayınlanacaktır.' : 'Your listing will be published after review.'}
                    </p>

                    {!user && (
                        <div style={{
                            padding: '20px', background: 'rgba(245,158,11,0.1)',
                            border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-lg)',
                            marginBottom: '24px', textAlign: 'center',
                        }}>
                            <p style={{ color: '#f59e0b', marginBottom: '12px' }}>
                                {isTR ? '⚠️ İlan eklemek için giriş yapmanız gerekiyor.' : '⚠️ You need to log in to add a listing.'}
                            </p>
                            <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
                                {isTR ? 'Giriş Yap' : 'Login'}
                            </button>
                        </div>
                    )}

                    {success ? (
                        <div style={{
                            padding: '40px', background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-lg)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                            <h2 style={{ color: '#10b981', marginBottom: '8px' }}>
                                {isTR ? 'İlanınız Gönderildi!' : 'Listing Submitted!'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                {isTR ? 'İncelendikten sonra yayınlanacaktır.' : 'It will be published after review.'}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <a href="/properties" className="btn btn-primary">{isTR ? 'İlanları Gör' : 'View Listings'}</a>
                                <button className="btn btn-outline" onClick={() => { setSuccess(false); setForm({ title_tr: '', title_en: '', description_tr: '', description_en: '', type: 'rent', price: '', city: 'Lefkoşa', district: '', bedrooms: '1', bathrooms: '1', area_sqm: '', furnished: false, features: '', deposit_amount: '1', contract_type: 'yearly', title_deed_type: 'turkish', bills_included: false, available_now: true, monthly_fees: '0', nearby_landmarks: '', parking: false, pool: false, sea_view: false }); }}>
                                    {isTR ? 'Yeni İlan Ekle' : 'Add Another'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '28px',
                            display: 'flex', flexDirection: 'column', gap: '20px',
                        }}>
                            {/* Type */}
                            <div>
                                <label style={labelStyle}>{isTR ? 'İlan Türü' : 'Listing Type'}</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button type="button" className={`btn ${form.type === 'rent' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => updateForm('type', 'rent')} style={{ flex: 1 }}>
                                        🔑 {isTR ? 'Kiralık' : 'Rent'}
                                    </button>
                                    <button type="button" className={`btn ${form.type === 'sale' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => updateForm('type', 'sale')} style={{ flex: 1 }}>
                                        🏠 {isTR ? 'Satılık' : 'Sale'}
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Başlık (TR) *</label>
                                    <input type="text" required value={form.title_tr} onChange={e => updateForm('title_tr', e.target.value)} placeholder="Gönyeli 2+1 Daire" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Title (EN)</label>
                                    <input type="text" value={form.title_en} onChange={e => updateForm('title_en', e.target.value)} placeholder="Gönyeli 2+1 Apartment" style={inputStyle} />
                                </div>
                            </div>

                            {/* Price + City */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>{isTR ? 'Fiyat (£)' : 'Price (£)'} *</label>
                                    <input type="number" required min="1" value={form.price} onChange={e => updateForm('price', e.target.value)} placeholder={form.type === 'rent' ? '500' : '150000'} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>{isTR ? 'Şehir' : 'City'} *</label>
                                    <select value={form.city} onChange={e => updateForm('city', e.target.value)} style={inputStyle}>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>{isTR ? 'Bölge' : 'District'}</label>
                                    <input type="text" value={form.district} onChange={e => updateForm('district', e.target.value)} placeholder="Gönyeli" style={inputStyle} />
                                </div>
                            </div>

                            {/* Specs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>🛏️ {isTR ? 'Oda' : 'Beds'}</label>
                                    <select value={form.bedrooms} onChange={e => updateForm('bedrooms', e.target.value)} style={inputStyle}>
                                        {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>🚿 {isTR ? 'Banyo' : 'Baths'}</label>
                                    <select value={form.bathrooms} onChange={e => updateForm('bathrooms', e.target.value)} style={inputStyle}>
                                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>📐 m²</label>
                                    <input type="number" min="10" value={form.area_sqm} onChange={e => updateForm('area_sqm', e.target.value)} placeholder="85" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                        <input type="checkbox" checked={form.furnished} onChange={e => updateForm('furnished', e.target.checked)} />
                                        {isTR ? 'Eşyalı' : 'Furnished'}
                                    </label>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label style={labelStyle}>{isTR ? 'Açıklama (TR)' : 'Description (TR)'}</label>
                                <textarea rows={3} value={form.description_tr} onChange={e => updateForm('description_tr', e.target.value)}
                                    placeholder={isTR ? 'Mülk hakkında detaylar...' : 'Property details in Turkish...'} style={{ ...inputStyle, resize: 'vertical' as const }} />
                            </div>

                            {/* Features */}
                            <div>
                                <label style={labelStyle}>{isTR ? 'Özellikler (virgülle ayır)' : 'Features (comma separated)'}</label>
                                <input type="text" value={form.features} onChange={e => updateForm('features', e.target.value)}
                                    placeholder="Klima, Otopark, Havuz, Wi-Fi" style={inputStyle} />
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label style={labelStyle}>📷 {isTR ? 'Fotoğraflar (max 8)' : 'Photos (max 8)'}</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)',
                                        padding: '24px', textAlign: 'center', cursor: 'pointer',
                                        background: 'rgba(14,165,233,0.03)', transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {isTR ? 'Tıklayın veya fotoğraf sürükleyin' : 'Click or drag photos here'}
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                                        JPG, PNG, WebP — max 5MB
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []).slice(0, 8 - photos.length);
                                        if (files.length === 0) return;
                                        setPhotos(prev => [...prev, ...files].slice(0, 8));
                                        const newPreviews = files.map(f => URL.createObjectURL(f));
                                        setPhotoPreviews(prev => [...prev, ...newPreviews].slice(0, 8));
                                        e.target.value = '';
                                    }}
                                />
                                {photoPreviews.length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                                        {photoPreviews.map((src, i) => (
                                            <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                                <img src={src} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" onClick={() => {
                                                    setPhotos(prev => prev.filter((_, idx) => idx !== i));
                                                    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
                                                }} style={{
                                                    position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px',
                                                    background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', borderRadius: '50%',
                                                    fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* KKTC-Specific: Rental Fields */}
                            {form.type === 'rent' && (
                                <>
                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '4px' }}>
                                        <label style={{ ...labelStyle, fontSize: '0.95rem', color: 'var(--primary-light)', marginBottom: '16px' }}>
                                            🔑 {isTR ? 'Kiralık Detayları' : 'Rental Details'}
                                        </label>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Depozito (kira sayısı)' : 'Deposit (months)'}</label>
                                            <select value={form.deposit_amount} onChange={e => updateForm('deposit_amount', e.target.value)} style={inputStyle}>
                                                <option value="0">{isTR ? 'Yok' : 'None'}</option>
                                                <option value="1">1 {isTR ? 'kira' : 'month'}</option>
                                                <option value="2">2 {isTR ? 'kira' : 'months'}</option>
                                                <option value="3">3 {isTR ? 'kira' : 'months'}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Sözleşme Süresi' : 'Contract Type'}</label>
                                            <select value={form.contract_type} onChange={e => updateForm('contract_type', e.target.value)} style={inputStyle}>
                                                <option value="monthly">{isTR ? 'Aylık' : 'Monthly'}</option>
                                                <option value="sixmonth">{isTR ? '6 Ay' : '6 Months'}</option>
                                                <option value="yearly">{isTR ? 'Yıllık' : 'Yearly'}</option>
                                                <option value="flexible">{isTR ? 'Esnek' : 'Flexible'}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Aylık Aidat (£)' : 'Monthly Fees (£)'}</label>
                                            <input type="number" min="0" value={form.monthly_fees} onChange={e => updateForm('monthly_fees', e.target.value)} placeholder="50" style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                            <input type="checkbox" checked={form.bills_included} onChange={e => updateForm('bills_included', e.target.checked)} />
                                            💡 {isTR ? 'Faturalar Dahil' : 'Bills Included'}
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                            <input type="checkbox" checked={form.available_now} onChange={e => updateForm('available_now', e.target.checked)} />
                                            🟢 {isTR ? 'Hemen Müsait' : 'Available Now'}
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* Title Deed - for sale */}
                            {form.type === 'sale' && (
                                <div>
                                    <label style={labelStyle}>{isTR ? 'Tapu Türü' : 'Title Deed Type'} *</label>
                                    <select value={form.title_deed_type} onChange={e => updateForm('title_deed_type', e.target.value)} style={inputStyle}>
                                        <option value="turkish">{isTR ? 'Türk Koçanı' : 'Turkish Title'}</option>
                                        <option value="equivalent">{isTR ? 'Eşdeğer Koçan' : 'Equivalent Title'}</option>
                                        <option value="allocation">{isTR ? 'Tahsis' : 'Allocation'}</option>
                                        <option value="foreign">{isTR ? 'Yabancı Koçan' : 'Foreign Title'}</option>
                                        <option value="unknown">{isTR ? 'Bilinmiyor' : 'Unknown'}</option>
                                    </select>
                                </div>
                            )}

                            {/* Extras */}
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                    <input type="checkbox" checked={form.parking} onChange={e => updateForm('parking', e.target.checked)} />
                                    🅿️ {isTR ? 'Otopark' : 'Parking'}
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                    <input type="checkbox" checked={form.pool} onChange={e => updateForm('pool', e.target.checked)} />
                                    🏊 {isTR ? 'Havuz' : 'Pool'}
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                    <input type="checkbox" checked={form.sea_view} onChange={e => updateForm('sea_view', e.target.checked)} />
                                    🌊 {isTR ? 'Deniz Manzarası' : 'Sea View'}
                                </label>
                            </div>

                            {/* Nearby */}
                            <div>
                                <label style={labelStyle}>{isTR ? 'Yakın Noktalar (virgülle ayır)' : 'Nearby Landmarks (comma separated)'}</label>
                                <input type="text" value={form.nearby_landmarks} onChange={e => updateForm('nearby_landmarks', e.target.value)}
                                    placeholder={isTR ? 'YDÜ 5dk, Market 2dk, Hastane 10dk' : 'NEU 5min, Market 2min, Hospital 10min'} style={inputStyle} />
                            </div>

                            {error && (
                                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.85rem' }}>
                                    ❌ {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading || !user} className="btn btn-primary btn-lg" style={{ opacity: (loading || !user) ? 0.5 : 1 }}>
                                {loading ? (uploadProgress || '⏳...') : isTR ? '📤 İlanı Gönder' : '📤 Submit Listing'}
                            </button>
                        </form>
                    )}
                </div>
            </main>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} locale={locale} />
            <ChatbotWidget locale={locale} />
        </div>
    );
}
