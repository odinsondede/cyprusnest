'use client';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            textAlign: 'center',
            padding: '20px',
        }}>
            <div>
                <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🏗️</div>
                <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Yakında / Coming Soon</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '24px' }}>
                    Bu sayfa henüz hazırlanıyor. Çok yakında burada olacak!
                    <br />
                    This page is under construction. Coming very soon!
                </p>
                <a href="/" style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-full)',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 600,
                }}>
                    ← Ana Sayfaya Dön / Back to Home
                </a>
            </div>
        </div>
    );
}
