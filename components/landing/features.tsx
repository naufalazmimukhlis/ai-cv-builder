'use client';

import { motion } from 'framer-motion';
import { Cpu, Target, FileText, Download, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useCVStore } from '@/store/cv-store';
import translations from '@/data/translations.json';
import { Translation, TranslationsSchema } from '@/types/cv';

const FEATURES = [
  {
    icon: Target,
    color: 'text-accent',
    bg: 'bg-accent/10',
    title: 'ATS Keyword Extraction',
    description:
      'AI menganalisis job description dan mengekstrak semua keyword ATS yang relevan secara otomatis. Pastikan CV Anda mengandung kata kunci yang tepat.',
  },
  {
    icon: Sparkles,
    color: 'text-ai',
    bg: 'bg-ai/10',
    title: 'AI CV Enhancement',
    description:
      'Sempurnakan seluruh CV dengan satu klik. AI mengoptimalkan summary, bullet points, dan skills sesuai posisi target menggunakan STAR method.',
  },
  {
    icon: FileText,
    color: 'text-success',
    bg: 'bg-success/10',
    title: 'Live CV Preview',
    description:
      'Lihat perubahan CV secara real-time saat mengisi form. Template ATS-strict — clean, single-column, tanpa tabel atau grafik kompleks.',
  },
  {
    icon: Cpu,
    color: 'text-warning',
    bg: 'bg-warning/10',
    title: 'ATS Score Checker',
    description:
      'Dapatkan skor ATS 0-100 dengan analisis detail. Ketahui seberapa compatible CV Anda dengan sistem ATS yang digunakan perusahaan target.',
  },
  {
    icon: TrendingUp,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Bullet Point Optimizer',
    description:
      'Optimalkan setiap deskripsi pekerjaan dengan action verb yang kuat, metrik kuantitatif, dan dampak konkret menggunakan STAR method.',
  },
  {
    icon: Download,
    color: 'text-warm',
    bg: 'bg-warm/10',
    title: 'PDF Export Profesional',
    description:
      'Unduh CV sebagai PDF siap kirim dengan nama file otomatis (NamaAnda_cv-ats.pdf). Pixel-perfect, konsisten di semua browser dan printer.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function LandingFeatures() {
  const language = useCVStore((s) => s.language) || 'id';
  const lt = (translations as unknown as TranslationsSchema).landing[language as 'id' | 'en'];

  return (
    <section id="features" className="py-20 px-6 lg:px-12 bg-surface-2" aria-labelledby="features-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            <span className="text-xs font-semibold text-accent">{lt?.features_badge || 'Features'}</span>
          </div>
          <h2 id="features-title" className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            {(lt?.features_title || 'Fitur Lengkap untuk CV ATS').includes('untuk') ? (
              <>
                {(lt?.features_title || 'Fitur Lengkap untuk CV ATS').split('untuk')[0]}untuk{' '}
                <span className="gradient-text">
                  {(lt?.features_title || 'Fitur Lengkap untuk CV ATS').split('untuk')[1]}
                </span>
              </>
            ) : (
              <span className="gradient-text">
                {lt?.features_title || 'Professional ATS Features'}
              </span>
            )}
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto font-medium">
            {lt?.features_desc || ''}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(lt?.feature_list || []).map((feature: { title: string; desc: string }, index: number) => {
            const Icon = FEATURES[index].icon;
            const color = FEATURES[index].color;
            const bg = FEATURES[index].bg;
            
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 border border-border shadow-card card-hover group"
              >
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
