'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import { Translation, TranslationsSchema } from '@/types/cv';
import translations from '@/data/translations.json';

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
  const language = useCVStore((s) => s.language) || 'id';
  const lt = (translations as unknown as TranslationsSchema).landing[language as 'id' | 'en'];

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
            {(lt?.how_title || 'Cara Kerja dalam 3 Langkah').includes('3 Langkah') ? (
              <>
                {(lt?.how_title || 'Cara Kerja dalam 3 Langkah').split('3 Langkah')[0]}
                <span className="gradient-text-ai">3 Langkah</span>
              </>
            ) : (
              <span className="gradient-text-ai">{lt?.how_title || 'How It Works'}</span>
            )}
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto font-medium">
            {lt?.how_desc || ''}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 relative">
          {/* Connecting arrows (desktop) */}
          <div className="hidden md:block absolute top-8 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent/30 to-ai/30" aria-hidden="true" />
          <div className="hidden md:block absolute top-8 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-ai/30 to-success/30" aria-hidden="true" />

          {(lt?.how_steps || []).map((step, index: number) => {
            const Icon = STEPS[index].icon;
            const color = STEPS[index].color;
            const bg = STEPS[index].bg;
            const border = STEPS[index].border;
            
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-6 h-full`}>
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-white shadow-card flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
                    </div>
                    <span className="text-3xl font-display font-bold text-border">0{index + 1}</span>
                  </div>

                  <h3 className="font-display font-semibold text-primary text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-4 font-medium">{step.desc}</p>

                  {/* Detail flow */}
                  <div className="bg-white/60 rounded-lg px-3 py-2">
                    <p className="text-[10px] font-mono text-[#64748B] tracking-wide font-bold">{step.detail}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
            <Button variant="warm" size="xl" style={{ backgroundColor: '#000', color: '#fff' }} rightIcon={<ArrowRight className="w-5 h-5" />}>
              {lt.cta_footer}
            </Button>
          </Link>
          <p className="text-sm text-[#64748B] mt-3 font-medium">{lt.no_registration}</p>
        </motion.div>
      </div>
    </section>
  );
}
