'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { type Locale, t } from '@/i18n/translations';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { uploadPropertyPhoto } from '@/lib/storage';
import AuthModal from '@/components/AuthModal';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';
import { useSearchParams } from 'next/navigation';
import '../properties/properties.css';

const cities = ['Lefkoşa', 'Girne', 'Gazimağusa', 'İskele', 'Güzelyurt', 'Lefke'];

const propertyTypeGroups = [
    {
        label: { tr: '🏠 Konut', en: '🏠 Residential' },
        types: [
            { value: 'apartment', tr: 'Daire', en: 'Apartment' },
            { value: 'villa', tr: 'Villa', en: 'Villa' },
            { value: 'detached', tr: 'Müstakil Ev', en: 'Detached' },
            { value: 'penthouse', tr: 'Penthouse', en: 'Penthouse' },
            { value: 'studio', tr: 'Stüdyo', en: 'Studio' },
            { value: 'duplex', tr: 'Dubleks', en: 'Duplex' },
        ],
    },
    {
        label: { tr: '🏪 Ticari', en: '🏪 Commercial' },
        types: [
            { value: 'shop', tr: 'Dükkan', en: 'Shop' },
            { value: 'office', tr: 'Ofis', en: 'Office' },
            { value: 'warehouse', tr: 'Depo', en: 'Warehouse' },
        ],
    },
    {
        label: { tr: '🌍 Arsa', en: '🌍 Land' },
        types: [
            { value: 'residential_land', tr: 'Konut Arsası', en: 'Residential Land' },
            { value: 'commercial_land', tr: 'Ticari Arsa', en: 'Commercial Land' },
            { value: 'farmland', tr: 'Tarla', en: 'Farmland' },
        ],
    },
];

const isLandType = (t: string) => ['residential_land', 'commercial_land', 'farmland'].includes(t);

const roomConfigs = ['1+0', '1+1', '2+1', '2+2', '3+1', '3+2', '4+1', '4+2', '5+1', '5+2', '6+'];
const currencies = [
    { value: 'GBP', symbol: '£', label: 'STG (£)' },
    { value: 'TRY', symbol: '₺', label: 'TL (₺)' },
];

const featureGroups = {
    tr: [
        { label: '🏠 Genel', items: ['Klima', 'Wi-Fi', 'Eşyalı', 'Güvenlik/Kamera', 'Asansör', 'Jeneratör', 'Güneş Paneli', 'Akıllı Ev'] },
        { label: '🍳 Mutfak', items: ['Bulaşık Makinesi', 'Çamaşır Makinesi', 'Kurutma Makinesi', 'Fırın/Ocak', 'Buzdolabı', 'Ankastre Mutfak'] },
        { label: '🌿 Dış Alan', items: ['Bahçe', 'Teras/Balkon', 'Barbekü', 'Havuz', 'Otopark', 'Garaj', 'Çocuk Oyun Alanı'] },
        { label: '📍 Konum', items: ['Deniz Manzarası', 'Dağ Manzarası', 'Merkeze Yakın', 'Üniversiteye Yakın', 'Sahile Yakın'] },
        { label: '🔥 Isıtma/Enerji', items: ['Merkezi Isıtma', 'Yerden Isıtma', 'Şömine', 'Güneş Enerjisi'] },
        { label: '🏗️ Bina', items: ['Yeni Bina', 'Site İçi', 'Rezidans', 'Çatı Katı'] },
    ],
    en: [
        { label: '🏠 General', items: ['Klima', 'Wi-Fi', 'Eşyalı', 'Güvenlik/Kamera', 'Asansör', 'Jeneratör', 'Güneş Paneli', 'Akıllı Ev'] },
        { label: '🍳 Kitchen', items: ['Bulaşık Makinesi', 'Çamaşır Makinesi', 'Kurutma Makinesi', 'Fırın/Ocak', 'Buzdolabı', 'Ankastre Mutfak'] },
        { label: '🌿 Outdoor', items: ['Bahçe', 'Teras/Balkon', 'Barbekü', 'Havuz', 'Otopark', 'Garaj', 'Çocuk Oyun Alanı'] },
        { label: '📍 Location', items: ['Deniz Manzarası', 'Dağ Manzarası', 'Merkeze Yakın', 'Üniversiteye Yakın', 'Sahile Yakın'] },
        { label: '🔥 Heating/Energy', items: ['Merkezi Isıtma', 'Yerden Isıtma', 'Şömine', 'Güneş Enerjisi'] },
        { label: '🏗️ Building', items: ['Yeni Bina', 'Site İçi', 'Rezidans', 'Çatı Katı'] },
    ],
};

