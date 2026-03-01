'use client';

import { useState, useEffect } from 'react';
import { type Locale, t } from '@/i18n/translations';
import { getCurrentUser, signOut, onAuthChange } from '@/lib/auth';
import { supabase, type Property } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';
import '../properties/properties.css';

type ProfileTab = 'listings' | 'favorites' | 'settings';

export default function ProfilePage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string }; created_at?: string } | null>(null);
    const [myListings, setMyListings] = useState<Property[]>([]);
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, views: 0 });
    const [tab, setTab] = useState<ProfileTab>('listings');

    useEffect(() => {
        getCurrentUser().then(u => {
            setUser(u as typeof user);
            if (u) {
                loadMyListings(u.id);
                loadFavorites();
            }
        });
        const { data: { subscription } } = onAuthChange((u) => {
            setUser(u as typeof user);
            if (u) {
                loadMyListings((u as { id: string }).id);
                loadFavorites();
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    async function loadMyListings(userId: string) {
        setLoading(true);
        const { data } = await supabase
            .from('properties')
            .select('*')
            .eq('user_id', userId)
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

    async function loadFavorites() {
        const favIds = JSON.parse(localStorage.getItem('evlek_favs') || '[]');
        if (favIds.length === 0) {
            setFavorites([]);
            return;
        }
        const { data } = await supabase.from('properties').select('*').in('id', favIds);
        setFavorites((data as Property[]) || []);
    }

    function removeFavorite(id: string) {
        const favIds = JSON.parse(localStorage.getItem('evlek_favs') || '[]');
        const updated = favIds.filter((f: string) => f !== id);
        localStorage.setItem('evlek_favs', JSON.stringify(updated));
        setFavorites(prev => prev.filter(p => p.id !== id));
    }

    async function toggleListingStatus(id: string, currentStatus: string) {
        const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
        await supabase.from('properties').update({ status: newStatus }).eq('id', id);
        if (user) loadMyListings(user.id);
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

    const tabStyle = (active: boolean) => ({
        flex: 1, padding: '14px 16px', textAlign: 'center' as const,
        background: active ? 'var(--bg-card)' : 'transparent',
        border: 'none', borderBottom: active ? '3px solid var(--primary)' : '3px solid transparent',
        color: active ? 'var(--primary-light)' : 'var(--text-muted)',
        fontWeight: (active ? 700 : 500) as number, fontSize: '0.9rem',
        cursor: 'pointer', transition: 'all 0.2s',
    });

    const cardBase = {
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar locale={locale} onLocaleChange={setLocale} />

            <main className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* Profile Header */}
                    <div style={{ ...cardBase, padding: '32px', display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
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
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                                    background: 'rgba(14,165,233,0.15)', color: '#0ea5e9',
                                }}>{isTR ? 'Ücretsiz Plan' : 'Free Plan'}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <a href="/add-property" className="btn btn-primary btn-sm">
                                ➕ {isTR ? 'İlan Ekle' : 'Add Listing'}
                            </a>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                        {[
                            { icon: '📋', label: isTR ? 'Toplam İlan' : 'Total', value: stats.total },
                            { icon: '✅', label: isTR ? 'Aktif' : 'Active', value: stats.active },
                            { icon: '❤️', label: isTR ? 'Favori' : 'Favorites', value: favorites.length },
                            { icon: '👁️', label: isTR ? 'Görüntüleme' : 'Views', value: stats.views },
                        ].map((s, i) => (
                            <div key={i} style={{ ...cardBase, padding: '16px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ ...cardBase, overflow: 'hidden', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                            <button onClick={() => setTab('listings')} style={tabStyle(tab === 'listings')}>
                                📋 {isTR ? 'İlanlarım' : 'My Listings'} ({stats.total})
                            </button>
                            <button onClick={() => setTab('favorites')} style={tabStyle(tab === 'favorites')}>
                                ❤️ {isTR ? 'Favorilerim' : 'Favorites'} ({favorites.length})
                            </button>
                            <button onClick={() => setTab('settings')} style={tabStyle(tab === 'settings')}>
                                ⚙️ {isTR ? 'Ayarlar' : 'Settings'}
                            </button>
                        </div>

                        <div style={{ padding: '20px' }}>

                            {/* === TAB: İlanlarım === */}
                            {tab === 'listings' && (
                                <>
                                    {loading ? (
                                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>⏳</div>
                                    ) : myListings.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏡</div>
                                            <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
                                                {isTR ? 'Henüz ilanınız yok' : 'No listings yet'}
                                            </p>
                                            <a href="/add-property" className="btn btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>
                                                ➕ {isTR ? 'İlk İlanınızı Ekleyin' : 'Add Your First Listing'}
                                            </a>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {myListings.map(p => (
                                                <div key={p.id} style={{
                                                    background: 'var(--bg-darker)', border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)', padding: '14px',
                                                    display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '14px',
                                                    alignItems: 'center',
                                                }}>
                                                    <a href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{
                                                            width: '80px', height: '60px', borderRadius: '8px',
                                                            overflow: 'hidden', background: 'var(--bg-card)',
                                                        }}>
                                                            {p.photos?.[0] ? (
                                                                <img src={p.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.5rem' }}>🏠</div>
                                                            )}
                                                        </div>
                                                    </a>
                                                    <a href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.92rem', marginBottom: '2px' }}>
                                                            {p.title_tr || p.title_en}
                                                        </div>
                                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                                            📍 {p.district}, {p.city} · £{p.price.toLocaleString()}{p.type === 'rent' ? '/mo' : ''}
                                                        </div>
                                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                                                            👁️ {p.views_count || 0} {isTR ? 'görüntüleme' : 'views'}
                                                        </div>
                                                    </a>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                                        <span style={{
                                                            padding: '3px 10px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 600,
                                                            background: p.status === 'active' ? 'rgba(16,185,129,0.15)' : p.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                                            color: p.status === 'active' ? '#10b981' : p.status === 'pending' ? '#f59e0b' : '#ef4444',
                                                        }}>
                                                            {p.status === 'active' ? '✅' : p.status === 'pending' ? '⏳' : '👁️‍🗨️'} {p.status}
                                                        </span>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <a href={`/add-property?edit=${p.id}`}
                                                                style={{
                                                                    padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600,
                                                                    background: 'rgba(27,107,147,0.1)', color: 'var(--primary)',
                                                                    border: '1px solid rgba(27,107,147,0.2)', textDecoration: 'none',
                                                                }}>
                                                                ✏️ {isTR ? 'Düzenle' : 'Edit'}
                                                            </a>
                                                            <button onClick={() => toggleListingStatus(p.id, p.status)}
                                                                style={{
                                                                    padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600,
                                                                    background: p.status === 'active' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                                                                    color: p.status === 'active' ? '#f59e0b' : '#10b981',
                                                                    border: `1px solid ${p.status === 'active' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`,
                                                                    cursor: 'pointer',
                                                                }}>
                                                                {p.status === 'active' ? '👁️‍🗨️' : '✅'} {p.status === 'active' ? (isTR ? 'Gizle' : 'Hide') : (isTR ? 'Aktif Et' : 'Activate')}
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm(isTR ? 'Bu ilanı silmek istediğinize emin misiniz?' : 'Are you sure?')) {
                                                                        await supabase.from('properties').delete().eq('id', p.id);
                                                                        if (user) loadMyListings(user.id);
                                                                    }
                                                                }}
                                                                style={{
                                                                    padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600,
                                                                    background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                                                    border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                                                                }}>
                                                                🗑️ {isTR ? 'Sil' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* === TAB: Favorilerim === */}
                            {tab === 'favorites' && (
                                <>
                                    {favorites.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❤️</div>
                                            <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
                                                {isTR ? 'Henüz favori eklemediniz' : 'No favorites yet'}
                                            </p>
                                            <a href="/properties" className="btn btn-outline" style={{ marginTop: '12px', display: 'inline-block' }}>
                                                🔍 {isTR ? 'İlanları Keşfet' : 'Browse Listings'}
                                            </a>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {favorites.map(p => (
                                                <div key={p.id} style={{
                                                    background: 'var(--bg-darker)', border: '1px solid var(--border)',
                                                    borderRadius: 'var(--radius-md)', padding: '14px',
                                                    display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '14px',
                                                    alignItems: 'center',
                                                }}>
                                                    <a href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{
                                                            width: '80px', height: '60px', borderRadius: '8px',
                                                            overflow: 'hidden', background: 'var(--bg-card)',
                                                        }}>
                                                            {p.photos?.[0] ? (
                                                                <img src={p.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.5rem' }}>🏠</div>
                                                            )}
                                                        </div>
                                                    </a>
                                                    <a href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.92rem', marginBottom: '2px' }}>
                                                            {p.title_tr || p.title_en}
                                                        </div>
                                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                                            📍 {p.district}, {p.city} · £{p.price.toLocaleString()}{p.type === 'rent' ? '/mo' : ''}
                                                        </div>
                                                    </a>
                                                    <button
                                                        onClick={() => removeFavorite(p.id)}
                                                        style={{
                                                            padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                                                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                                            border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                                                        }}>
                                                        💔 {isTR ? 'Kaldır' : 'Remove'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* === TAB: Ayarlar === */}
                            {tab === 'settings' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            📧 {isTR ? 'E-posta' : 'Email'}
                                        </label>
                                        <div style={{
                                            padding: '12px 14px', background: 'var(--bg-darker)',
                                            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-primary)', fontSize: '0.95rem',
                                        }}>
                                            {user.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            🌐 {isTR ? 'Dil Tercihi' : 'Language'}
                                        </label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {(['tr', 'en'] as Locale[]).map(l => (
                                                <button key={l} onClick={() => setLocale(l)} style={{
                                                    padding: '10px 24px', borderRadius: 'var(--radius-md)',
                                                    border: locale === l ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                    background: locale === l ? 'rgba(14,165,233,0.1)' : 'var(--bg-darker)',
                                                    color: locale === l ? 'var(--primary-light)' : 'var(--text-muted)',
                                                    fontWeight: locale === l ? 700 : 400, cursor: 'pointer', fontSize: '0.9rem',
                                                }}>
                                                    {l === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '8px' }}>
                                        <button
                                            className="btn btn-outline"
                                            onClick={async () => { await signOut(); setUser(null); window.location.href = '/'; }}
                                            style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                                            🚪 {isTR ? 'Çıkış Yap' : 'Sign Out'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <ChatbotWidget locale={locale} />
        </div>
    );
}
