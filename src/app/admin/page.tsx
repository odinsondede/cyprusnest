'use client';

import { useState, useEffect } from 'react';
import { type Locale } from '@/i18n/translations';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { supabase, type Property } from '@/lib/supabase';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';
import '../properties/properties.css';

// Admin emails — only these can access the panel
const ADMIN_EMAILS = ['admin@cyprusnest.com'];

export default function AdminPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [pending, setPending] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUser().then(u => setUser(u as { id: string; email?: string } | null));
        const { data: { subscription } } = onAuthChange((u) => setUser(u as { id: string; email?: string } | null));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) loadPending();
    }, [user]);

    async function loadPending() {
        setLoading(true);
        const { data } = await supabase
            .from('properties')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        setPending(data as Property[] || []);
        setLoading(false);
    }

    async function handleAction(id: string, action: 'active' | 'rejected') {
        setActionLoading(id);
        await supabase.from('properties').update({ status: action }).eq('id', id);
        setPending(prev => prev.filter(p => p.id !== id));
        setActionLoading(null);
    }

    const isAdmin = user && (ADMIN_EMAILS.includes(user.email || '') || true); // TODO: For now, all authenticated users can admin

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔐</div>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Admin Panel</h2>
                    <p>Giriş yapmanız gerekiyor / You need to login</p>
                    <a href="/properties" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>← Geri / Back</a>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⛔</div>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Erişim Engellendi / Access Denied</h2>
                    <p>Bu sayfaya erişim yetkiniz yok.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="admin" />

            <main className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h1 style={{ color: 'var(--text-primary)', fontSize: '1.6rem' }}>
                            📋 Onay Bekleyen İlanlar
                        </h1>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {pending.length} ilan bekliyor
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>⏳ Yükleniyor...</div>
                    ) : pending.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
                            <p style={{ fontSize: '1.1rem' }}>Tüm ilanlar onaylandı!</p>
                            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Bekleyen ilan bulunmuyor.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {pending.map(p => (
                                <div key={p.id} style={{
                                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)', padding: '20px',
                                    display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start',
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{
                                                padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                                                background: p.type === 'rent' ? 'rgba(16,185,129,0.15)' : 'rgba(14,165,233,0.15)',
                                                color: p.type === 'rent' ? '#10b981' : '#0ea5e9',
                                            }}>{p.type === 'rent' ? 'Kiralık' : 'Satılık'}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                {new Date(p.created_at).toLocaleDateString('tr')}
                                            </span>
                                        </div>
                                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '4px' }}>
                                            {p.title_tr || p.title_en}
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
                                            📍 {p.district}, {p.city} — 🛏️ {p.bedrooms} — 📐 {p.area_sqm}m²
                                        </p>
                                        <p style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '1.1rem' }}>
                                            £{p.price.toLocaleString()}{p.type === 'rent' ? '/mo' : ''}
                                        </p>
                                        {p.description_tr && (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px', maxHeight: '60px', overflow: 'hidden' }}>
                                                {p.description_tr}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                                        <button
                                            onClick={() => handleAction(p.id, 'active')}
                                            disabled={actionLoading === p.id}
                                            className="btn btn-primary btn-sm"
                                            style={{ opacity: actionLoading === p.id ? 0.5 : 1 }}
                                        >✅ Onayla</button>
                                        <button
                                            onClick={() => handleAction(p.id, 'rejected')}
                                            disabled={actionLoading === p.id}
                                            className="btn btn-outline btn-sm"
                                            style={{ borderColor: '#ef4444', color: '#ef4444', opacity: actionLoading === p.id ? 0.5 : 1 }}
                                        >❌ Reddet</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <ChatbotWidget locale="tr" />
        </div>
    );
}
