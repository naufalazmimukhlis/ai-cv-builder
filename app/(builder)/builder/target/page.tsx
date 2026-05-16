'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TagInput } from '@/components/ui/tag-input';
import { useCVStore } from '@/store/cv-store';
import { targetJobSchema, type TargetJobFormData } from '@/lib/validators';
import { ATSIntelligencePanel } from '@/components/ai-enhance/ats-intelligence-panel';
import { useAIEnhance } from '@/hooks/use-ai-enhance';

export default function TargetPositionStep() {
  const router = useRouter();
  const { target, updateTarget, language } = useCVStore();
  const { extractKeywords, isLoading } = useAIEnhance();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TargetJobFormData>({
    resolver: zodResolver(targetJobSchema),
    defaultValues: target,
  });

  const jobDescription = watch('jobDescription');

  const handleExtractKeywords = async () => {
    if (!jobDescription || jobDescription.length < 10) return;
    
    const keywords = await extractKeywords(jobDescription);
    if (keywords.length > 0) {
      setValue("keywords", keywords, {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = (data: TargetJobFormData) => {
    updateTarget(data);
    router.push('/builder/experience');
  };

  return (
    <div className="pb-32 md:pb-12 space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">
                {language === 'id' ? 'Informasi Pekerjaan' : 'Job Information'}
              </h2>
              <p className="text-xs text-[#64748B]">
                {language === 'id' ? 'Beri tahu AI posisi apa yang Anda incar.' : 'Tell AI what position you are targeting.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Input
              label={language === 'id' ? 'Judul Posisi (Job Title)' : 'Job Title'}
              placeholder="mis. Senior Product Designer"
              {...register('jobTitle')}
              error={errors.jobTitle?.message}
              required
            />

            <div className="space-y-2">
              <Textarea
                label={language === 'id' ? 'Job Description (Opsional)' : 'Job Description (Optional)'}
                placeholder={language === 'id' 
                  ? "Paste deskripsi pekerjaan dari LinkedIn/Jobstreet di sini..." 
                  : "Paste job description from LinkedIn/Jobstreet here..."}
                {...register('jobDescription')}
                error={errors.jobDescription?.message}
                rows={6}
                className="bg-surface-2 focus:bg-white transition-all"
                hint={language === 'id' 
                  ? "Makin lengkap JD yang dimasukkan, makin akurat optimasi AI." 
                  : "The more complete the JD, the more accurate the AI optimization."}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleExtractKeywords}
                  disabled={!jobDescription || jobDescription.length < 10 || isLoading}
                  className={`text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all relative overflow-hidden group shadow-sm ${
                    !jobDescription || jobDescription.length < 10 
                      ? 'text-[#64748B] bg-surface-2 cursor-not-allowed border border-border' 
                      : 'text-ai-700 bg-ai-50 border border-ai-200 hover:bg-ai-100 hover:shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-ai border-t-transparent rounded-full animate-spin" />
                      {language === 'id' ? 'Menganalisis Job Description...' : 'Analyzing Job Description...'}
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <Sparkles className="w-3.5 h-3.5 text-ai" />
                      <span className="z-10">✨ {language === 'id' ? 'Analisis ATS & Ekstrak Keywords' : 'ATS Analysis & Extract Keywords'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up [animation-delay:100ms]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">
                {language === 'id' ? 'Keywords Target' : 'Target Keywords'}
              </h2>
              <p className="text-xs text-[#64748B]">
                {language === 'id' ? 'Keywords yang wajib muncul di CV Anda.' : 'Keywords that must appear in your CV.'}
              </p>
            </div>
          </div>

          <Controller
            control={control}
            name="keywords"
            render={({ field }) => (
              <TagInput
                label="Keywords ATS"
                value={field.value}
                onChange={field.onChange}
                error={errors.keywords?.message}
                placeholder={language === 'id' ? "Ketik keyword lalu tekan Enter..." : "Type keyword and press Enter..."}
                hint={language === 'id' 
                  ? "AI akan menyisipkan kata-kata ini ke dalam pengalaman kerja Anda." 
                  : "AI will insert these words into your work experience."}
              />
            )}
          />
        </section>

        <div className="animate-slide-up [animation-delay:200ms]">
          <ATSIntelligencePanel />
        </div>

        {/* Responsive Navigation Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border z-40 md:static md:bg-transparent md:border-none md:p-0 md:mt-8 md:mb-12">
          <div className="max-w-2xl mx-auto flex justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 md:flex-none md:px-8 h-12 md:h-11 rounded-xl"
              onClick={() => router.push('/builder')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              {language === 'id' ? 'Kembali' : 'Back'}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-[2] md:flex-none md:px-12 h-12 md:h-11 rounded-xl shadow-ai"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {language === 'id' ? 'Lanjutkan' : 'Continue'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
