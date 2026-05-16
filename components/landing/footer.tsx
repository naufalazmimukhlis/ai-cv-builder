'use client';

import Link from 'next/link';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import translations from '@/data/translations.json';

export function LandingFooter() {
  const language = useCVStore((s) => s.language) || 'id';
  const lt = (translations as any).landing[language];

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 bg-primary" aria-labelledby="footer-cta-title">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h2 id="footer-cta-title" className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {language === 'id' ? 'Siap Membuat CV yang Mengubah Karir?' : 'Ready to Create a Career-Changing CV?'}
          </h2>
          <p className="text-white/70 text-lg mb-8 font-medium">
            {language === 'id' 
              ? 'Bergabung dengan 10,000+ job seeker yang sudah berhasil mendapatkan pekerjaan impian.' 
              : 'Join 10,000+ job seekers who have successfully landed their dream jobs.'}
          </p>
          <Link href="/builder" id="footer-cta-button">
            <Button
              variant="warm"
              size="xl"
              style={{ backgroundColor: '#000', color: '#fff' }}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {lt.cta_footer}
            </Button>
          </Link>
          <p className="text-white/50 text-sm mt-4 font-medium">{lt.no_registration}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1929] px-6 lg:px-12 py-10" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-white text-sm">ATS CV Builder Pro</span>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-6" aria-label="Footer navigation">
              <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors font-bold">
                {language === 'id' ? 'Fitur' : 'Features'}
              </a>
              <a href="#how-it-works" className="text-sm text-white/50 hover:text-white transition-colors font-bold">
                {language === 'id' ? 'Cara Kerja' : 'How it Works'}
              </a>
              <Link href="/builder" className="text-sm text-white/50 hover:text-white transition-colors font-bold">
                {language === 'id' ? 'Buat CV' : 'Create CV'}
              </Link>
            </nav>

            {/* Credit */}
            <div className="flex items-center gap-1.5 text-xs text-white/40 font-bold">
              <span>{language === 'id' ? 'Dibuat dengan' : 'Made with'}</span>
              <Heart className="w-3 h-3 text-danger fill-danger" aria-hidden="true" />
              <span>{language === 'id' ? 'di Indonesia' : 'in Indonesia'}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/30 font-medium">
              © {new Date().getFullYear()} ATS CV Builder Pro. {lt.footer_tagline}
              <br />
              {language === 'id' ? 'Data Anda tidak disimpan di server kami.' : 'Your data is not stored on our servers.'}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
