import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GenerateRequest {
    action: 'describe' | 'translate';
    locale?: string;
    // For describe
    propertyType?: string;
    roomConfig?: string;
    city?: string;
    district?: string;
    area?: number;
    features?: string[];
    type?: 'rent' | 'sale';
    price?: number;
    currency?: string;
    // For translate
    text?: string;
    targetLang?: string;
}

export async function POST(request: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json(
            { error: 'AI servisi henüz yapılandırılmamış.' },
            { status: 503 }
        );
    }

    try {
        const body: GenerateRequest = await request.json();

        let prompt = '';

        if (body.action === 'describe') {
            const lang = body.locale === 'tr' ? 'Türkçe' : 'English';
            prompt = `${lang} dilinde bir emlak ilanı açıklaması yaz. Profesyonel, çekici ve bilgilendirici olsun. 3-4 paragraf, toplam 150-200 kelime.

Mülk bilgileri:
- Tip: ${body.type === 'rent' ? 'Kiralık' : 'Satılık'}
- Mülk türü: ${body.propertyType || 'Daire'}
- Oda: ${body.roomConfig || '2+1'}
- Şehir: ${body.city || 'Lefkoşa'}
- Bölge: ${body.district || ''}
- Alan: ${body.area || 100}m²
- Fiyat: ${body.price || 0} ${body.currency || 'GBP'}
- Özellikler: ${(body.features || []).join(', ') || 'Belirtilmemiş'}

Kurallar:
- Bölgenin avantajlarından bahset
- Mülkün öne çıkan özelliklerini vurgula
- "İletişime geçin" gibi bir çağrı ile bitir
- Sadece açıklama metnini döndür, başlık veya etiket ekleme`;
        } else if (body.action === 'translate') {
            if (!body.text) {
                return NextResponse.json({ error: 'Çevrilecek metin gerekli.' }, { status: 400 });
            }
            const target = body.targetLang === 'tr' ? 'Türkçe' : 'English';
            prompt = `Aşağıdaki emlak ilanı açıklamasını ${target} diline çevir. Profesyonel ve doğal bir dil kullan. Sadece çeviriyi döndür, başka bir şey ekleme.

Metin:
${body.text}`;
        } else {
            return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 });
        }

        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.8,
                    topP: 0.9,
                },
            }),
        });

        if (!response.ok) {
            console.error('Gemini API error:', await response.text());
            return NextResponse.json({ error: 'AI yanıt veremedi.' }, { status: 502 });
        }

        const data = await response.json();
        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Generate API error:', error);
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
