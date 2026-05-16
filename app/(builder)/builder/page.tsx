'use client';

import { useRouter } from 'next/navigation';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Sparkles, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import { personalInfoSchema, type PersonalInfoFormData } from '@/lib/validators';
import { useAIEnhance } from '@/hooks/use-ai-enhance';
import { useState } from 'react';

export default function PersonalInfoStep() {
  const router = useRouter();
  const { personal, updatePersonal } = useCVStore();
  const { generateSummary } = useAIEnhance();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const summary = await generateSummary();
    
    if (summary) {
      let currentText = '';
      const words = summary.split(' ');
      const setSummary = useCVStore.getState().setSummary;
      
      setSummary('');
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        await new Promise(resolve => setTimeout(resolve, 20));
        setSummary(currentText);
      }
    }
    
    setIsGeneratingSummary(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useReactHookForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personal,
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    updatePersonal(data);
    router.push('/builder/target');
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary mb-2">Informasi Pribadi</h1>
        <p className="text-sm text-[#64748B]">
          Mari mulai dengan data diri Anda. Informasi ini akan menjadi header utama di CV Anda.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Informasi Kontak</h2>
              <p className="text-xs text-[#64748B]">Data ini akan muncul di bagian paling atas CV Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="personal-form">
            <Input
              label="Nama Lengkap"
              placeholder="mis. Ahmad Rizky Pratama"
              {...register('fullName')}
              error={errors.fullName?.message}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Email Profesional"
                type="email"
                placeholder="mis. ahmad@email.com"
                {...register('email')}
                error={errors.email?.message}
                required
              />
              <Input
                label="Nomor Telepon"
                type="tel"
                placeholder="mis. 081234567890"
                {...register('phone')}
                error={errors.phone?.message}
                required
              />
            </div>

            <Input
              label="Lokasi / Domisili"
              placeholder="mis. Jakarta, Indonesia"
              {...register('location')}
              error={errors.location?.message}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="URL LinkedIn"
                type="url"
                placeholder="mis. linkedin.com/in/ahmad"
                {...register('linkedin')}
                error={errors.linkedin?.message}
              />
              <Input
                label="URL Portfolio / GitHub"
                type="url"
                placeholder="mis. github.com/ahmad"
                {...register('portfolio')}
                error={errors.portfolio?.message}
              />
            </div>
          </form>
        </section>

        {/* Professional Summary Card */}
        <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up [animation-delay:100ms]">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ai/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-ai" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Professional Summary</h2>
                <p className="text-xs text-[#64748B]">Jelaskan siapa Anda dan apa nilai tambah Anda.</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ai-50 border border-ai-200 text-ai-700 text-xs font-bold hover:bg-ai-100 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isGeneratingSummary ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-ai border-t-transparent rounded-full animate-spin" />
                  AI Menulis...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-ai" />
                  <span className="z-10">✨ Generate Ringkasan AI</span>
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-3">
            <textarea
              className="form-textarea min-h-[160px] focus:ring-ai/20 focus:border-ai transition-all"
              placeholder="Tulis ringkasan profesional Anda atau gunakan AI untuk membuatkannya berdasarkan target pekerjaan dan pengalaman Anda."
              value={useCVStore((state) => state.professionalSummary)}
              onChange={(e) => useCVStore.getState().setSummary(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[11px] text-ai-600 font-medium bg-ai/5 px-3 py-2 rounded-lg border border-ai/10">
              <Info className="w-3.5 h-3.5" />
              Tip: AI akan bekerja maksimal setelah Anda mengisi Target Posisi & Pengalaman Kerja.
            </div>
          </div>
        </section>

        {/* Sticky Actions Overlay */}
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-border z-30 lg:hidden">
          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-base font-bold shadow-ai"
            form="personal-form"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Lanjut ke Target Posisi
          </Button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="px-10 h-14 text-base font-bold shadow-ai"
            form="personal-form"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            loading={isSubmitting}
          >
            Lanjut ke Target Posisi
          </Button>
        </div>
      </div>
    </div>
  );
}
