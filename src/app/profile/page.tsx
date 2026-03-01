'use client';

import { useState, useEffect } from 'react';
import { type Locale, t } from '@/i18n/translations';
import { getCurrentUser, signOut, onAuthChange } from '@/lib/auth';
import { supabase, type Property } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';
import '../properties/properties.css';

export default function ProfilePage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
    const [myListings, setMyListings] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, views: 0 });

    useEffect(() => {
        getCurrentUser().then(u => {
            setUser(u as typeof user);
            if (u) loadMyListings(u.id);
        });
        const { data: { subscription } } = onAuthChange((u) => {
            setUser(u as typeof user);
            if (u) loadMyListings((u as { id: string }).id);
        });
        return () => subscription.unsubscribe();
    }, []);

    async function loadMyListings(userId: string) {
        setLoading(true);
        const { data } = await supabase
            .from('properties')
            .select('*')
            .eq('agent_id', userId)
            .order('created_at', { ascending: false });
        const listings = (data as Property[]) || [];
        setMyListings(listings);
        setStats({
            total: listings.length,
            active: listings.filter(l => l.status === 'active').length,
            pending: listings.filter(l => l.status === 'pending').length,
            views: listings.reduce((sum, l) => sum + (l.views_count || 0), 0),
        });
        setLoading(false);
    }

    const isTR = locale === 'tr';

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
                <Navbar locale={locale} onLocaleChange={setLocale} />
                <div style={{ padding: '200px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {isTR ? 'Giriş Yapın' : 'Please Log In'}
                    </h2>
                    <p>{isTR ? 'Profilinizi görüntülemek için giriş yapın.' : 'Log in to view your profile.'}</p>
                    <a href="/properties" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
                        ← {isTR ? 'İlanlara Dön' : 'Back to Listings'}
                    </a>
                </div>
            </div>
        );
    }

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar locale={locale} onLocaleChange={setLocale} />

            <main className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* Profile Header */}
                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: '32px',
                        display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px',
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'var(--gradient-primary)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                        }}>{initials}</div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '4px' }}>
                                {userName}
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                                    background: 'rgba(14,165,233,0.15)', color: '#0ea5e9',
                                }}>{isTR ? 'Ücretsiz Plan' : 'Free Plan'}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <a href="/add-property" className="btn btn-primary btn-sm">
                                ➕ {isTR ? 'İlan Ekle' : 'Add Listing'}
                            </a>
                            <button className="btn btn-outline btn-sm" onClick={async () => { await signOut(); setUser(null); }}>
                                🚪 {isTR ? 'Çıkış' : 'Logout'}
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px',
                    }}>
                        {[
                            { icon: '📋', label: isTR ? 'Toplam İlan' : 'Total Listings', value: stats.total },
                            { icon: '✅', label: isTR ? 'Aktif' : 'Active', value: stats.active },
                            { icon: '⏳', label: isTR ? 'Beklemede' : 'Pending', value: stats.pending },
                            { icon: '👁️', label: isTR ? 'Görüntüleme' : 'Views', value: stats.views },
                        ].map((s, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* My Listings */}
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '16px' }}>
                        📋 {isTR ? 'İlanlarım' : 'My Listings'}
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳</div>
                    ) : myListings.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '60px', color: 'var(--text-muted)',
                            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏡</div>
                            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                                {isTR ? 'Henüz ilanınız yok' : 'No listings yet'}
                            </p>
                            <a href="/add-property" className="btn btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>
                                ➕ {isTR ? 'İlk İlanınızı Ekleyin' : 'Add Your First Listing'}
                            </a>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {myListings.map(p => (
                                <div key={p.id} style={{
                                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)', padding: '16px',
                                    display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '16px',
                                    alignItems: 'center', transition: 'border-color 0.15s',
                                }}>
                                    <a href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            width: '80px', height: '60px', borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden', background: 'var(--bg-darker)',
                                        }}>
                                            {p.photos?.[0] ? (
                                                <img src={p.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.5rem' }}>🏠</div>
                                            )}
                                        </div>
                                    </a>
                                    <a href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                                            {p.title_tr || p.title_en}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            📍 {p.district}, {p.city} · 🛏️ {p.bedrooms} · £{p.price.toLocaleString()}{p.type === 'rent' ? '/mo' : ''}
                                        </div>
                                    </a>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600,
                                            background: p.status === 'active' ? 'rgba(16,185,129,0.15)' : p.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                            color: p.status === 'active' ? '#10b981' : p.status === 'pending' ? '#f59e0b' : '#ef4444',
                                        }}>
                                            {p.status === 'active' ? '✅ ' : p.status === 'pending' ? '⏳ ' : '❌ '}
                                            {p.status}
                                        </span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <a
                                                href={`/add-property?edit=${p.id}`}
                                                style={{
                                                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                                                    background: 'rgba(27,107,147,0.1)', color: 'var(--primary)',
                                                    border: '1px solid rgba(27,107,147,0.2)', textDecoration: 'none',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                ✏️ {isTR ? 'Düzenle' : 'Edit'}
                                            </a>
                                            <button
                                                onClick={async () => {
                                                    if (confirm(isTR ? 'Bu ilanı silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this listing?')) {
                                                        await supabase.from('properties').delete().eq('id', p.id);
                                                        if (user) loadMyListings(user.id);
                                                    }
                                                }}
                                                style={{
                                                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                                                    background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                                    border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                🗑️ {isTR ? 'Sil' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upgrade CTA */}
                    <div style={{
                        background: 'var(--gradient-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: '24px', marginTop: '32px',
                        textAlign: 'center',
                    }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                            ⭐ {isTR ? 'Pro Plana Yükselt' : 'Upgrade to Pro'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                            {isTR
                                ? '20 ilan, analitik, WhatsApp entegrasyonu ve öncelikli sıralama.'
                                : '20 listings, analytics, WhatsApp integration, and priority ranking.'}
                        </p>
                        <button className="btn btn-primary" style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                            🔜 {isTR ? 'Yakında' : 'Coming Soon'} — £25/mo
                        </button>
                    </div>
                </div>
            </main>
            <ChatbotWidget locale={locale} />
        </div>
    );
}
