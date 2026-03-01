'use client';

import { useState } from 'react';
import { type Locale } from '@/i18n/translations';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function ContactPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const isTR = locale === 'tr';
    const [sent, setSent] = useState(false);

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} />

            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                        {isTR ? '📬 İletişim' : '📬 Contact Us'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        {isTR ? 'Sorularınız, önerileriniz veya işbirliği teklifleriniz için bize ulaşın.' : 'Reach out for questions, suggestions, or collaboration.'}
                    </p>

                    {/* Contact Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
                        <a href="https://wa.me/905338123456" target="_blank" rel="noopener noreferrer" style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: '12px', padding: '20px', textAlign: 'center',
                            textDecoration: 'none', transition: 'all 0.2s',
                        }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💬</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>WhatsApp</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+90 533 812 34 56</div>
                        </a>
                        <a href="mailto:info@evlek.app" style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: '12px', padding: '20px', textAlign: 'center',
                            textDecoration: 'none', transition: 'all 0.2s',
                        }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>✉️</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>E-posta</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>info@evlek.app</div>
                        </a>
                    </div>

                    {/* Contact Form */}
                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '16px', padding: '32px',
                    }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                            {isTR ? '📝 Mesaj Gönderin' : '📝 Send a Message'}
                        </h2>

                        {sent ? (
                            <div style={{
                                padding: '24px', textAlign: 'center', background: 'rgba(16,185,129,0.1)',
                                borderRadius: '12px', color: '#10b981',
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                                <p style={{ fontWeight: 600 }}>
                                    {isTR ? 'Mesajınız gönderildi! En kısa sürede dönüş yapacağız.' : 'Message sent! We\'ll get back to you soon.'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const name = formData.get('name');
                                const email = formData.get('email');
                                const message = formData.get('message');
                                // WhatsApp redirect as MVP contact
                                const waText = `Merhaba, ben ${name} (${email}). ${message}`;
                                window.open(`https://wa.me/905338123456?text=${encodeURIComponent(waText)}`, '_blank');
                                setSent(true);
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        {isTR ? 'Ad Soyad' : 'Full Name'}
                                    </label>
                                    <input name="name" required type="text" style={{
                                        padding: '12px 14px', background: 'var(--bg-darker)',
                                        border: '1px solid var(--border)', borderRadius: '8px',
                                        color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%',
                                    }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        E-posta
                                    </label>
                                    <input name="email" required type="email" style={{
                                        padding: '12px 14px', background: 'var(--bg-darker)',
                                        border: '1px solid var(--border)', borderRadius: '8px',
                                        color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%',
                                    }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        {isTR ? 'Mesaj' : 'Message'}
                                    </label>
                                    <textarea name="message" required rows={4} style={{
                                        padding: '12px 14px', background: 'var(--bg-darker)',
                                        border: '1px solid var(--border)', borderRadius: '8px',
                                        color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%',
                                        resize: 'vertical',
                                    }} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg">
                                    {isTR ? '📤 Gönder' : '📤 Send'}
                                </button>
                            </form>
                        )}
                    </div>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '24px' }}>
                        {isTR ? '📍 Kuzey Kıbrıs Türk Cumhuriyeti' : '📍 Turkish Republic of Northern Cyprus'}
                    </p>
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
