'use client';

import { useState } from 'react';
import { signUp, signIn } from '@/lib/auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
}

export default function AuthModal({ isOpen, onClose, locale }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen) return null;

    const isTR = locale === 'tr';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (mode === 'signup') {
            const { error } = await signUp(email, password, fullName);
            if (error) {
                setError(error);
            } else {
                setSuccess(isTR ? 'Kayıt başarılı! E-posta adresinizi kontrol edin.' : 'Registration successful! Check your email.');
            }
        } else {
            const { error } = await signIn(email, password);
            if (error) {
                setError(isTR ? 'E-posta veya şifre hatalı.' : 'Invalid email or password.');
            } else {
                setSuccess(isTR ? 'Giriş başarılı!' : 'Login successful!');
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1000);
            }
        }
        setLoading(false);
    }

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '420px',
                    width: '90%', position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '12px', right: '16px',
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        fontSize: '1.5rem', cursor: 'pointer',
                    }}
                >×</button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏠</div>
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem' }}>
                        {mode === 'login'
                            ? (isTR ? 'CyprusNest\'e Giriş' : 'Login to CyprusNest')
                            : (isTR ? 'Hesap Oluştur' : 'Create Account')}
                    </h2>
                </div>

                {/* Tab Toggle */}
                <div style={{
                    display: 'flex', gap: '4px', marginBottom: '24px',
                    background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', padding: '4px',
                }}>
                    <button
                        onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                        style={{
                            flex: 1, padding: '8px', border: 'none', borderRadius: 'var(--radius-sm)',
                            background: mode === 'login' ? 'var(--primary)' : 'transparent',
                            color: mode === 'login' ? '#fff' : 'var(--text-muted)',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        }}
                    >{isTR ? 'Giriş Yap' : 'Login'}</button>
                    <button
                        onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                        style={{
                            flex: 1, padding: '8px', border: 'none', borderRadius: 'var(--radius-sm)',
                            background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                            color: mode === 'signup' ? '#fff' : 'var(--text-muted)',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        }}
                    >{isTR ? 'Kayıt Ol' : 'Sign Up'}</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {mode === 'signup' && (
                        <input
                            type="text"
                            placeholder={isTR ? 'Ad Soyad' : 'Full Name'}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            style={{
                                padding: '12px 14px', background: 'var(--bg-darker)',
                                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)', fontSize: '0.95rem',
                            }}
                        />
                    )}
                    <input
                        type="email"
                        placeholder={isTR ? 'E-posta adresi' : 'Email address'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '12px 14px', background: 'var(--bg-darker)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)', fontSize: '0.95rem',
                        }}
                    />
                    <input
                        type="password"
                        placeholder={isTR ? 'Şifre (min 6 karakter)' : 'Password (min 6 characters)'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{
                            padding: '12px 14px', background: 'var(--bg-darker)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)', fontSize: '0.95rem',
                        }}
                    />

                    {error && (
                        <div style={{
                            padding: '10px 14px', background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)',
                            color: '#ef4444', fontSize: '0.85rem',
                        }}>❌ {error}</div>
                    )}

                    {success && (
                        <div style={{
                            padding: '10px 14px', background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)',
                            color: '#10b981', fontSize: '0.85rem',
                        }}>✅ {success}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            padding: '12px', fontSize: '1rem', fontWeight: 700,
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? '⏳...' : mode === 'login'
                            ? (isTR ? 'Giriş Yap' : 'Login')
                            : (isTR ? 'Kayıt Ol' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {isTR ? 'Devam ederek kullanım şartlarını kabul edersiniz.' : 'By continuing you agree to our terms of use.'}
                </p>
            </div>
        </div>
    );
}