const nearbyOptions = [
    'Üniversite', 'Market/Süpermarket', 'Hastane', 'Eczane', 'Okul',
    'Otobüs Durağı', 'Cami', 'Park', 'Sahil/Plaj', 'Restoran',
    'AVM/Alışveriş', 'Banka/ATM', 'Benzin İstasyonu', 'Spor Salonu',
];

function AddPropertyContent() {
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const [locale, setLocale] = useState<Locale>('tr');
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [showAuth, setShowAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState('');
    const [step, setStep] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultForm = {
        title_tr: '', title_en: '',
        description_tr: '', description_en: '',
        type: 'rent' as 'rent' | 'sale',
        property_type: 'apartment',
        room_config: '2+1',
        price: '',
        currency: 'GBP',
        city: 'Lefkoşa',
        district: '',
        bedrooms: '2', bathrooms: '1', area_sqm: '',
        furnished: false,
        features: [] as string[],
        // KKTC fields
        deposit_amount: '1',
        contract_type: 'yearly' as string,
        title_deed_type: 'turkish' as string,
        bills_included: false,
        available_now: true,
        monthly_fees: '0',
        nearby_landmarks: [] as string[],
        parking: false,
        pool: false,
        sea_view: false,
        // New fields
        floor: '',
        total_floors: '',
        building_age: '',
        owner_type: 'owner' as 'owner' | 'agent',
        whatsapp: '',
        phone: '',
        telegram: '',
        property_condition: 'secondhand' as string,
    };

    const [form, setForm] = useState(defaultForm);
    const isTR = locale === 'tr';

    useEffect(() => {
        getCurrentUser().then(u => {
            setUser(u as { id: string; email?: string } | null);
            if (u && editId) loadPropertyForEdit(editId);
        });
        const { data: { subscription } } = onAuthChange((u) => setUser(u as { id: string; email?: string } | null));
        return () => subscription.unsubscribe();
    }, []);

    async function loadPropertyForEdit(id: string) {
        const { data } = await supabase.from('properties').select('*').eq('id', id).single();
        if (data) {
            setForm({
                title_tr: data.title_tr || '', title_en: data.title_en || '',
                description_tr: data.description_tr || '', description_en: data.description_en || '',
                type: data.type || 'rent',
                property_type: data.property_type || 'apartment',
                room_config: data.room_config || '2+1',
                price: String(data.price || ''),
                currency: data.currency || 'GBP',
                city: data.city || 'Lefkoşa',
                district: data.district || '',
                bedrooms: String(data.bedrooms || '2'), bathrooms: String(data.bathrooms || '1'),
                area_sqm: String(data.area_sqm || ''),
                furnished: data.furnished || false,
                features: data.features || [],
                deposit_amount: String(data.deposit_amount || '1'),
                contract_type: data.contract_type || 'yearly',
                title_deed_type: data.title_deed_type || 'turkish',
                bills_included: data.bills_included || false,
                available_now: data.available_now ?? true,
                monthly_fees: String(data.monthly_fees || '0'),
                nearby_landmarks: data.nearby_landmarks || [],
                parking: data.parking || false,
                pool: data.pool || false,
                sea_view: data.sea_view || false,
                floor: String(data.floor || ''),
                total_floors: String(data.total_floors || ''),
                building_age: String(data.building_age || ''),
                owner_type: data.owner_type || 'owner',
                whatsapp: data.whatsapp || '',
                phone: data.phone || '',
                telegram: data.telegram || '',
                property_condition: data.property_condition || 'secondhand',
            });
            if (data.photos && data.photos.length > 0) {
                setPhotoPreviews(data.photos);
            }
        }
    }

    function updateForm(field: string, value: string | boolean | string[]) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function toggleFeature(item: string) {
        setForm(prev => ({
            ...prev,
            features: prev.features.includes(item)
                ? prev.features.filter(f => f !== item)
                : [...prev.features, item],
        }));
    }

    function toggleLandmark(item: string) {
        setForm(prev => ({
            ...prev,
            nearby_landmarks: prev.nearby_landmarks.includes(item)
                ? prev.nearby_landmarks.filter(l => l !== item)
                : [...prev.nearby_landmarks, item],
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) { setShowAuth(true); return; }
        setLoading(true);
        setError('');

        if (!form.phone && !form.whatsapp && !form.telegram) {
            setError(isTR ? 'En az bir iletişim bilgisi gerekli (Telefon, WhatsApp veya Telegram)' : 'At least one contact method required (Phone, WhatsApp or Telegram)');
            setLoading(false);
            return;
        }

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

        const propertyData = {
            title_tr: form.title_tr,
            title_en: form.title_en || form.title_tr,
            description_tr: form.description_tr,
            description_en: form.description_en || form.description_tr,
            type: form.type,
            property_type: form.property_type,
            room_config: form.room_config,
            status: 'active',
            price: Number(form.price),
            currency: form.currency,
            city: form.city,
            district: form.district,
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            area_sqm: Number(form.area_sqm),
            furnished: form.furnished,
            features: form.features,
            photos: photoUrls.length > 0 ? photoUrls : (editId ? photoPreviews : []),
            deposit_amount: Number(form.deposit_amount),
            contract_type: form.contract_type,
            title_deed_type: form.title_deed_type,
            bills_included: form.bills_included,
            available_now: form.available_now,
            monthly_fees: Number(form.monthly_fees),
            nearby_landmarks: form.nearby_landmarks,
            parking: form.parking,
            pool: form.pool,
            sea_view: form.sea_view,
            floor: form.floor ? Number(form.floor) : null,
            total_floors: form.total_floors ? Number(form.total_floors) : null,
            building_age: form.building_age || null,
            owner_type: form.owner_type,
            whatsapp: form.whatsapp || null,
            phone: form.phone || null,
            telegram: form.telegram || null,
            property_condition: form.property_condition,
        };

        let insertError;
        if (editId) {
            const { error } = await supabase.from('properties').update(propertyData).eq('id', editId);
            insertError = error;
        } else {
            const { error } = await supabase.from('properties').insert({ ...propertyData, user_id: user.id, cyprusnest_score: null, views_count: 0 });
            insertError = error;
        }

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
        display: 'block' as const, marginBottom: '6px', fontSize: '0.85rem',
        color: 'var(--text-muted)', fontWeight: 600 as const,
    };

    const sectionStyle = {
        borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '8px',
    };

    const sectionTitleStyle = {
        ...labelStyle, fontSize: '0.95rem', color: 'var(--primary-light)', marginBottom: '16px',
    };

    const tagStyle = (selected: boolean) => ({
        padding: '7px 16px', borderRadius: '20px', fontSize: '0.82rem',
        border: selected ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
        background: selected ? 'rgba(14,165,233,0.15)' : 'var(--bg-darker)',
        color: selected ? 'var(--primary-light)' : 'var(--text-muted)',
        cursor: 'pointer' as const, transition: 'all 0.15s',
        fontWeight: (selected ? 600 : 400) as number,
    });

    const currencySymbol = currencies.find(c => c.value === form.currency)?.symbol || '£';

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="add-property" />

            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '720px' }}>
                    <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.6rem' }}>
                        {editId ? (isTR ? '✏️ İlanı Düzenle' : '✏️ Edit Listing') : (isTR ? '➕ Yeni İlan Ekle' : '➕ Add New Listing')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        {isTR ? 'İlanınız hemen yayınlanacaktır.' : 'Your listing will be published immediately.'}
                    </p>

                    {/* Progress Bar */}
                    {!success && user && (
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px' }}>
                            {[
                                { n: 1, icon: '📋', tr: 'Temel', en: 'Basics' },
                                { n: 2, icon: '🏠', tr: 'Detay', en: 'Details' },
                                { n: 3, icon: '✨', tr: 'Özellikler', en: 'Features' },
                                { n: 4, icon: '📸', tr: 'Medya', en: 'Media' },
                            ].map(s => (
                                <button key={s.n} type="button" onClick={() => setStep(s.n)}
                                    style={{
                                        flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-md)',
                                        border: step === s.n ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        background: step === s.n ? 'rgba(14,165,233,0.1)' : s.n < step ? 'rgba(16,185,129,0.08)' : 'var(--bg-darker)',
                                        color: step === s.n ? 'var(--primary-light)' : s.n < step ? '#10b981' : 'var(--text-muted)',
                                        cursor: 'pointer', fontSize: '0.78rem', fontWeight: step === s.n ? 700 : 500,
                                        transition: 'all 0.2s', textAlign: 'center',
                                    }}
                                >
                                    <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{s.n < step ? '✅' : s.icon}</div>
                                    {isTR ? s.tr : s.en}
                                </button>
                            ))}
                        </div>
                    )}

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
                            textAlign: 'center', padding: '48px', background: 'var(--bg-card)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                            <h2 style={{ color: '#10b981', marginBottom: '8px' }}>
                                {isTR ? 'İlanınız Yayınlandı!' : 'Listing Published!'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                {isTR ? 'İlanınız hemen canlıya alındı.' : 'Your listing is now live.'}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <a href="/properties" className="btn btn-primary">{isTR ? 'İlanları Gör' : 'View Listings'}</a>
                                <button className="btn btn-outline" onClick={() => { setSuccess(false); setForm(defaultForm); setPhotos([]); setPhotoPreviews([]); }}>
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
                            {/* ===== STEP 1: Temel Bilgiler ===== */}
                            {step === 1 && (<>
                                {/* Type */}
                                <div>
                                    <label style={labelStyle}>{isTR ? 'İlan Türü' : 'Listing Type'} *</label>
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

                                {/* Property Type - Grouped */}
                                <div>
                                    <label style={labelStyle}>{isTR ? 'Mülk Tipi' : 'Property Type'} *</label>
                                    {propertyTypeGroups.map(group => (
                                        <div key={isTR ? group.label.tr : group.label.en} style={{ marginBottom: '10px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                                                {isTR ? group.label.tr : group.label.en}
                                            </span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {group.types.map(pt => (
                                                    <button key={pt.value} type="button" onClick={() => updateForm('property_type', pt.value)}
                                                        style={tagStyle(form.property_type === pt.value)}>
                                                        {isTR ? pt.tr : pt.en}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
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

                                {/* Price + Currency + City + District */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={labelStyle}>{isTR ? `Fiyat (${currencySymbol})` : `Price (${currencySymbol})`} *</label>
                                        <input type="number" required min="1" value={form.price} onChange={e => updateForm('price', e.target.value)} placeholder={form.type === 'rent' ? '500' : '150000'} style={inputStyle} />
                                    </div>
                                    <div style={{ minWidth: '100px' }}>
                                        <label style={labelStyle}>{isTR ? 'Birim' : 'Curr.'}</label>
                                        <select value={form.currency} onChange={e => updateForm('currency', e.target.value)} style={inputStyle}>
                                            {currencies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                        </select>
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

                                {/* Step 1 Navigation */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)} style={{ minWidth: '140px' }}>
                                        {isTR ? 'İleri →' : 'Next →'}
                                    </button>
                                </div>
                            </>)}

                            {/* ===== STEP 2: Detaylar ===== */}
                            {step === 2 && (<>
                                {/* Room Config + Specs */}
                                {form.property_type !== 'land' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Oda' : 'Rooms'} *</label>
                                            <select value={form.room_config} onChange={e => {
                                                updateForm('room_config', e.target.value);
                                                const bed = e.target.value.split('+')[0];
                                                updateForm('bedrooms', bed === '6' ? '6' : bed);
                                            }} style={inputStyle}>
                                                {roomConfigs.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>🚿 {isTR ? 'Banyo' : 'Baths'}</label>
                                            <select value={form.bathrooms} onChange={e => updateForm('bathrooms', e.target.value)} style={inputStyle}>
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
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
                                )}

                                {/* Floor + Building Age (optional) */}
                                {form.property_type !== 'land' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Bulunduğu Kat' : 'Floor'}</label>
                                            <input type="number" min="0" value={form.floor} onChange={e => updateForm('floor', e.target.value)} placeholder="3" style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Toplam Kat' : 'Total Floors'}</label>
                                            <input type="number" min="1" value={form.total_floors} onChange={e => updateForm('total_floors', e.target.value)} placeholder="5" style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Bina Yaşı' : 'Building Age'}</label>
                                            <select value={form.building_age} onChange={e => updateForm('building_age', e.target.value)} style={inputStyle}>
                                                <option value="">{isTR ? 'Seçin' : 'Select'}</option>
                                                <option value="0-1">0-1</option>
                                                <option value="1-5">1-5</option>
                                                <option value="5-10">5-10</option>
                                                <option value="10-20">10-20</option>
                                                <option value="20+">20+</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'Durumu' : 'Condition'}</label>
                                            <select value={form.property_condition} onChange={e => updateForm('property_condition', e.target.value)} style={inputStyle}>
                                                <option value="new">{isTR ? 'Sıfır' : 'New'}</option>
                                                <option value="secondhand">{isTR ? 'İkinci El' : 'Second Hand'}</option>
                                                <option value="offplan">{isTR ? 'Projeden' : 'Off-plan'}</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2 Navigation */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ minWidth: '140px' }}>
                                        {isTR ? '← Geri' : '← Back'}
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(3)} style={{ minWidth: '140px' }}>
                                        {isTR ? 'İleri →' : 'Next →'}
                                    </button>
                                </div>
                            </>)}

                            {/* ===== STEP 3: Özellikler & Açıklama ===== */}
                            {step === 3 && (<>
                                {/* Description */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={labelStyle}>{isTR ? 'Açıklama (TR)' : 'Description (TR)'}</label>
                                        <textarea rows={3} value={form.description_tr} onChange={e => updateForm('description_tr', e.target.value)}
                                            placeholder={isTR ? 'Mülk hakkında detaylar...' : 'Property details in Turkish...'} style={{ ...inputStyle, resize: 'vertical' as const }} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>{isTR ? 'Açıklama (EN)' : 'Description (EN)'}</label>
                                        <textarea rows={3} value={form.description_en} onChange={e => updateForm('description_en', e.target.value)}
                                            placeholder="Property details in English..." style={{ ...inputStyle, resize: 'vertical' as const }} />
                                    </div>
                                </div>

                                {/* Features - Selectable Tags */}
                                <div style={sectionStyle}>
                                    <label style={sectionTitleStyle}>✨ {isTR ? 'Özellikler' : 'Features'}</label>
                                    {(isTR ? featureGroups.tr : featureGroups.en).map(group => (
                                        <div key={group.label} style={{ marginBottom: '14px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{group.label}</span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {group.items.map(item => (
                                                    <button key={item} type="button" onClick={() => toggleFeature(item)} style={tagStyle(form.features.includes(item))}>
                                                        {form.features.includes(item) ? '✓ ' : ''}{item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Nearby - Selectable Tags */}
                                <div>
                                    <label style={sectionTitleStyle}>📍 {isTR ? 'Yakın Noktalar' : 'Nearby Landmarks'}</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {nearbyOptions.map(item => (
                                            <button key={item} type="button" onClick={() => toggleLandmark(item)} style={tagStyle(form.nearby_landmarks.includes(item))}>
                                                {form.nearby_landmarks.includes(item) ? '✓ ' : ''}{item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 3 Navigation */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)} style={{ minWidth: '140px' }}>
                                        {isTR ? '← Geri' : '← Back'}
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(4)} style={{ minWidth: '140px' }}>
                                        {isTR ? 'İleri →' : 'Next →'}
                                    </button>
                                </div>
                            </>)}

                            {/* ===== STEP 4: Medya & İletişim ===== */}
                            {step === 4 && (<>
                                {/* Photo Upload */}
                                <div style={sectionStyle}>
                                    <label style={sectionTitleStyle}>📷 {isTR ? 'Fotoğraflar (max 20)' : 'Photos (max 20)'}</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const allFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
                                            const MAX_IMG = 10 * 1024 * 1024;
                                            const MAX_VID = 50 * 1024 * 1024;
                                            const validFiles = allFiles.filter(f => f.type.startsWith('video/') ? f.size <= MAX_VID : f.size <= MAX_IMG);
                                            if (validFiles.length < allFiles.length) {
                                                alert(isTR ? `${allFiles.length - validFiles.length} dosya 10MB limitini aşıyor.` : `${allFiles.length - validFiles.length} file(s) exceed 10MB limit.`);
                                            }
                                            const files = validFiles.slice(0, 20 - photos.length);
                                            if (files.length === 0) return;
                                            setPhotos(prev => [...prev, ...files].slice(0, 20));
                                            const newPreviews = files.map(f => URL.createObjectURL(f));
                                            setPhotoPreviews(prev => [...prev, ...newPreviews].slice(0, 20));
                                        }}
                                        style={{
                                            border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)',
                                            padding: '24px', textAlign: 'center', cursor: 'pointer',
                                            background: 'rgba(14,165,233,0.03)', transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷🎬</div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {isTR ? 'Fotoğraf ve Video sürükleyin veya tıklayın' : 'Drag & drop photos and videos or click'}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                                            {isTR ? 'Fotoğraf: JPG/PNG/WebP (max 10MB) — Video: MP4/MOV/WebM (max 50MB)' : 'Photos: JPG/PNG/WebP (max 10MB) — Videos: MP4/MOV/WebM (max 50MB)'}
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const MAX_IMG = 10 * 1024 * 1024;
                                            const MAX_VID = 50 * 1024 * 1024;
                                            const allFiles = Array.from(e.target.files || []);
                                            const validFiles = allFiles.filter(f => f.type.startsWith('video/') ? f.size <= MAX_VID : f.size <= MAX_IMG);
                                            if (validFiles.length < allFiles.length) {
                                                alert(isTR ? `${allFiles.length - validFiles.length} dosya limiti aşıyor.` : `${allFiles.length - validFiles.length} file(s) exceed size limit.`);
                                            }
                                            const files = validFiles.slice(0, 20 - photos.length);
                                            if (files.length === 0) return;
                                            setPhotos(prev => [...prev, ...files].slice(0, 20));
                                            const newPreviews = files.map(f => URL.createObjectURL(f));
                                            setPhotoPreviews(prev => [...prev, ...newPreviews].slice(0, 20));
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
                                        <div style={sectionStyle}>
                                            <label style={sectionTitleStyle}>
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
                                                <label style={labelStyle}>{isTR ? `Aylık Aidat (${currencySymbol})` : `Monthly Fees (${currencySymbol})`}</label>
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

                                <div style={sectionStyle}>
                                    <label style={sectionTitleStyle}>📞 {isTR ? 'İletişim Bilgileri' : 'Contact Info'} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({isTR ? 'en az 1 zorunlu' : 'min 1 required'})</span></label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                        <div>
                                            <label style={labelStyle}>{isTR ? 'İlan Sahibi' : 'Listed By'}</label>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button type="button" onClick={() => updateForm('owner_type', 'owner')}
                                                    style={{ ...tagStyle(form.owner_type === 'owner'), flex: 1, textAlign: 'center' as const }}>
                                                    👤 {isTR ? 'Sahibinden' : 'Owner'}
                                                </button>
                                                <button type="button" onClick={() => updateForm('owner_type', 'agent')}
                                                    style={{ ...tagStyle(form.owner_type === 'agent'), flex: 1, textAlign: 'center' as const }}>
                                                    🏢 {isTR ? 'Emlakçı' : 'Agent'}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>📱 {isTR ? 'Telefon' : 'Phone'}</label>
                                            <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+90 533 XXX XX XX" style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={labelStyle}>🟢 WhatsApp</label>
                                            <input type="tel" value={form.whatsapp} onChange={e => updateForm('whatsapp', e.target.value)} placeholder="+90 533 XXX XX XX" style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>✈️ Telegram</label>
                                            <input type="text" value={form.telegram} onChange={e => updateForm('telegram', e.target.value)} placeholder="@kullaniciadi" style={inputStyle} />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.85rem' }}>
                                        ❌ {error}
                                    </div>
                                )}

                                <button type="submit" disabled={loading || !user} className="btn btn-primary btn-lg" style={{ opacity: (loading || !user) ? 0.5 : 1 }}>
                                    {loading ? (uploadProgress || '⏳...') : editId ? (isTR ? '✅ İlanı Güncelle' : '✅ Update Listing') : (isTR ? '📤 İlanı Yayınla' : '📤 Publish Listing')}
                                </button>

                                {/* Step 4 Back button */}
                                <button type="button" className="btn btn-outline" onClick={() => setStep(3)} style={{ marginTop: '8px' }}>
                                    {isTR ? '← Geri' : '← Back'}
                                </button>
                            </>)}
                        </form>
                    )}
                </div>
            </main>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} locale={locale} />
            <ChatbotWidget locale={locale} />
        </div>
    );
}

export default function AddPropertyPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>Yükleniyor...</div>}>
            <AddPropertyContent />
        </Suspense>
    );
}
