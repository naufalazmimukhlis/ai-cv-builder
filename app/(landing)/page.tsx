import type { Metadata } from 'next';
import { LandingHero } from '@/components/landing/hero';
import { LandingFeatures } from '@/components/landing/features';
import { LandingHowItWorks } from '@/components/landing/how-it-works';
import { LandingTestimonials } from '@/components/landing/testimonials';
import { LandingFooter } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'ATS CV Builder Pro — Buat CV ATS-Friendly dengan AI dalam 5 Menit',
  description:
    'Platform AI terbaik untuk membuat CV ATS-friendly profesional. Lolos filter ATS, diminati HRD, siap diunduh PDF. Gratis untuk dicoba.',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface overflow-hidden">
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingFooter />
    </main>
  );
}
