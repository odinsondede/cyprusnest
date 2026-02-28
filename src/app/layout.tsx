import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0e1a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cyprusnest.com'),
  title: {
    default: "CyprusNest — AI-Powered Real Estate Platform | North Cyprus (KKTC)",
    template: "%s | CyprusNest",
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
  authors: [{ name: "CyprusNest" }],
  creator: "CyprusNest",
  publisher: "CyprusNest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["tr_TR", "ru_RU", "de_DE", "ar_SA"],
    url: "https://cyprusnest.com",
    siteName: "CyprusNest",
    title: "CyprusNest — AI-Powered Real Estate | North Cyprus",
    description: "Find your dream property in North Cyprus with AI-powered search, virtual staging, and multilingual support.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CyprusNest Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CyprusNest — AI Real Estate Platform | North Cyprus",
    description: "AI-powered property search, virtual staging, legal guides for North Cyprus.",
  },
  alternates: {
    canonical: "https://cyprusnest.com",
    languages: {
      "en": "https://cyprusnest.com",
      "tr": "https://cyprusnest.com?lang=tr",
      "ru": "https://cyprusnest.com?lang=ru",
      "de": "https://cyprusnest.com?lang=de",
      "ar": "https://cyprusnest.com?lang=ar",
    },
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Schema.org — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "CyprusNest",
              "description": "AI-Powered Real Estate Platform for North Cyprus",
              "url": "https://cyprusnest.com",
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
      </body>
    </html>
  );
}
