'use client';

import { useState } from 'react';
import { type Locale, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';

const content: Record<string, string> = {
    tr: `# Mülkünüzü Daha Hızlı Satmanın 7 Yolu — KKTC Emlak Pazarlama Rehberi

## Neden Bazı İlanlar Hızlı Satılır?

KKTC emlak piyasasında bazı mülkler günlerde satılırken bazıları aylarca bekler. Fark, mülkün kendisinde değil — pazarlama stratejisindedir.

## 1. Profesyonel Fotoğraf Çektirin

- Telefon kamerasıyla çekilmiş karanlık fotoğraflar alıcıyı kaçırır
- Gündüz, doğal ışıkta çekin
- Her odanın en az 2-3 farklı açısı
- Mutfak, banyo, balkon, manzara mutlaka olsun
- Min 10, ideal 15-20 fotoğraf

## 2. Doğru Fiyatı Belirleyin

- Bölgenizdeki benzer mülkleri araştırın
- Aşırı yüksek fiyat → kimse bakmaz
- Biraz altında fiyat → daha çok ilgi → rekabet → daha iyi teklif
- Evlek'in fiyat analiz aracını kullanın (yakında)

## 3. Detaylı Açıklama Yazın

Kötü: "2+1 daire satılık"
İyi: "Gönyeli merkezde, YDÜ'ye 5 dk yürüme mesafesinde, 2. kat, güney cephe, merkezi ısıtmalı, klimalı, mobilyalı 2+1 daire. Site içinde, otopark mevcut."

## 4. Çoklu Dilde İlan Verin

- KKTC'de alıcılar: Türk, İngiliz, Rus, Güney Kıbrıslı
- Tek dilde ilan = pazarın %25'ine ulaşırsınız
- Evlek 4 dilde otomatik çeviri sunacak (yakında)

## 5. WhatsApp'ı Etkin Kullanın

- KKTC'de herkes WhatsApp kullanır
- İlan linkini gruplarda paylaşın
- Hızlı yanıt verin (2 saat içinde)
- Sesli mesaj da kabul edin

## 6. Sosyal Medyayı Kullanın

- Instagram'da ilan paylaşın (Stories + Reels)
- Facebook grupları: "KKTC Kiralık/Satılık", "Gönyeli Emlak"
- YouTube'da kısa tur videosu (60 sn)

## 7. Doğru Zamanda İlan Verin

- Eylül-Ekim: Öğrenci sezonu → kiralık patlar
- Nisan-Haziran: Yaz öncesi → satılık artar
- Ocak-Şubat: En yavaş dönem

[👉 İlanınızı Evlek'te Yayınlayın](/properties)`,

    en: `# 7 Ways to Sell Your Property Faster — TRNC Real Estate Marketing Guide

## Why Do Some Listings Sell Fast?

In the TRNC real estate market, some properties sell in days while others wait for months. The difference isn't the property itself — it's the marketing strategy.

## 1. Get Professional Photos

- Dark, phone-camera photos drive buyers away
- Shoot during daytime with natural light
- At least 2-3 angles per room
- Kitchen, bathroom, balcony, and views are must-haves
- Minimum 10, ideally 15-20 photos

## 2. Set the Right Price

- Research similar properties in your area
- Overpricing → nobody looks
- Slightly below market → more interest → competition → better offers
- Use Evlek's price analysis tool (coming soon)

## 3. Write Detailed Descriptions

Bad: "2+1 apartment for sale"
Good: "2+1 apartment in Gönyeli center, 5-min walk to NEU, 2nd floor, south-facing, central heating, AC, furnished. Gated community with parking."

## 4. List in Multiple Languages

- TRNC buyers: Turkish, British, Russian, Greek Cypriot
- Single-language listing = reaching only 25% of the market
- Evlek will offer automatic 4-language translation (coming soon)

## 5. Use WhatsApp Effectively

- Everyone in TRNC uses WhatsApp
- Share listing links in groups
- Respond quickly (within 2 hours)
- Accept voice messages too

## 6. Use Social Media

- Share listings on Instagram (Stories + Reels)
- Facebook groups: "TRNC Rentals", "Gönyeli Property"
- Short tour video on YouTube (60 sec)

## 7. List at the Right Time

- September-October: Student season → rentals boom
- April-June: Pre-summer → sales increase
- January-February: Slowest period

[👉 List Your Property on Evlek](/properties)`,
};

export default function SellFasterPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const articleContent = content[locale] || content['en'];

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="blog" />
            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '780px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <a href="/blog" style={{ color: 'var(--primary-light)', fontSize: '0.9rem' }}>← {locale === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}</a>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <span style={{ padding: '4px 12px', background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>📈 Marketing</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-02-24</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 6 min</span>
                    </div>
                    <article style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        {articleContent.split('\n').map((line: string, i: number) => {
                            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '24px' }}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', color: 'var(--primary-light)', marginTop: '20px', marginBottom: '8px' }}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '20px', marginBottom: '4px' }}>{line.replace('- ', '')}</li>;
                            if (line.match(/^\d+\./)) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px' }}>{line.replace(/^\d+\.\s/, '')}</li>;
                            if (line.startsWith('[')) { const m = line.match(/\[(.+)\]\((.+)\)/); if (m) return <a key={i} href={m[2]} className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>{m[1]}</a>; }
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i} style={{ marginBottom: '8px' }}>{line}</p>;
                        })}
                    </article>
                </div>
            </main>
            <ChatbotWidget locale={locale} />
        </div>
    );
}
