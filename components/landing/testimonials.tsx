'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Rizky Fauzan',
    role: 'Software Engineer',
    company: 'Tokopedia',
    text: 'Setelah pakai ATS CV Builder Pro, CV saya langsung dipanggil interview di 3 perusahaan tech besar. AI-nya benar-benar paham keyword yang dicari recruiter!',
    rating: 5,
    avatar: 'RF',
    bg: 'bg-accent',
  },
  {
    name: 'Sari Dewi',
    role: 'Product Manager',
    company: 'Gojek',
    text: 'Bullet points saya yang sebelumnya generic langsung jadi keren setelah dioptimasi AI. Score ATS naik dari 45 ke 89 dalam hitungan menit!',
    rating: 5,
    avatar: 'SD',
    bg: 'bg-ai',
  },
  {
    name: 'Budi Hartono',
    role: 'Data Analyst',
    company: 'Bank BCA',
    text: 'Fitur keyword extraction-nya keren banget. Saya tinggal paste JD, dan semua keywords langsung muncul. CV saya jadi jauh lebih relevan dengan posisi yang dilamar.',
    rating: 5,
    avatar: 'BH',
    bg: 'bg-success',
  },
  {
    name: 'Putri Maharani',
    role: 'Marketing Manager',
    company: 'Shopee Indonesia',
    text: 'Tampilan CV-nya profesional banget dan PDF-nya clean. Recruiter bilang ini salah satu CV terbaik yang mereka terima bulan ini!',
    rating: 5,
    avatar: 'PM',
    bg: 'bg-warm',
  },
  {
    name: 'Ahmad Zulkifli',
    role: 'Backend Engineer',
    company: 'Traveloka',
    text: 'Proses pengisian form-nya mudah dan data tersimpan otomatis. Bisa dilanjutkan kapan saja. Sangat membantu terutama saat job hunting intensif.',
    rating: 5,
    avatar: 'AZ',
    bg: 'bg-primary',
  },
  {
    name: 'Nisa Rahmawati',
    role: 'UI/UX Designer',
    company: 'Bukalapak',
    text: 'Professional summary yang dibuatkan AI benar-benar powerful dan relevan. Saya akhirnya dapat kerja impian setelah 3 minggu pakai tools ini!',
    rating: 5,
    avatar: 'NR',
    bg: 'bg-ai',
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-20 px-6 lg:px-12 bg-surface-2 overflow-hidden" aria-labelledby="testimonials-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Dipercaya{' '}
            <span className="gradient-text">10,000+ Job Seeker</span>
          </h2>
          <p className="text-[#64748B]">Bergabung dengan ribuan profesional Indonesia yang sudah berhasil mendapatkan pekerjaan impian.</p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-border shadow-card card-hover"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3" aria-label={`Rating ${testimonial.rating} dari 5`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-warning fill-warning" aria-hidden="true" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-[#1A2332] leading-relaxed mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${testimonial.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-bold text-white">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{testimonial.name}</div>
                  <div className="text-xs text-[#64748B]">
                    {testimonial.role} · {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
