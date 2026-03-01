'use client';

import { useState } from 'react';
import { signUp, signIn, signInWithGoogle, resetPassword } from '@/lib/auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
}

export default function AuthModal({ isOpen, onClose, locale }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen) return null;

    const isTR = locale === 'tr';

    const inputStyle = {
        padding: '12px 14px', background: 'var(--bg-darker)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%',
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (mode === 'forgot') {
            const { error } = await resetPassword(email);
            if (error) {
                setError(error);
            } else {
                setSuccess(isTR ? 'Şifre sıfırlama linki gönderildi!' : 'Password reset link sent!');
            }
        } else if (mode === 'signup') {
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

    async function handleGoogleLogin() {
        setLoading(true);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error);
            setLoading(false);
        }
        // OAuth redirects — no need to setLoading(false)
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
                <button onClick={onClose} style={{
                    position: 'absolute', top: '12px', right: '16px',
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    fontSize: '1.5rem', cursor: 'pointer',
                }}>×</button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏠</div>
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                        {mode === 'forgot'
                            ? (isTR ? 'Şifreni Sıfırla' : 'Reset Password')
                            : mode === 'login'
                                ? (isTR ? 'Giriş Yap' : 'Welcome Back')
                                : (isTR ? 'Hesap Oluştur' : 'Create Account')}
                    </h2>
                </div>

                {mode !== 'forgot' && (
                    <>
                        {/* Google Button */}
                        <button onClick={handleGoogleLogin} disabled={loading} style={{
                            width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)', background: 'var(--bg-darker)',
                            color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '10px', marginBottom: '16px',
                            opacity: loading ? 0.6 : 1, transition: 'all 0.15s',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isTR ? 'Google ile Devam Et' : 'Continue with Google'}
                        </button>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {isTR ? 'veya e-posta ile' : 'or with email'}
                            </span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                        </div>

                        {/* Tab Toggle */}
                        <div style={{
                            display: 'flex', gap: '4px', marginBottom: '16px',
                            background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', padding: '4px',
                        }}>
                            <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} style={{
                                flex: 1, padding: '8px', border: 'none', borderRadius: 'var(--radius-sm)',
                                background: mode === 'login' ? 'var(--primary)' : 'transparent',
                                color: mode === 'login' ? '#fff' : 'var(--text-muted)',
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                            }}>{isTR ? 'Giriş Yap' : 'Login'}</button>
                            <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} style={{
                                flex: 1, padding: '8px', border: 'none', borderRadius: 'var(--radius-sm)',
                                background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                                color: mode === 'signup' ? '#fff' : 'var(--text-muted)',
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                            }}>{isTR ? 'Kayıt Ol' : 'Sign Up'}</button>
                        </div>
                    </>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {mode === 'signup' && (
                        <input type="text" placeholder={isTR ? 'Ad Soyad' : 'Full Name'}
                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                            required style={inputStyle} />
                    )}
                    <input type="email" placeholder={isTR ? 'E-posta adresi' : 'Email address'}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required style={inputStyle} />
                    {mode !== 'forgot' && (
                        <input type="password" placeholder={isTR ? 'Şifre (min 6 karakter)' : 'Password (min 6 characters)'}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required minLength={6} style={inputStyle} />
                    )}

                    {/* Forgot password link */}
                    {mode === 'login' && (
                        <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'right', padding: 0 }}>
                            {isTR ? 'Şifremi Unuttum' : 'Forgot Password?'}
                        </button>
                    )}
                    {mode === 'forgot' && (
                        <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                            ← {isTR ? 'Giriş sayfasına dön' : 'Back to login'}
                        </button>
                    )}

                    {error && (
                        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.85rem' }}>
                            ❌ {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '0.85rem' }}>
                            ✅ {success}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{
                        padding: '12px', fontSize: '1rem', fontWeight: 700, opacity: loading ? 0.6 : 1,
                    }}>
                        {loading ? '⏳...' : mode === 'forgot'
                            ? (isTR ? '📧 Sıfırlama Linki Gönder' : '📧 Send Reset Link')
                            : mode === 'login'
                                ? (isTR ? 'Giriş Yap' : 'Login')
                                : (isTR ? 'Kayıt Ol' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '14px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {isTR ? 'Devam ederek kullanım şartlarını kabul edersiniz.' : 'By continuing you agree to our terms of use.'}
                </p>
            </div>
        </div>
    );
}
