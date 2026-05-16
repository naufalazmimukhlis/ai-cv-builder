'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    step: '01',
    icon: ClipboardList,
    color: 'text-accent',
    bg: 'from-accent/10 to-accent/5',
    border: 'border-accent/20',
    title: 'Isi Data CV (5 Langkah)',
    description:
      'Lengkapi informasi pribadi, target posisi, pengalaman kerja, keahlian, dan pendidikan melalui form yang mudah dan intuitif. Data tersimpan otomatis.',
    detail: 'Info Pribadi → Target Posisi → Pengalaman → Keahlian → Pendidikan',
  },
  {
    step: '02',
    icon: Sparkles,
    color: 'text-ai',
    bg: 'from-ai/10 to-ai/5',
    border: 'border-ai/20',
    title: 'AI Sempurnakan CV Anda',
    description:
      'Klik "Sempurnakan dengan AI" dan biarkan Gemini AI mengoptimalkan seluruh CV — dari summary hingga bullet points — sesuai standar ATS dan preferensi HRD.',
    detail: 'Analisis JD → Extract Keywords → Optimize Content → ATS Score',
  },
  {
    step: '03',
    icon: Download,
    color: 'text-success',
    bg: 'from-success/10 to-success/5',
    border: 'border-success/20',
    title: 'Preview & Unduh PDF',
    description:
      'Review CV dalam pratinjau real-time, lakukan penyesuaian, dan unduh sebagai PDF profesional siap kirim dengan format ATS-friendly.',
    detail: 'Live Preview → Adjust → Download PDF',
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-white" aria-labelledby="how-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 id="how-title" className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Cara Kerja{' '}
            <span className="gradient-text-ai">3 Langkah</span>
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto">
            Dari nol hingga CV profesional siap kirim, hanya dalam 5 menit.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 relative">
          {/* Connecting arrows (desktop) */}
          <div className="hidden md:block absolute top-8 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent/30 to-ai/30" aria-hidden="true" />
          <div className="hidden md:block absolute top-8 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-ai/30 to-success/30" aria-hidden="true" />

          {STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="relative"
            >
              <div className={`bg-gradient-to-br ${step.bg} border ${step.border} rounded-2xl p-6 h-full`}>
                {/* Step number */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-white shadow-card flex items-center justify-center`}>
                    <step.icon className={`w-5 h-5 ${step.color}`} aria-hidden="true" />
                  </div>
                  <span className="text-3xl font-display font-bold text-border">{step.step}</span>
                </div>

                <h3 className="font-display font-semibold text-primary text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed mb-4">{step.description}</p>

                {/* Detail flow */}
                <div className="bg-white/60 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-mono text-[#64748B] tracking-wide">{step.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link href="/builder" id="how-it-works-cta">
            <Button variant="warm" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Mulai Buat CV Sekarang — Gratis
            </Button>
          </Link>
          <p className="text-sm text-[#64748B] mt-3">Tidak perlu daftar. Tidak ada biaya tersembunyi.</p>
        </motion.div>
      </div>
    </section>
  );
}
