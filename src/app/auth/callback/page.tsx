'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check URL for error params
        const params = new URLSearchParams(window.location.search);
        const errorDesc = params.get('error_description');
        if (errorDesc) {
            setError(errorDesc);
            return;
        }

        // Listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                window.location.href = '/';
            }
        });

        // Fallback: check if already signed in
        const timeout = setTimeout(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                window.location.href = '/';
            }
        }, 3000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    if (error) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'var(--bg-primary)',
                flexDirection: 'column', gap: '16px', padding: '20px',
            }}>
                <div style={{ fontSize: '3rem' }}>❌</div>
                <h2 style={{ color: 'var(--text-primary)' }}>Giriş başarısız</h2>
                <p style={{ color: '#ef4444', textAlign: 'center', maxWidth: '400px' }}>{error}</p>
                <a href="/" style={{
                    padding: '12px 24px', background: 'var(--primary)',
                    color: '#fff', borderRadius: 'var(--radius-md)',
                    textDecoration: 'none', fontWeight: 600, marginTop: '12px',
                }}>Ana Sayfaya Dön</a>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'var(--bg-primary)',
            flexDirection: 'column', gap: '16px',
        }}>
            <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🔐</div>
            <h2 style={{ color: 'var(--text-primary)' }}>Giriş yapılıyor...</h2>
            <p style={{ color: 'var(--text-muted)' }}>Lütfen bekleyin, yönlendiriliyorsunuz.</p>
        </div>
    );
}
