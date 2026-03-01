'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    useEffect(() => {
        // Supabase automatically picks up the auth tokens from the URL hash
        // We just need to wait for the session to be established, then redirect
        supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                window.location.href = '/properties';
            }
        });

        // Fallback: if already signed in after hash processing, redirect
        setTimeout(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                window.location.href = '/properties';
            }
        }, 2000);
    }, []);

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'var(--bg-primary)',
            flexDirection: 'column', gap: '16px',
        }}>
            <div style={{ fontSize: '3rem' }}>🔐</div>
            <h2 style={{ color: 'var(--text-primary)' }}>Giriş yapılıyor...</h2>
            <p style={{ color: 'var(--text-muted)' }}>Lütfen bekleyin, yönlendiriliyorsunuz.</p>
        </div>
    );
}
