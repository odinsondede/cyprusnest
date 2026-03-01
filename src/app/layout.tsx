import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B6B93',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://evlek.app'),
  title: {
    default: "Evlek — AI-Powered Real Estate Platform | North Cyprus (KKTC)",
    template: "%s | Evlek",
  },
  description: "Find rental & sale properties in North Cyprus with AI assistance. Virtual staging, legal guides, tax calculator. Multilingual: TR, EN, RU, DE, AR. Kyrenia, Iskele, Nicosia, Famagusta.",
  keywords: [
    "North Cyprus property", "KKTC emlak", "Kyrenia apartment", "Iskele villa",
    "rent north cyprus", "buy property north cyprus", "virtual staging",
    "AI real estate", "Gönyeli kiralık", "Nicosia rent", "Famagusta apartment",
    "KKTC kiralık daire", "north cyprus investment", "PTP north cyprus",
    "north cyprus tax calculator", "TRNC property", "купить квартиру Северный Кипр",
    "Nordzypern Immobilien", "عقارات شمال قبرص",
  ],
  authors: [{ name: "Evlek" }],
  creator: "Evlek",
  publisher: "Evlek",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["tr_TR", "ru_RU", "de_DE", "ar_SA"],
    url: "https://evlek.app",
    siteName: "Evlek",
    title: "Evlek — AI-Powered Real Estate | North Cyprus",
    description: "Find your dream property in North Cyprus with AI-powered search, virtual staging, and multilingual support.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Evlek Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evlek — AI Real Estate Platform | North Cyprus",
    description: "AI-powered property search, virtual staging, legal guides for North Cyprus.",
  },
  alternates: {
    canonical: "https://evlek.app",
    languages: {
      "en": "https://evlek.app",
      "tr": "https://evlek.app?lang=tr",
      "ru": "https://evlek.app?lang=ru",
      "de": "https://evlek.app?lang=de",
      "ar": "https://evlek.app?lang=ar",
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Schema.org — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Evlek",
              "description": "AI-Powered Real Estate Platform for North Cyprus",
              "url": "https://evlek.app",
              "areaServed": {
                "@type": "Country",
                "name": "Northern Cyprus"
              },
              "availableLanguage": ["Turkish", "English", "Russian", "German", "Arabic"],
              "knowsAbout": ["Real Estate", "Property Investment", "Virtual Staging", "North Cyprus Law"],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
