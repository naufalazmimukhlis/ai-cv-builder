'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagInput } from '@/components/ui/tag-input';
import { useCVStore } from '@/store/cv-store';

export default function SkillsStep() {
  const router = useRouter();
  const { skills, updateSkills, target, language } = useCVStore();

  const handleNext = () => {
    router.push('/builder/education');
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary mb-2">
          {language === 'id' ? 'Keahlian (Skills)' : 'Skills'}
        </h1>
        <p className="text-sm text-[#64748B]">
          {language === 'id' 
            ? 'Masukkan keahlian yang relevan. Sistem ATS memindai bagian ini untuk mencocokkan dengan kualifikasi pekerjaan.'
            : 'Enter relevant skills. ATS systems scan this section to match with job qualifications.'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Keywords Highlight */}
        {target.keywords.length > 0 && (
          <section className="bg-ai-50 border border-ai-100 rounded-2xl p-6 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-ai/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-ai" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ai-900 mb-1">
                  {language === 'id' ? 'Keywords Target Anda' : 'Your Target Keywords'}
                </h3>
                <p className="text-xs text-ai-700 mb-4">
                  {language === 'id' 
                    ? 'Pastikan keahlian ini muncul di CV untuk meningkatkan ATS Match Score.'
                    : 'Ensure these skills appear in your CV to increase ATS Match Score.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {target.keywords.slice(0, 15).map((kw) => (
                    <span key={kw} className="text-[11px] font-bold bg-white text-ai-700 border border-ai-200 px-3 py-1 rounded-lg shadow-sm">
                      {kw}
                    </span>
                  ))}
                  {target.keywords.length > 15 && (
                    <span className="text-[11px] font-bold text-ai-600 self-center">+{target.keywords.length - 15} {language === 'id' ? 'lainnya' : 'more'}</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Skills Cards */}
        <div className="grid grid-cols-1 gap-6 pb-32 md:pb-12">
          <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up [animation-delay:100ms]">
            <TagInput
              label={language === 'id' ? 'Keahlian Teknis (Hard Skills)' : 'Technical Skills'}
              value={skills.technical}
              onChange={(tags) => updateSkills({ technical: tags })}
              placeholder={language === 'id' ? "Ketik lalu tekan Enter..." : "Type and press Enter..."}
              hint={language === 'id' 
                ? "Keahlian teknis spesifik profesi. (mis. React, Node.js, Python, SEO)" 
                : "Professional specific technical skills. (e.g. React, Node.js, Python, SEO)"}
              maxTags={20}
            />
          </section>

          <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up [animation-delay:150ms]">
            <TagInput
              label="Software / Tools"
              value={skills.tools}
              onChange={(tags) => updateSkills({ tools: tags })}
              placeholder={language === 'id' ? "Ketik lalu tekan Enter..." : "Type and press Enter..."}
              hint={language === 'id' 
                ? "Perangkat lunak yang Anda kuasai. (mis. Figma, Jira, AWS, Excel)" 
                : "Software you have mastered. (e.g. Figma, Jira, AWS, Excel)"}
              maxTags={15}
            />
          </section>

          <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up [animation-delay:200ms]">
            <TagInput
              label="Soft Skills"
              value={skills.soft}
              onChange={(tags) => updateSkills({ soft: tags })}
              placeholder={language === 'id' ? "Ketik lalu tekan Enter..." : "Type and press Enter..."}
              hint={language === 'id' 
                ? "Kemampuan interpersonal. (mis. Leadership, Problem Solving)" 
                : "Interpersonal abilities. (e.g. Leadership, Problem Solving)"}
              maxTags={10}
            />
          </section>

          <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up [animation-delay:250ms]">
            <TagInput
              label={language === 'id' ? 'Bahasa' : 'Languages'}
              value={skills.languages}
              onChange={(tags) => updateSkills({ languages: tags })}
              placeholder={language === 'id' ? "Ketik lalu tekan Enter..." : "Type and press Enter..."}
              hint={language === 'id' 
                ? "Bahasa yang dikuasai. (mis. English (Fluent), Bahasa Indonesia (Native))" 
                : "Languages you have mastered. (e.g. English (Fluent), Indonesian (Native))"}
              maxTags={5}
            />
          </section>
        </div>
      </div>

      {/* Responsive Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border z-40 md:static md:bg-transparent md:border-none md:p-0 md:mt-8 md:mb-12">
        <div className="max-w-2xl mx-auto flex justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 md:flex-none md:px-8 h-12 md:h-11 rounded-xl"
            onClick={() => router.push('/builder/experience')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {language === 'id' ? 'Kembali' : 'Back'}
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-[2] md:flex-none md:px-12 h-12 md:h-11 rounded-xl shadow-ai"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {language === 'id' ? 'Lanjutkan' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
