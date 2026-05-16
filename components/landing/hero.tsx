'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, Zap, Target, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATS = [
  { value: '10,000+', label: 'CV dibuat' },
  { value: '94%', label: 'Lolos ATS' },
  { value: '5 menit', label: 'Waktu rata-rata' },
];

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col hero-gradient" aria-label="Hero section">
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5" role="navigation" aria-label="Navigasi utama">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-display font-bold text-primary text-lg">ATS CV Builder</span>
          <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">Pro</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-[#64748B] hover:text-primary transition-colors font-medium">Fitur</a>
          <a href="#how-it-works" className="text-sm text-[#64748B] hover:text-primary transition-colors font-medium">Cara Kerja</a>
          <Link href="/builder" id="nav-cta">
            <Button variant="primary" size="sm">
              Mulai Gratis
            </Button>
          </Link>
        </div>
        {/* Mobile CTA */}
        <Link href="/builder" className="md:hidden" id="nav-cta-mobile">
          <Button variant="primary" size="sm">Mulai</Button>
        </Link>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-ai/8 border border-ai/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-ai" aria-hidden="true" />
              <span className="text-xs font-semibold text-ai">AI-Powered • Google Gemini</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-display-lg font-display font-bold text-primary leading-tight mb-4 text-balance"
            >
              CV ATS Profesional{' '}
              <span className="gradient-text">dalam 5 Menit</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="text-lg text-[#64748B] mb-8 leading-relaxed text-balance"
            >
              Dioptimasi AI · Lolos ATS · Diminati HRD
              <br />
              <span className="text-base">Buat CV yang menonjol dan siap diunduh sebagai PDF profesional.</span>
            </motion.p>

            {/* Benefits */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="space-y-2.5 mb-8"
              aria-label="Keunggulan"
            >
              {[
                'Analisis keyword ATS dari job description',
                'Optimalkan bullet point dengan STAR method',
                'Generate professional summary dalam bahasa profesional',
                'Download PDF siap kirim',
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5 text-sm text-[#1A2332]">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/builder" id="hero-primary-cta">
                <Button variant="warm" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto">
                  Buat CV Sekarang
                </Button>
              </Link>
              <a href="#how-it-works" id="hero-secondary-cta">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Lihat Cara Kerja
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-8 mt-8 pt-8 border-t border-border"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-display font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-[#64748B]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: CV Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
            aria-label="Contoh pratinjau CV"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 via-ai/10 to-warm/10 rounded-3xl blur-2xl" aria-hidden="true" />

              {/* CV Card */}
              <div className="relative bg-white rounded-2xl shadow-modal border border-border/50 overflow-hidden">
                {/* ATS Score Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                    <Target className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                    <span className="text-xs font-bold text-success">ATS 92/100</span>
                  </div>
                </div>

                {/* CV Preview content */}
                <div className="p-6 pt-5">
                  <div className="border-b-2 border-primary pb-3 mb-3">
                    <div className="text-xl font-bold text-primary">Ahmad Rizky Pratama</div>
                    <div className="text-sm text-accent mt-0.5">Senior Software Engineer</div>
                    <div className="text-xs text-[#64748B] mt-1.5 flex flex-wrap gap-3">
                      <span>ahmad@email.com</span>
                      <span>+62 812-3456-7890</span>
                      <span>Jakarta</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Ringkasan Profesional</div>
                    <div className="h-px bg-primary mb-2" />
                    <p className="text-[10px] text-[#333] leading-relaxed">
                      Software Engineer berpengalaman 5 tahun dengan keahlian React, Node.js, dan AWS. Berhasil meningkatkan performa sistem sebesar 40% dan memimpin tim 8 developer dalam merancang arsitektur microservices untuk 500K+ pengguna.
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Pengalaman Kerja</div>
                    <div className="h-px bg-primary mb-2" />
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[10px] font-bold text-primary">Senior Software Engineer</span>
                      <span className="text-[9px] text-[#555]">2021 – Sekarang</span>
                    </div>
                    <div className="text-[9.5px] text-[#333] mb-1">PT Teknologi Maju | Jakarta</div>
                    <ul className="space-y-0.5">
                      {[
                        'Mengembangkan platform e-commerce yang meningkatkan konversi 35% dalam 6 bulan',
                        'Memimpin tim 8 developer dalam migrasi ke arsitektur microservices',
                        'Mengoptimalkan query database yang mengurangi latency API sebesar 60%',
                      ].map((b, i) => (
                        <li key={i} className="text-[9.5px] text-[#222] pl-3 relative">
                          <span className="absolute left-0 text-primary">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Keahlian</div>
                    <div className="h-px bg-primary mb-2" />
                    <div className="text-[9.5px] text-[#222]">
                      <span className="font-semibold text-primary">Technical: </span>
                      React, Node.js, TypeScript, Python, PostgreSQL, Redis
                    </div>
                    <div className="text-[9.5px] text-[#222] mt-0.5">
                      <span className="font-semibold text-primary">Tools: </span>
                      Docker, Kubernetes, AWS, Git, Jira
                    </div>
                  </div>
                </div>

                {/* AI Enhanced badge */}
                <div className="bg-gradient-to-r from-ai/5 to-accent/5 border-t border-border/50 px-6 py-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-ai" aria-hidden="true" />
                  <span className="text-xs text-ai font-medium">Disempurnakan dengan AI • Siap untuk ATS</span>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-card border border-border px-3 py-2 flex items-center gap-2"
                aria-hidden="true"
              >
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-xs font-semibold text-[#1A2332]">AI Optimized</span>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -right-6 bottom-1/4 bg-white rounded-xl shadow-card border border-border px-3 py-2 flex items-center gap-2"
                aria-hidden="true"
              >
                <Shield className="w-4 h-4 text-success" />
                <span className="text-xs font-semibold text-[#1A2332]">ATS Ready</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center pb-8" aria-hidden="true">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-1 text-[#64748B]"
        >
          <div className="text-xs">Scroll</div>
          <div className="w-5 h-8 border-2 border-border rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#64748B] rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
