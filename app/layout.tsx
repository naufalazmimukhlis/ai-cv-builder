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
    default: 'ATS CV Builder Pro — Buat CV ATS-Friendly dengan AI',
    template: '%s | ATS CV Builder Pro',
  },
  description:
    'Buat CV ATS-friendly profesional dalam 5 menit dengan bantuan AI. Dioptimasi untuk lolos filter ATS, diminati HRD, dan siap diunduh sebagai PDF.',
  keywords: [
    'CV builder',
    'ATS CV',
    'CV ATS Indonesia',
    'buat CV online',
    'CV profesional',
    'AI CV builder',
    'resume builder',
    'template CV ATS',
  ],
  authors: [{ name: 'ATS CV Builder Pro' }],
  creator: 'ATS CV Builder Pro',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://ats-cv-builder.vercel.app',
    title: 'ATS CV Builder Pro — Buat CV ATS-Friendly dengan AI',
    description:
      'Buat CV ATS-friendly profesional dalam 5 menit. Dioptimasi AI, lolos ATS, diminati HRD.',
    siteName: 'ATS CV Builder Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS CV Builder Pro',
    description: 'Buat CV ATS-friendly profesional dalam 5 menit dengan bantuan AI.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
