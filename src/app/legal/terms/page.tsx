'use client';

import { useState } from 'react';
import { type Locale } from '@/i18n/translations';
import Navbar from '@/components/Navbar';

export default function TermsOfServicePage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    const content = {
        tr: {
            title: 'Kullanım Şartları',
            lastUpdated: 'Son güncelleme: 2 Mart 2026',
            sections: [
                {
                    title: '1. Hizmet Tanımı',
                    text: 'Evlek (evlek.app), Kuzey Kıbrıs Türk Cumhuriyeti\'nde (KKTC) kiralık ve satılık mülk ilanlarını yayınlayan bir online ilan platformudur. Evlek bir emlak ofisi veya aracı kurum değildir; mülk alım-satım işlemlerinde aracılık yapmaz ve komisyon almaz.',
                },
                {
                    title: '2. Kabul ve Kayıt',
                    text: `Platformumuzu kullanarak bu şartları kabul etmiş sayılırsınız.

• Hesap oluşturmak için 18 yaşından büyük olmalısınız.
• Kayıt bilgilerinizin doğru ve güncel olduğunu taahhüt edersiniz.
• Hesap güvenliğinizden siz sorumlusunuz.`,
                },
                {
                    title: '3. İlan Yayınlama Kuralları',
                    text: `İlan sahipleri aşağıdaki kurallara uymakla yükümlüdür:

• İlanlardaki bilgiler doğru ve güncel olmalıdır.
• Başka kişilere ait mülkleri izinsiz ilan edemezsiniz.
• Sahte, yanıltıcı veya mevcut olmayan mülklere ait ilan yayınlayamazsınız.
• İlan fotoğrafları gerçek mülke ait olmalıdır.
• İlan içeriklerinde hakaret, ayrımcılık veya yasa dışı içerik bulunamaz.
• Evlek, kurallara aykırı ilanları önceden bildirimde bulunmaksızın kaldırma hakkını saklı tutar.`,
                },
                {
                    title: '4. Sorumluluk Sınırlaması',
                    text: `**Önemli:**

• Evlek bir ilan platformudur ve ilanların doğruluğundan, güncelliğinden veya yasallığından sorumlu değildir.
• İlan sahipleri ile potansiyel alıcı/kiracılar arasındaki iletişim, müzakere ve anlaşmalar tamamen taraflar arasında gerçekleşir.
• Evlek, herhangi bir mülk işleminde ortaya çıkabilecek kayıp, zarar veya anlaşmazlıklardan sorumlu tutulamaz.
• Platform üzerinden elde edilen bilgiler genel bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz.
• KKTC'de mülk alım-satımı için mutlaka yerel bir avukattan profesyonel hukuki destek almanızı öneriyoruz.`,
                },
                {
                    title: '5. Fikri Mülkiyet',
                    text: `• Evlek platformundaki tasarım, logo, yazılım ve içerikler Evlek\'e aittir ve telif hakkı ile korunmaktadır.
• Kullanıcılar tarafından yüklenen ilan fotoğrafları ve açıklamaları üzerindeki haklar ilgili kullanıcılara aittir.
• Kullanıcılar, yükledikleri içeriklerin Evlek platformunda yayınlanmasına izin verdiklerini kabul eder.`,
                },
                {
                    title: '6. Fiyatlandırma ve Ödemeler',
                    text: `• Temel ilan yayınlama hizmeti ücretsizdir.
• Pro ve Business abonelik planları ek özellikler sunar ve aylık ücrete tabidir.
• Fiyatlar önceden bildirimde bulunularak değiştirilebilir.
• Ödeme yapıldıktan sonra iade politikası uygulanmaz (aktif abonelik dönemi boyunca hizmet devam eder).`,
                },
                {
                    title: '7. Hesap Askıya Alma ve Sonlandırma',
                    text: `Evlek, aşağıdaki durumlarda hesabınızı askıya alabilir veya sonlandırabilir:

• Bu kullanım şartlarının ihlali
• Sahte veya yanıltıcı ilanlar yayınlanması
• Diğer kullanıcılara yönelik taciz veya dolandırıcılık
• Platform güvenliğini tehdit eden faaliyetler`,
                },
                {
                    title: '8. Uygulanacak Hukuk',
                    text: 'Bu kullanım şartları, Kuzey Kıbrıs Türk Cumhuriyeti (KKTC) yasalarına tabidir. Herhangi bir anlaşmazlık durumunda KKTC mahkemeleri yetkilidir.',
                },
                {
                    title: '9. Değişiklikler',
                    text: 'Bu şartları zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda, platformda bildirim yayınlayarak veya e-posta göndererek sizi bilgilendireceğiz. Güncellenen şartları kabul etmiyorsanız, hesabınızı kapatabilirsiniz.',
                },
                {
                    title: '10. İletişim',
                    text: `Kullanım şartları hakkında sorularınız için:

📧 E-posta: info@evlek.app
🌐 Web: evlek.app/contact`,
                },
            ],
        },
        en: {
            title: 'Terms of Service',
            lastUpdated: 'Last updated: March 2, 2026',
            sections: [
                {
                    title: '1. Service Description',
                    text: 'Evlek (evlek.app) is an online listing platform that publishes rental and sale property listings in the Turkish Republic of Northern Cyprus (TRNC). Evlek is not a real estate agency or brokerage; it does not mediate property transactions and does not charge commissions.',
                },
                {
                    title: '2. Acceptance and Registration',
                    text: `By using our platform, you agree to these terms.

• You must be at least 18 years old to create an account.
• You guarantee that your registration information is accurate and up to date.
• You are responsible for the security of your account.`,
                },
                {
                    title: '3. Listing Rules',
                    text: `Listing owners must comply with the following rules:

• Information in listings must be accurate and current.
• You may not list properties belonging to others without permission.
• You may not publish fake, misleading, or non-existent property listings.
• Listing photos must depict the actual property.
• Listings may not contain offensive, discriminatory, or illegal content.
• Evlek reserves the right to remove listings that violate these rules without prior notice.`,
                },
                {
                    title: '4. Limitation of Liability',
                    text: `**Important:**

• Evlek is a listing platform and is not responsible for the accuracy, currency, or legality of listings.
• Communication, negotiation, and agreements between listing owners and potential buyers/tenants occur entirely between the parties.
• Evlek cannot be held responsible for any loss, damage, or disputes arising from property transactions.
• Information obtained through the platform is for general informational purposes and does not constitute legal advice.
• We strongly recommend obtaining professional legal support from a local lawyer for property transactions in TRNC.`,
                },
                {
                    title: '5. Intellectual Property',
                    text: `• The design, logo, software, and content on the Evlek platform are owned by Evlek and protected by copyright.
• Rights to listing photos and descriptions uploaded by users belong to the respective users.
• Users agree to allow the content they upload to be published on the Evlek platform.`,
                },
                {
                    title: '6. Pricing and Payments',
                    text: `• Basic listing publishing is free.
• Pro and Business subscription plans offer additional features at a monthly fee.
• Prices may be changed with prior notice.
• No refund policy applies after payment (service continues throughout the active subscription period).`,
                },
                {
                    title: '7. Account Suspension and Termination',
                    text: `Evlek may suspend or terminate your account in the following cases:

• Violation of these terms of service
• Publishing fake or misleading listings
• Harassment or fraud against other users
• Activities threatening platform security`,
                },
                {
                    title: '8. Governing Law',
                    text: 'These terms of service are governed by the laws of the Turkish Republic of Northern Cyprus (TRNC). In case of any dispute, TRNC courts shall have jurisdiction.',
                },
                {
                    title: '9. Changes',
                    text: 'We may update these terms from time to time. When significant changes occur, we will notify you through platform announcements or email. If you do not agree to the updated terms, you may close your account.',
                },
                {
                    title: '10. Contact',
                    text: `For questions about our terms of service:

📧 Email: info@evlek.app
🌐 Web: evlek.app/contact`,
                },
            ],
        },
    };

    const c = content[locale as 'tr' | 'en'] || content.en;

    return (
        <div dir={dir}>
            <Navbar locale={locale} onLocaleChange={setLocale} />
            <main style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <a href="/legal" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
                        ← {locale === 'tr' ? 'Hukuki Rehber' : 'Legal Guide'}
                    </a>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>📋 {c.title}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '48px' }}>{c.lastUpdated}</p>

                    {c.sections.map((section, i) => (
                        <div key={i} style={{ marginBottom: '36px' }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{section.title}</h2>
                            <div style={{
                                fontSize: '0.95rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.8,
                                whiteSpace: 'pre-line',
                            }}>
                                {section.text.split('**').map((part, j) =>
                                    j % 2 === 1
                                        ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{part}</strong>
                                        : <span key={j}>{part}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
