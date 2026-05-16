'use client';

import { useRouter } from 'next/navigation';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import { personalInfoSchema, type PersonalInfoFormData } from '@/lib/validators';
import translations from '@/data/translations.json';

export default function PersonalInfoStep() {
  const router = useRouter();
  const { personal, updatePersonal, language } = useCVStore();
  const t = (translations as any)[language];

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
        <h1 className="text-2xl font-display font-bold text-primary mb-2">
          {language === 'id' ? 'Informasi Pribadi' : 'Personal Information'}
        </h1>
        <p className="text-sm text-[#64748B]">
          {language === 'id' 
            ? 'Mari mulai dengan data diri Anda. Informasi ini akan menjadi header utama di CV Anda.'
            : 'Let\'s start with your personal data. This information will be the main header in your CV.'}
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
              <h2 className="text-lg font-bold text-primary">
                {language === 'id' ? 'Informasi Kontak' : 'Contact Information'}
              </h2>
              <p className="text-xs text-[#64748B]">
                {language === 'id' 
                  ? 'Data ini akan muncul di bagian paling atas CV Anda.'
                  : 'This data will appear at the very top of your CV.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="personal-form">
            <Input
              label={language === 'id' ? 'Nama Lengkap' : 'Full Name'}
              placeholder="mis. Ahmad Rizky Pratama"
              {...register('fullName')}
              error={errors.fullName?.message}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label={language === 'id' ? 'Email Profesional' : 'Professional Email'}
                type="email"
                placeholder="mis. ahmad@email.com"
                {...register('email')}
                error={errors.email?.message}
                required
              />
              <Input
                label={language === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                type="tel"
                placeholder="mis. 081234567890"
                {...register('phone')}
                error={errors.phone?.message}
                required
              />
            </div>

            <Input
              label={language === 'id' ? 'Lokasi / Domisili' : 'Location / Domicile'}
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

        {/* Sticky Actions Overlay */}
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-border z-30 lg:hidden">
          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-base font-bold shadow-ai"
            form="personal-form"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {language === 'id' ? 'Lanjut ke Target Posisi' : 'Continue to Target Position'}
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
            {language === 'id' ? 'Lanjut ke Target Posisi' : 'Continue to Target Position'}
          </Button>
        </div>
      </div>
    </div>
  );
}
