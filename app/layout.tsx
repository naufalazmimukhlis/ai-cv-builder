import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ATS CV Builder Pro — AI Resume Generator Lokal',
    template: '%s | ATS CV Builder Pro',
  },
  description:
    'Platform AI Resume Builder Lokal tercepat dan termudah. Dioptimasi untuk sistem ATS, privasi terjaga 100%, dan tanpa biaya langganan. Lolos filter HRD dalam sekejap.',
  keywords: [
    'CV builder',
    'ATS CV',
    'AI CV builder',
    'resume generator',
    'professional CV',
    'ATS friendly',
    'local first CV',
  ],
  authors: [{ name: 'ATS CV Builder Team' }],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://ai-cv-builder.pro',
    title: 'ATS CV Builder Pro — AI Resume Generator Lokal',
    description: 'Buat CV ATS-Friendly dalam hitungan detik dengan Local Intelligence Engine.',
    siteName: 'ATS CV Builder Pro',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'ATS CV Builder Pro Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'ATS CV Builder Pro',
    description: 'Buat CV ATS-Friendly dalam hitungan detik dengan Local Intelligence Engine.',
    images: ['/icon.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F2040',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${ibmPlexSans.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={ibmPlexSans.className}>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
