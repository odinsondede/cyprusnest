'use client';

import { useState } from 'react';
import { type Locale } from '@/i18n/translations';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';
import './pricing.css';

export default function PricingPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    const txt = {
        tr: {
            title: 'Basit ve Şeffaf Fiyatlandırma',
            subtitle: 'İhtiyacınıza uygun planı seçin. Gizli ücret yok.',
            betaBanner: '🎉 Beta döneminde tüm Pro özellikler ücretsiz!',
            betaNote: 'Sınırlı süre',
            free: 'Başlangıç',
            freePrice: 'Ücretsiz',
            freePriceNote: 'Sonsuza kadar',
            pro: 'Pro',
            proPrice: '£15',
            proPriceUnit: '/ay',
            proPriceNote: 'veya £150/yıl (2 ay bedava)',
            proBeta: 'Beta boyunca £0',
            popular: 'Popüler',
            freeCta: 'Hemen Başla',
            proCta: 'Beta\'ya Katıl — Ücretsiz',
            freeFeatures: [
                '2 aktif ilan',
                '5 fotoğraf / ilan',
                '60 gün ilan süresi',
                'AI Chatbot erişimi',
                '5 dil desteği',
            ],
            freeDisabled: [
                'İlan istatistikleri',
                'Öne çıkarma',
                'Pro rozeti',
            ],
            proFeatures: [
                '10 aktif ilan',
                '15 fotoğraf / ilan',
                'Sınırsız ilan süresi',
                'İstatistikler (görüntülenme, iletişim)',
                'Ayda 2 ilan öne çıkarma',
                'Pro ✓ rozeti (güven sinyali)',
                'Öncelikli sıralama',
                'WhatsApp bildirimler',
            ],
            faqTitle: 'Sıkça Sorulan Sorular',
            faq: [
                {
                    q: 'Beta ne zamana kadar ücretsiz?',
                    a: 'Evlek\'in ilk 6 ayı boyunca tüm Pro özellikler herkese ücretsiz. Tam lansman tarihini e-posta ile duyuracağız.'
                },
                {
                    q: 'Beta sonrası ne olacak?',
                    a: 'Beta\'da Pro kullanan mevcut kullanıcılara özel indirimli fiyat sunulacak. Mevcut ilanlarınız etkilenmeyecek.'
                },
                {
                    q: 'Ödeme nasıl yapılır?',
                    a: 'Şu an beta döneminde ödeme yok. İleride kredi kartı ve banka havalesi ile ödeme kabul edeceğiz.'
                },
                {
                    q: 'İptal edebilir miyim?',
                    a: 'Evet, istediğiniz zaman planınızı indirebilir veya iptal edebilirsiniz. Taahhüt yok.'
                },
            ]
        },
        en: {
            title: 'Simple and Transparent Pricing',
            subtitle: 'Choose the plan that fits your needs. No hidden fees.',
            betaBanner: '🎉 All Pro features are free during Beta!',
            betaNote: 'Limited time',
            free: 'Starter',
            freePrice: 'Free',
            freePriceNote: 'Forever',
            pro: 'Pro',
            proPrice: '£15',
            proPriceUnit: '/mo',
            proPriceNote: 'or £150/year (2 months free)',
            proBeta: '£0 during Beta',
            popular: 'Popular',
            freeCta: 'Get Started',
            proCta: 'Join Beta — Free',
            freeFeatures: [
                '2 active listings',
                '5 photos / listing',
                '60-day listing duration',
                'AI Chatbot access',
                '5 language support',
            ],
            freeDisabled: [
                'Listing statistics',
                'Featured placement',
                'Pro badge',
            ],
            proFeatures: [
                '10 active listings',
                '15 photos / listing',
                'Unlimited listing duration',
                'Statistics (views, inquiries)',
                '2 featured listings / month',
                'Pro ✓ badge (trust signal)',
                'Priority ranking',
                'WhatsApp notifications',
            ],
            faqTitle: 'Frequently Asked Questions',
            faq: [
                {
                    q: 'How long is the Beta free?',
                    a: 'All Pro features are free for Evlek\'s first 6 months. We\'ll announce the full launch date via email.'
                },
                {
                    q: 'What happens after Beta?',
                    a: 'Existing Beta Pro users will receive a special discounted price. Your listings won\'t be affected.'
                },
                {
                    q: 'How do I pay?',
                    a: 'No payment required during Beta. We\'ll accept credit cards and bank transfers in the future.'
                },
                {
                    q: 'Can I cancel?',
                    a: 'Yes, you can downgrade or cancel anytime. No commitments.'
                },
            ]
        }
    };

    const t = txt[locale as 'tr' | 'en'] || txt.tr;
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div dir={dir}>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="pricing" />

            <section className="pricing-page">
                <div className="container">
                    {/* Header */}
                    <div className="pricing-header">
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    {/* Beta Banner */}
                    <div className="beta-banner">
                        <span className="beta-banner-icon">🚀</span>
                        <div>
                            <strong>{t.betaBanner}</strong>
                            <span style={{ marginLeft: '8px', fontSize: '0.8rem', opacity: 0.7 }}>— {t.betaNote}</span>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="pricing-grid">
                        {/* Free Plan */}
                        <div className="pricing-card">
                            <div className="pricing-card-name">{t.free}</div>
                            <div className="pricing-card-price">{t.freePrice}</div>
                            <div className="pricing-card-note">{t.freePriceNote}</div>

                            <ul className="pricing-features">
                                {t.freeFeatures.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                                {t.freeDisabled.map((f) => (
                                    <li key={f} className="disabled">{f}</li>
                                ))}
                            </ul>

                            <a href="/add-property" className="pricing-cta pricing-cta-free">{t.freeCta}</a>
                        </div>

                        {/* Pro Plan */}
                        <div className="pricing-card popular">
                            <div className="pricing-popular-badge">{t.popular}</div>
                            <div className="pricing-card-name">{t.pro}</div>
                            <div className="pricing-card-price">
                                <span style={{ textDecoration: 'line-through', fontSize: '1.4rem', opacity: 0.4, marginRight: '8px' }}>{t.proPrice}</span>
                                £0
                                <span>{t.proPriceUnit}</span>
                            </div>
                            <div className="pricing-card-note" style={{ color: 'var(--success)', fontWeight: 600 }}>
                                ✨ {t.proBeta}
                            </div>

                            <ul className="pricing-features">
                                {t.proFeatures.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>

                            <a
                                href="https://wa.me/905338123456?text=Merhaba%2C%20Evlek%20Pro%20Beta%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pricing-cta pricing-cta-pro"
                            >
                                {t.proCta}
                            </a>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="pricing-faq">
                        <h2>{t.faqTitle}</h2>
                        {t.faq.map((item, i) => (
                            <div key={i} className="faq-item">
                                <button
                                    className="faq-question"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    {item.q}
                                    <span>{openFaq === i ? '−' : '+'}</span>
                                </button>
                                {openFaq === i && (
                                    <div className="faq-answer">{item.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
