import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `Sen Evlek AI asistanısın. Kuzey Kıbrıs Türk Cumhuriyeti'nde (KKTC) emlak konusunda uzman bir yardımcısın.

Görevlerin:
- KKTC'de kiralık ve satılık mülkler hakkında bilgi vermek
- Bölgeler hakkında tavsiye vermek (Girne, Lefkoşa, Gazimağusa, İskele, Güzelyurt)
- Fiyat aralıkları hakkında genel bilgi vermek
- Hukuki süreçler (PTP, tapu, vergiler) hakkında genel bilgi vermek
- Kullanıcıyı doğru sayfalara yönlendirmek

Kuralların:
- Kısa ve öz cevaplar ver (max 3-4 cümle)
- Hukuki konularda "mutlaka bir avukata danışın" uyarısı ekle
- Fiyatlar hakkında kesin bilgi verme, "yaklaşık" veya "ortalama" kullan
- Evlek platformunun özelliklerinden bahset (ücretsiz ilan, AI asistan, 5 dil desteği)
- Kullanıcının diline göre cevap ver (Türkçe soruyorsa Türkçe, İngilizce soruyorsa İngilizce)
- Samimi ve profesyonel ol`;

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export async function POST(request: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json(
            { error: 'AI servisi henüz yapılandırılmamış.' },
            { status: 503 }
        );
    }

    try {
        const { message, history = [], locale = 'tr' } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Geçersiz mesaj.' },
                { status: 400 }
            );
        }

        // Build conversation history for Gemini
        const contents: ChatMessage[] = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT + `\n\nKullanıcının dili: ${locale}` }],
            },
            {
                role: 'model',
                parts: [{
                    text: locale === 'tr'
                        ? 'Anladım! KKTC emlak konusunda size yardımcı olmaya hazırım. Nasıl yardımcı olabilirim?'
                        : 'Understood! I\'m ready to help you with North Cyprus real estate. How can I help you?'
                }],
            },
            // Add conversation history
            ...history.slice(-6).map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })),
            // Add current message
            {
                role: 'user',
                parts: [{ text: message }],
            },
        ];

        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    maxOutputTokens: 300,
                    temperature: 0.7,
                    topP: 0.9,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', errorData);
            return NextResponse.json(
                { error: 'AI yanıt veremedi. Lütfen tekrar deneyin.' },
                { status: 502 }
            );
        }

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            (locale === 'tr' ? 'Üzgünüm, şu anda yanıt veremedim.' : 'Sorry, I could not respond right now.');

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu.' },
            { status: 500 }
        );
    }
}
