'use client';

import { useState } from 'react';
import { type Locale } from '@/i18n/translations';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function AboutPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const isTR = locale === 'tr';

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} />

            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>
                        {isTR ? '🏠 Hakkımızda' : '🏠 About Us'}
                    </h1>

                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '16px', padding: '32px', marginBottom: '24px', lineHeight: 1.8,
                        color: 'var(--text-secondary)', fontSize: '0.95rem',
                    }}>
                        <p style={{ marginBottom: '16px' }}>
                            {isTR
                                ? 'Evlek, Kuzey Kıbrıs\'ın ilk AI destekli, çok dilli emlak platformudur. Amacımız KKTC\'de ev arayanlar ve mülk sahipleri arasındaki köprüyü dijital, şeffaf ve güvenilir bir şekilde kurmaktır.'
                                : 'Evlek is Northern Cyprus\'s first AI-powered, multilingual real estate platform. Our mission is to digitally, transparently, and reliably connect property seekers and owners in the TRNC.'}
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            {isTR
                                ? '🌍 Türkçe, İngilizce, Rusça, Almanca ve Arapça — 5 dilde hizmet veriyoruz. Öğrenciden yatırımcıya, KKTC\'de yaşayan herkese hitap ediyoruz.'
                                : '🌍 We serve in 5 languages — Turkish, English, Russian, German, and Arabic. From students to investors, we cater to everyone living in the TRNC.'}
                        </p>
                        <p>
                            {isTR
                                ? '🤖 AI emlak asistanımız, hukuki rehberimiz ve akıllı filtrelerimiz sayesinde doğru mülkü bulmak artık çok kolay.'
                                : '🤖 With our AI real estate assistant, legal guide, and smart filters, finding the right property has never been easier.'}
                        </p>
                    </div>

                    <h2 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>
                        {isTR ? '🎯 Vizyonumuz' : '🎯 Our Vision'}
                    </h2>
                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '16px', padding: '24px', marginBottom: '24px',
                        color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8,
                    }}>
                        <p>
                            {isTR
                                ? 'KKTC emlak sektöründe dijital dönüşümün öncüsü olmak. Şeffaf, güvenilir ve teknoloji odaklı bir platform ile herkesin güvenle ev arayabileceği bir ekosistem kurmak.'
                                : 'To be the pioneer of digital transformation in the TRNC real estate sector. Building an ecosystem where everyone can search for homes with confidence through a transparent, reliable, and technology-focused platform.'}
                        </p>
                    </div>

                    <h2 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>
                        {isTR ? '💡 Neden Evlek?' : '💡 Why Evlek?'}
                    </h2>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px',
                    }}>
                        {[
                            { icon: '🤖', title: isTR ? 'AI Asistan' : 'AI Assistant', desc: isTR ? '7/24 sorularınızı yanıtlar' : 'Answers your questions 24/7' },
                            { icon: '🌍', title: isTR ? '5 Dil' : '5 Languages', desc: isTR ? 'TR, EN, RU, DE, AR' : 'TR, EN, RU, DE, AR' },
                            { icon: '⚖️', title: isTR ? 'Hukuki Rehber' : 'Legal Guide', desc: isTR ? 'KKTC mülk alma süreci' : 'TRNC property buying process' },
                            { icon: '🏷️', title: isTR ? 'Ücretsiz' : 'Free', desc: isTR ? 'Beta döneminde tüm özellikler ücretsiz' : 'All features free during beta' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: '12px', padding: '20px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(27,107,147,0.08), rgba(45,139,92,0.08))',
                        border: '1px solid rgba(27,107,147,0.2)', borderRadius: '16px',
                        padding: '24px', textAlign: 'center',
                    }}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '12px' }}>
                            {isTR ? '📬 Bizimle iletişime geçin' : '📬 Get in touch with us'}
                        </p>
                        <a href="/contact" className="btn btn-primary">
                            {isTR ? 'İletişim' : 'Contact'}
                        </a>
                    </div>
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
