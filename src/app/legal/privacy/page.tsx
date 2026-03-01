'use client';

import { useState } from 'react';
import { type Locale } from '@/i18n/translations';
import Navbar from '@/components/Navbar';

export default function PrivacyPolicyPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    const content = {
        tr: {
            title: 'Gizlilik Politikası',
            lastUpdated: 'Son güncelleme: 2 Mart 2026',
            sections: [
                {
                    title: '1. Giriş',
                    text: 'Evlek ("biz", "bizim") olarak, kişisel verilerinizin korunmasını ciddiye alıyoruz. Bu Gizlilik Politikası, evlek.app platformunu kullanırken hangi verileri topladığımızı, nasıl kullandığımızı ve nasıl koruduğumuzu açıklamaktadır. KKTC Kişisel Verilerin Korunması Yasası (2007) ve uluslararası en iyi uygulamalar çerçevesinde hareket ediyoruz.',
                },
                {
                    title: '2. Topladığımız Veriler',
                    text: `Platformumuzu kullanırken aşağıdaki verileri topluyoruz:

• **Hesap bilgileri:** E-posta adresi, ad-soyad, şifre (şifrelenmiş olarak saklanır)
• **İlan bilgileri:** Mülk detayları, fotoğraflar, fiyat, konum, iletişim bilgileri (telefon, WhatsApp, Telegram)
• **Kullanım verileri:** Sayfa ziyaretleri, arama sorguları, favori listeleri
• **Teknik veriler:** IP adresi, tarayıcı türü, cihaz bilgisi, çerezler
• **İletişim verileri:** İletişim formu aracılığıyla gönderdiğiniz mesajlar`,
                },
                {
                    title: '3. Verilerin Kullanım Amaçları',
                    text: `Kişisel verilerinizi aşağıdaki amaçlarla kullanıyoruz:

• Hesabınızı oluşturmak ve yönetmek
• İlan yayınlama ve yönetme hizmetleri sunmak
• Platform deneyiminizi kişiselleştirmek (dil tercihi, favoriler)
• AI chatbot ile size yardımcı olmak (verileriniz AI modeline gönderilmez, sadece soru metni işlenir)
• Güvenlik ve dolandırıcılık önleme
• Yasal yükümlülükleri yerine getirmek
• Platform performansını analiz etmek ve iyileştirmek`,
                },
                {
                    title: '4. Verilerin Saklanması ve Güvenliği',
                    text: `Verileriniz aşağıdaki altyapıda güvenli olarak saklanmaktadır:

• **Veritabanı:** Supabase (PostgreSQL) — şifreli bağlantı, satır düzeyinde güvenlik (RLS) ile korunmaktadır
• **Dosya depolama:** Supabase Storage — güvenli erişim kontrolleri ile
• **Web barındırma:** Vercel — otomatik SSL/TLS şifreleme, DDoS koruması
• **Şifreler:** bcrypt ile hash'lenerek saklanır, düz metin olarak asla kaydedilmez
• **Auth tokenları:** JWT tabanlı, oturum bazlı güvenlik`,
                },
                {
                    title: '5. Veri Paylaşımı',
                    text: `Kişisel verilerinizi üçüncü taraflarla **satmıyoruz**. Aşağıdaki sınırlı durumlarda paylaşılabilir:

• **Hizmet sağlayıcılar:** Supabase (veritabanı), Vercel (hosting), Google (analytics, OAuth) — yalnızca hizmet sunumu amacıyla
• **Yasal zorunluluk:** Mahkeme kararı veya yasal düzenleme gereği
• **İlan görünürlüğü:** İlanlarınızdaki iletişim bilgileri (telefon/WhatsApp/Telegram) diğer kullanıcılar tarafından görülebilir — bu bilgileri siz paylaşmayı tercih ediyorsunuz`,
                },
                {
                    title: '6. Uluslararası Veri Aktarımı',
                    text: 'Verileriniz, hizmet sağlayıcılarımız (Supabase, Vercel) aracılığıyla KKTC dışındaki sunucularda işlenebilir. Bu sağlayıcılar, uluslararası güvenlik standartlarına (SOC 2 Type II, ISO 27001) uyumludur. KKTC Kişisel Verileri Koruma Kurulu\'nun belirlediği prosedürlere uygun hareket etmekteyiz.',
                },
                {
                    title: '7. Çerezler',
                    text: `Platformumuz aşağıdaki çerezleri kullanmaktadır:

• **Zorunlu çerezler:** Oturum yönetimi, dil tercihi — platformun çalışması için gerekli
• **Analitik çerezler:** Vercel Analytics — anonim kullanım istatistikleri (kişisel veri toplamaz)

Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bazı özellikler çalışmayabilir.`,
                },
                {
                    title: '8. Haklarınız',
                    text: `KKTC Kişisel Verilerin Korunması Yasası kapsamında aşağıdaki haklara sahipsiniz:

• Kişisel verilerinize erişim talep etme
• Yanlış verilerin düzeltilmesini isteme
• Verilerinizin silinmesini talep etme
• Veri işlemeye itiraz etme
• Verilerinizin taşınabilirliğini talep etme

Bu haklarınızı kullanmak için info@evlek.app adresine e-posta gönderebilirsiniz.`,
                },
                {
                    title: '9. Çocukların Gizliliği',
                    text: 'Platformumuz 18 yaşından küçük bireylere yönelik değildir. Bilerek 18 yaşından küçük bireylerden kişisel veri toplamıyoruz.',
                },
                {
                    title: '10. Politika Değişiklikleri',
                    text: 'Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda, platformda bildirim yayınlayarak veya e-posta göndererek sizi bilgilendireceğiz.',
                },
                {
                    title: '11. İletişim',
                    text: `Gizlilik politikamız hakkında sorularınız için:

📧 E-posta: info@evlek.app
🌐 Web: evlek.app/contact`,
                },
            ],
        },
        en: {
            title: 'Privacy Policy',
            lastUpdated: 'Last updated: March 2, 2026',
            sections: [
                {
                    title: '1. Introduction',
                    text: 'At Evlek ("we", "our"), we take the protection of your personal data seriously. This Privacy Policy explains what data we collect when you use the evlek.app platform, how we use it, and how we protect it. We operate in accordance with the TRNC Personal Data Protection Law (2007) and international best practices.',
                },
                {
                    title: '2. Data We Collect',
                    text: `We collect the following data when you use our platform:

• **Account information:** Email address, full name, password (stored encrypted)
• **Listing information:** Property details, photos, price, location, contact details (phone, WhatsApp, Telegram)
• **Usage data:** Page visits, search queries, favorites lists
• **Technical data:** IP address, browser type, device info, cookies
• **Communication data:** Messages sent through the contact form`,
                },
                {
                    title: '3. How We Use Your Data',
                    text: `We use your personal data for the following purposes:

• Creating and managing your account
• Providing listing publishing and management services
• Personalizing your experience (language preference, favorites)
• Assisting you via AI chatbot (your data is not sent to AI models, only query text is processed)
• Security and fraud prevention
• Fulfilling legal obligations
• Analyzing and improving platform performance`,
                },
                {
                    title: '4. Data Storage and Security',
                    text: `Your data is securely stored using the following infrastructure:

• **Database:** Supabase (PostgreSQL) — encrypted connections, row-level security (RLS)
• **File storage:** Supabase Storage — secure access controls
• **Web hosting:** Vercel — automatic SSL/TLS encryption, DDoS protection
• **Passwords:** Hashed using bcrypt, never stored in plain text
• **Auth tokens:** JWT-based, session-level security`,
                },
                {
                    title: '5. Data Sharing',
                    text: `We do **not sell** your personal data. It may be shared in the following limited cases:

• **Service providers:** Supabase (database), Vercel (hosting), Google (analytics, OAuth) — solely for service delivery
• **Legal requirements:** Court orders or legal regulations
• **Listing visibility:** Contact info in your listings (phone/WhatsApp/Telegram) is visible to other users — you choose to share this info`,
                },
                {
                    title: '6. International Data Transfers',
                    text: 'Your data may be processed on servers outside TRNC through our service providers (Supabase, Vercel). These providers comply with international security standards (SOC 2 Type II, ISO 27001). We act in accordance with procedures established by the TRNC Personal Data Protection Board.',
                },
                {
                    title: '7. Cookies',
                    text: `Our platform uses the following cookies:

• **Essential cookies:** Session management, language preference — required for platform functionality
• **Analytics cookies:** Vercel Analytics — anonymous usage statistics (does not collect personal data)

You can disable cookies through your browser settings, but some features may not work properly.`,
                },
                {
                    title: '8. Your Rights',
                    text: `Under the TRNC Personal Data Protection Law, you have the following rights:

• Request access to your personal data
• Request correction of inaccurate data
• Request deletion of your data
• Object to data processing
• Request data portability

To exercise these rights, email us at info@evlek.app.`,
                },
                {
                    title: '9. Children\'s Privacy',
                    text: 'Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors.',
                },
                {
                    title: '10. Policy Changes',
                    text: 'We may update this policy from time to time. When significant changes occur, we will notify you through platform announcements or email.',
                },
                {
                    title: '11. Contact',
                    text: `For questions about our privacy policy:

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
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🔒 {c.title}</h1>
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
