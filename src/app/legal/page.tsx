'use client';

import { useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';
import '../properties/detail.css';
import '../properties/properties.css';

type Step = 'nationality' | 'purpose' | 'result';

interface WizardState {
    nationality: string;
    purpose: string;
    propertyPrice: number;
}

const nationalities = [
    { id: 'turkish', label: '🇹🇷 Türk Vatandaşı (TC/KKTC)', labelEn: '🇹🇷 Turkish Citizen (TR/TRNC)' },
    { id: 'british', label: '🇬🇧 Birleşik Krallık Vatandaşı', labelEn: '🇬🇧 United Kingdom Citizen' },
    { id: 'russian', label: '🇷🇺 Rusya Vatandaşı', labelEn: '🇷🇺 Russian Citizen' },
    { id: 'german', label: '🇩🇪 Almanya Vatandaşı', labelEn: '🇩🇪 German Citizen' },
    { id: 'arab', label: '🇸🇦 Arap Ülkeleri Vatandaşı', labelEn: '🇸🇦 Arab/Middle East Citizen' },
    { id: 'other', label: '🌍 Diğer Ülke Vatandaşı', labelEn: '🌍 Other Country Citizen' },
];

const purposes = [
    { id: 'residence', label: '🏠 Yaşamak İçin', labelEn: '🏠 For Residence' },
    { id: 'investment', label: '📈 Yatırım İçin', labelEn: '📈 For Investment' },
    { id: 'retirement', label: '🌴 Emeklilik İçin', labelEn: '🌴 For Retirement' },
    { id: 'student', label: '🎓 Öğrenci Konutu', labelEn: '🎓 Student Housing' },
];

function getLegalSteps(nationality: string, purpose: string, locale: string): string[] {
    const isForeign = nationality !== 'turkish';

    if (locale === 'tr') {
        const steps = [
            '1️⃣ Mülk seçimi ve fiyat müzakeresi',
            '2️⃣ Avukat tutma (zorunlu önerilir)',
            '3️⃣ Satış sözleşmesi imzalama + %10-30 ön ödeme',
        ];
        if (isForeign) {
            steps.push(
                '4️⃣ Sözleşmeyi 21 gün içinde Tapu Dairesi\'ne kaydedin',
                '5️⃣ Bakanlık\'a PTP (Satın Alma İzni) başvurusu',
                '6️⃣ PTP onay bekleme süresi: 6-24 ay (milliyete göre değişir)',
                '7️⃣ PTP sonrası 75 iş günü içinde tüm vergileri öde',
                '8️⃣ Tapu devir işlemi',
                '⚠️ Yabancılar max 3 daire veya 2 villa alabilir (2025 düzenlemesi)',
                '⚠️ Trustee (vekalet) düzenlemeleri artık YASADIŞI',
            );
            if (nationality === 'russian') {
                steps.push('📋 Ek: Rusya vatandaşları için notere onaylı pasaport çevirisi gerekli');
            }
        } else {
            steps.push(
                '4️⃣ Tapu devir işlemi + vergiler',
                '5️⃣ Tapu Dairesi\'nde tescil',
                '✅ TC/KKTC vatandaşları PTP\'ye gerek yok',
            );
        }
        return steps;
    }

    // English
    const steps = [
        '1️⃣ Property selection & price negotiation',
        '2️⃣ Hire a lawyer (strongly recommended)',
        '3️⃣ Sign sales contract + 10-30% deposit',
    ];
    if (isForeign) {
        steps.push(
            '4️⃣ Register contract at Land Registry within 21 days',
            '5️⃣ Apply for PTP (Permission to Purchase) at the Ministry',
            '6️⃣ PTP approval waiting period: 6-24 months (varies by nationality)',
            '7️⃣ Pay all taxes within 75 working days after PTP',
            '8️⃣ Title deed transfer',
            '⚠️ Foreigners can purchase max 3 apartments or 2 villas (2025 regulation)',
            '⚠️ Trustee arrangements are now ILLEGAL',
        );
        if (nationality === 'russian') {
            steps.push('📋 Note: Russian citizens need notarized passport translation');
        }
    } else {
        steps.push(
            '4️⃣ Title deed transfer + taxes',
            '5️⃣ Registration at the Land Registry Office',
            '✅ TR/TRNC citizens do not need PTP',
        );
    }
    return steps;
}

function calculateTax(price: number, isForeign: boolean) {
    const stampDuty = price * (isForeign ? 0.006 : 0.005); // %0.5 vatandaş, %0.6 yabancı
    const vatRate = 0.05; // %5 yeni binalar
    const vat = price * vatRate;
    const transferTax = price * (isForeign ? 0.09 : 0.06); // %9 yabancı, %6 TC ilk mülk
    const lawyerFee = Math.max(price * (isForeign ? 0.015 : 0.01), 1500); // yabancı %1.5, TC %1
    const total = stampDuty + vat + transferTax + lawyerFee;

    return { stampDuty, vat, transferTax, lawyerFee, total, vatRate: vatRate * 100, stampRate: isForeign ? 0.6 : 0.5, transferRate: isForeign ? 9 : 6 };
}

export default function LegalWizardPage() {
    const [locale, setLocale] = useState<Locale>('en');
    const [step, setStep] = useState<Step>('nationality');
    const [state, setState] = useState<WizardState>({
        nationality: '',
        purpose: '',
        propertyPrice: 150000,
    });

    const isForeign = state.nationality !== 'turkish';
    const taxes = calculateTax(state.propertyPrice, isForeign);
    const totalSteps = 3;
    const currentStep = step === 'nationality' ? 1 : step === 'purpose' ? 2 : 3;
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <div dir={dir}>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo">
                        <span className="logo-icon">🏠</span>
                        <span className="logo-text">CyprusNest</span>
                    </a>
                    <ul className="navbar-links">
                        <li><a href="/properties">{t(locale, 'nav.rent')}</a></li>
                        <li><a href="/properties">{t(locale, 'nav.buy')}</a></li>
                        <li><a href="/legal" style={{ color: 'var(--primary-light)' }}>{t(locale, 'nav.legal')}</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                        <button className="btn btn-primary">{t(locale, 'nav.register')}</button>
                    </div>
                </div>
            </nav>

            <main className="legal-page">
                <div className="container">
                    <div className="wizard-container">
                        {/* Progress Bar */}
                        <div className="wizard-progress">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div key={i} className={`wizard-step ${i + 1 < currentStep ? 'done' : i + 1 === currentStep ? 'active' : ''}`} />
                            ))}
                        </div>

                        {/* Step 1: Nationality */}
                        {step === 'nationality' && (
                            <div className="wizard-card">
                                <h2>⚖️ {locale === 'tr' ? 'Hukuki Süreç Rehberi' : 'Legal Process Guide'}</h2>
                                <p className="wizard-subtitle">
                                    {locale === 'tr'
                                        ? 'KKTC\'de mülk satın alma sürecini ülkenize göre öğrenin. Lütfen vatandaşlığınızı seçin.'
                                        : 'Learn the property purchase process in North Cyprus based on your nationality.'}
                                </p>
                                <div className="wizard-options">
                                    {nationalities.map(n => (
                                        <button
                                            key={n.id}
                                            className={`wizard-option ${state.nationality === n.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                setState(prev => ({ ...prev, nationality: n.id }));
                                                setStep('purpose');
                                            }}
                                        >
                                            {locale === 'tr' ? n.label : n.labelEn}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Purpose */}
                        {step === 'purpose' && (
                            <div className="wizard-card">
                                <h2>🎯 {locale === 'tr' ? 'Satın Alma Amacınız' : 'Your Purchase Purpose'}</h2>
                                <p className="wizard-subtitle">
                                    {locale === 'tr' ? 'Mülkü ne amaçla satın almak istiyorsunuz?' : 'What is your purpose for purchasing?'}
                                </p>
                                <div className="wizard-options">
                                    {purposes.map(p => (
                                        <button
                                            key={p.id}
                                            className={`wizard-option ${state.purpose === p.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                setState(prev => ({ ...prev, purpose: p.id }));
                                                setStep('result');
                                            }}
                                        >
                                            {locale === 'tr' ? p.label : p.labelEn}
                                        </button>
                                    ))}
                                </div>
                                <div className="wizard-actions">
                                    <button className="btn btn-outline" onClick={() => setStep('nationality')}>← {locale === 'tr' ? 'Geri' : 'Back'}</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Results */}
                        {step === 'result' && (
                            <div className="wizard-card">
                                <h2>📋 {locale === 'tr' ? 'Adım Adım Süreciniz' : 'Your Step-by-Step Process'}</h2>
                                <p className="wizard-subtitle">
                                    {locale === 'tr'
                                        ? `${nationalities.find(n => n.id === state.nationality)?.label} → ${purposes.find(p => p.id === state.purpose)?.label}`
                                        : `${nationalities.find(n => n.id === state.nationality)?.labelEn} → ${purposes.find(p => p.id === state.purpose)?.labelEn}`}
                                </p>

                                <div className="wizard-result">
                                    <h3>{locale === 'tr' ? 'Hukuki Adımlar' : 'Legal Steps'}</h3>
                                    <ul>
                                        {getLegalSteps(state.nationality, state.purpose, locale).map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Tax Calculator */}
                                <div className="tax-calculator">
                                    <h3>💰 {locale === 'tr' ? 'Vergi & Maliyet Hesaplayıcı' : 'Tax & Cost Calculator'}</h3>
                                    <div className="tax-input-group">
                                        <label>{locale === 'tr' ? 'Mülk Fiyatı (£)' : 'Property Price (£)'}</label>
                                        <input
                                            type="number"
                                            value={state.propertyPrice}
                                            onChange={(e) => setState(prev => ({ ...prev, propertyPrice: Number(e.target.value) || 0 }))}
                                            min={0}
                                            step={5000}
                                        />
                                    </div>
                                    <div className="tax-result-grid">
                                        <div className="tax-item">
                                            <div className="tax-value">£{taxes.stampDuty.toLocaleString()}</div>
                                            <div className="tax-label">{locale === 'tr' ? 'Damga Vergisi (%0.5)' : 'Stamp Duty (0.5%)'}</div>
                                        </div>
                                        <div className="tax-item">
                                            <div className="tax-value">£{taxes.vat.toLocaleString()}</div>
                                            <div className="tax-label">{locale === 'tr' ? `KDV (%${taxes.vatRate})` : `VAT (${taxes.vatRate}%)`}</div>
                                        </div>
                                        <div className="tax-item">
                                            <div className="tax-value">£{taxes.transferTax.toLocaleString()}</div>
                                            <div className="tax-label">{locale === 'tr' ? 'Tapu Harcı (%6)' : 'Transfer Tax (6%)'}</div>
                                        </div>
                                        <div className="tax-item">
                                            <div className="tax-value">£{taxes.lawyerFee.toLocaleString()}</div>
                                            <div className="tax-label">{locale === 'tr' ? 'Avukat Ücreti (tahmini)' : 'Lawyer Fee (estimated)'}</div>
                                        </div>
                                    </div>
                                    <div className="tax-item" style={{ marginTop: '16px', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                        <div className="tax-value" style={{ fontSize: '1.5rem' }}>£{taxes.total.toLocaleString()}</div>
                                        <div className="tax-label">{locale === 'tr' ? 'Toplam Tahmini Maliyet' : 'Total Estimated Cost'}</div>
                                    </div>
                                    <p style={{
                                        marginTop: '16px',
                                        padding: '12px',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        background: 'rgba(255, 200, 50, 0.05)',
                                        border: '1px solid rgba(255, 200, 50, 0.15)',
                                        borderRadius: 'var(--radius-md)',
                                        lineHeight: 1.5,
                                    }}>
                                        ⚠️ {locale === 'tr'
                                            ? 'Bu hesaplamalar genel bilgi amaçlıdır ve hukuki tavsiye niteliği taşımaz. Kesin maliyetler için mutlaka bir KKTC avukatına danışın.'
                                            : 'These calculations are for informational purposes only and do not constitute legal advice. Consult a TRNC lawyer for exact costs.'}
                                    </p>
                                </div>

                                <div className="wizard-actions">
                                    <button className="btn btn-outline" onClick={() => setStep('purpose')}>← {locale === 'tr' ? 'Geri' : 'Back'}</button>
                                    <button className="btn btn-primary">
                                        🤖 {locale === 'tr' ? 'Avukat Bul' : 'Find a Lawyer'}
                                    </button>
                                    <button className="btn btn-accent" onClick={() => { setStep('nationality'); setState({ nationality: '', purpose: '', propertyPrice: 150000 }); }}>
                                        ↺ {locale === 'tr' ? 'Yeniden Başla' : 'Start Over'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
