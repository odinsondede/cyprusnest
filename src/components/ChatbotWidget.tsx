'use client';

import { useState, useRef, useEffect } from 'react';
import { type Locale } from '@/i18n/translations';

interface ChatMessage {
    role: 'bot' | 'user';
    content: string;
}

const WELCOME_MESSAGES: Record<string, string> = {
    tr: 'Merhaba! 👋 Ben Evlek AI asistanınızım. KKTC\'de mülk aramanızda size yardımcı olabilirim. Bütçenizi, bölgenizi veya arzu ettiğiniz özellikleri söyleyin!',
    en: 'Hello! 👋 I\'m your Evlek AI assistant. I can help you find properties in North Cyprus. Tell me your budget, preferred area, or desired features!',
    ru: 'Привет! 👋 Я AI-ассистент Evlek. Помогу найти недвижимость на Северном Кипре. Расскажите о бюджете, районе или пожеланиях!',
    de: 'Hallo! 👋 Ich bin Ihr Evlek KI-Assistent. Ich helfe Ihnen, Immobilien in Nordzypern zu finden!',
    ar: 'مرحباً! 👋 أنا مساعد Evlek الذكي. يمكنني مساعدتك في العثور على عقارات في شمال قبرص!',
};

const PLACEHOLDER: Record<string, string> = {
    tr: 'Mesajınızı yazın...',
    en: 'Type your message...',
    ru: 'Введите сообщение...',
    de: 'Nachricht eingeben...',
    ar: '...اكتب رسالتك',
};

// Simple local AI response (no API needed for demo)
function getLocalResponse(input: string, locale: string): string {
    const q = input.toLowerCase();

    if (q.includes('rent') || q.includes('kiralık') || q.includes('kira') || q.includes('аренд')) {
        return locale === 'tr'
            ? '🏠 KKTC\'de kiralık daireler £250-800/ay arasında. Girne en popüler bölge. Hangi bölgeyi tercih edersiniz? Bütçeniz nedir?'
            : '🏠 Rental apartments in North Cyprus range from £250-800/month. Kyrenia is the most popular area. Which area do you prefer? What\'s your budget?';
    }
    if (q.includes('buy') || q.includes('satılık') || q.includes('satın') || q.includes('покуп') || q.includes('kaufen')) {
        return locale === 'tr'
            ? '🏷️ KKTC\'de satılık daireler £70K-£500K+ arasında. Yabancı alıcılar max 3 daire alabilir (yeni yasa). Legal Wizard\'ı kullanarak tüm süreci öğrenebilirsiniz.'
            : '🏷️ Apartments for sale in North Cyprus range from £70K-£500K+. Foreign buyers can purchase up to 3 apartments (new law). Use our Legal Wizard to understand the full process.';
    }
    if (q.includes('kyrenia') || q.includes('girne')) {
        return locale === 'tr'
            ? '🌊 Girne — KKTC\'nin en popüler şehri! Ortalama fiyat: £1,582/m². Çatalköy, Alsancak ve Lapta en çok tercih edilen bölgeler. Kira getirisi %8-12 arası.'
            : '🌊 Kyrenia is the most popular city in North Cyprus! Average price: £1,582/m². Catalkoy, Alsancak and Lapta are the most preferred areas. Rental yield 8-12%.';
    }
    if (q.includes('iskele') || q.includes('long beach') || q.includes('bafra')) {
        return locale === 'tr'
            ? '🏖️ İskele — Hızla büyüyen yatırım bölgesi! Ortalama: £1,801/m². Long Beach ve Bafra\'da yeni projeler çok popüler. Yüksek kira getirisi potansiyeli.'
            : '🏖️ Iskele is a fast-growing investment area! Average: £1,801/m². New projects in Long Beach and Bafra are very popular. High rental yield potential.';
    }
    if (q.includes('legal') || q.includes('hukuk') || q.includes('law') || q.includes('tapu') || q.includes('title')) {
        return locale === 'tr'
            ? '⚖️ KKTC\'de mülk satın alma süreci: 1) Mülk seç 2) Avukat tut 3) Sözleşme imzala 4) PTP başvurusu (6-12 ay) 5) Tapu devri. Legal Wizard\'da detaylı rehber var!'
            : '⚖️ Buying property in North Cyprus: 1) Choose property 2) Hire a lawyer 3) Sign contract 4) Apply for PTP (6-12 months) 5) Title deed transfer. See our Legal Wizard for details!';
    }
    if (q.includes('price') || q.includes('fiyat') || q.includes('cost') || q.includes('цен') || q.includes('preis')) {
        return locale === 'tr'
            ? '💰 KKTC 2024 ortalama fiyatları:\n• Daire: £1,273/m² (+%14 yıllık)\n• Villa: £1,823/m² (+%14 yıllık)\n• Girne en pahalı, Lefkoşa en uygun bölge.'
            : '💰 North Cyprus 2024 average prices:\n• Apartments: £1,273/m² (+14% YoY)\n• Villas: £1,823/m² (+14% YoY)\n• Kyrenia is the most expensive, Nicosia the most affordable.';
    }
    if (q.includes('staging') || q.includes('mobilya') || q.includes('furnish') || q.includes('render')) {
        return locale === 'tr'
            ? '🖼️ AI Virtual Staging ile boş odalarınızı 30 saniyede mobilyalı görsellere dönüştürün! 20+ dekorasyon stili. İlan sayfasından "AI Staging" butonuna tıklayın.'
            : '🖼️ Transform empty rooms into furnished visuals in 30 seconds with AI Virtual Staging! 20+ design styles. Click the "AI Staging" button on any listing page.';
    }

    // Default
    return locale === 'tr'
        ? '🤔 Anlıyorum! Size yardımcı olabilmem için bölge tercihinizi (Girne, İskele, Lefkoşa, Gazimağusa), bütçenizi ve kiralık mı yoksa satılık mı aradığınızı söyleyebilir misiniz?'
        : '🤔 I understand! To help you better, could you tell me your preferred area (Kyrenia, Iskele, Nicosia, Famagusta), your budget, and whether you\'re looking to rent or buy?';
}

export default function ChatbotWidget({ locale }: { locale: Locale }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'bot', content: WELCOME_MESSAGES[locale] || WELCOME_MESSAGES['en'] },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Update welcome message when locale changes
    useEffect(() => {
        setMessages([
            { role: 'bot', content: WELCOME_MESSAGES[locale] || WELCOME_MESSAGES['en'] },
        ]);
    }, [locale]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const response = getLocalResponse(userMsg, locale);
            setMessages(prev => [...prev, { role: 'bot', content: response }]);
            setIsTyping(false);
        }, 800 + Math.random() * 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-fab">
            {isOpen && (
                <div className="chatbot-panel">
                    <div className="chatbot-header">
                        <h3>🤖 Evlek AI</h3>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-message typing">●●●</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={PLACEHOLDER[locale] || PLACEHOLDER['en']}
                        />
                        <button onClick={handleSend}>→</button>
                    </div>
                </div>
            )}

            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                title="AI Assistant"
            >
                {isOpen ? '✕' : '🤖'}
            </button>
        </div>
    );
}
