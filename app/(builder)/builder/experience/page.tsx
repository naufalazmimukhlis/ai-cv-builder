'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, ArrowRight, GripVertical, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AIBadge } from '@/components/ui/ai-badge';
import { useCVStore } from '@/store/cv-store';
import { useAIEnhance } from '@/hooks/use-ai-enhance';

export default function ExperienceStep() {
  const router = useRouter();
  const { experiences, addExperience, updateExperience, removeExperience, addBullet, updateBullet, updateBulletBilingual, removeBullet, language } = useCVStore();
  const { optimizeBullet } = useAIEnhance();
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const handleNext = () => {
    router.push('/builder/skills');
  };

  const handleOptimizeBullet = async (expId: string, bulletId: string, text: string) => {
    if (!text || text.length < 5) return;
    setOptimizingId(bulletId);
    await optimizeBullet(expId, bulletId, text);
    setOptimizingId(null);
  };

  return (
    <>
      <div className="space-y-8 pb-32 md:pb-12">
        {experiences.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-surface-2 animate-fade-in">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Plus className="w-8 h-8 text-[#64748B]" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">
              {language === 'id' ? 'Belum ada pengalaman' : 'No experience yet'}
            </h3>
            <p className="text-sm text-[#64748B] mb-6 max-w-xs mx-auto">
              {language === 'id' 
                ? 'Tambahkan pengalaman kerja Anda untuk mulai membangun CV yang powerful.'
                : 'Add your work experience to start building a powerful CV.'}
            </p>
            <Button variant="primary" onClick={() => addExperience()} leftIcon={<Plus className="w-4 h-4" />}>
              {language === 'id' ? 'Tambah Pengalaman Pertama' : 'Add First Experience'}
            </Button>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <div key={exp.id} className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-[#64748B] hover:text-danger p-2 rounded-xl hover:bg-danger/10 transition-colors"
                  aria-label="Hapus pengalaman"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">
                    {language === 'id' ? 'Detail Pekerjaan' : 'Job Details'}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {language === 'id' ? 'Isi informasi dasar tentang peran Anda.' : 'Fill in basic information about your role.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <Input
                  label={language === 'id' ? 'Posisi / Jabatan' : 'Job Title / Position'}
                  placeholder="mis. Senior Product Designer"
                  value={language === 'id' ? exp.jobTitleId : exp.jobTitleEn}
                  onChange={(e) => updateExperience(exp.id, language === 'id' ? { jobTitleId: e.target.value } : { jobTitleEn: e.target.value })}
                />
                <Input
                  label={language === 'id' ? 'Nama Perusahaan' : 'Company Name'}
                  placeholder="mis. Apple Inc."
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
                <Input
                  label={language === 'id' ? 'Lokasi' : 'Location'}
                  placeholder="mis. Cupertino, CA (Hybrid)"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                />
                <div className="flex gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      label={language === 'id' ? 'Mulai' : 'Start'}
                      placeholder="MM"
                      value={exp.startMonth}
                      onChange={(e) => updateExperience(exp.id, { startMonth: e.target.value })}
                      maxLength={2}
                    />
                    <Input
                      label=" "
                      placeholder="YYYY"
                      value={exp.startYear}
                      onChange={(e) => updateExperience(exp.id, { startYear: e.target.value })}
                      maxLength={4}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      label={language === 'id' ? 'Selesai' : 'End'}
                      placeholder="MM"
                      value={exp.endMonth}
                      onChange={(e) => updateExperience(exp.id, { endMonth: e.target.value })}
                      maxLength={2}
                      disabled={exp.isCurrent}
                    />
                    <Input
                      label=" "
                      placeholder="YYYY"
                      value={exp.endYear}
                      onChange={(e) => updateExperience(exp.id, { endYear: e.target.value })}
                      maxLength={4}
                      disabled={exp.isCurrent}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-8 p-3 bg-surface-2 rounded-xl inline-block">
                <label className="flex items-center gap-3 text-sm font-medium text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary border-border rounded-lg focus:ring-accent"
                    checked={exp.isCurrent}
                    onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                  />
                  {language === 'id' ? 'Saya masih bekerja di sini' : 'I currently work here'}
                </label>
              </div>

              {/* Bullet Points Section */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-primary">
                      {language === 'id' ? 'Tanggung Jawab & Pencapaian' : 'Responsibilities & Achievements'}
                    </h3>
                    <AIBadge>STAR Method Ready</AIBadge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-xl border-dashed text-ai-700 hover:bg-ai-50"
                      onClick={async () => {
                        const { generateExperienceBullets } = await import('@/lib/generateExperience');
                        const activeTitle = language === 'id' ? exp.jobTitleId : exp.jobTitleEn;
                        const suggested = generateExperienceBullets(activeTitle || '');
                        suggested.forEach(pair => {
                          addBullet(exp.id);
                          setTimeout(() => {
                             const state = useCVStore.getState();
                             const currentExp = state.experiences.find(e => e.id === exp.id);
                             if (currentExp) {
                               const lastBullet = currentExp.bullets[currentExp.bullets.length - 1];
                               updateBulletBilingual(exp.id, lastBullet.id, pair.id, pair.en);
                             }
                          }, 10);
                        });
                      }}
                      leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                    >
                      Smart Suggest
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-xl border-dashed"
                      onClick={() => addBullet(exp.id)}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      {language === 'id' ? 'Tambah Poin' : 'Add Bullet'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {exp.bullets.map((bullet) => (
                    <div key={bullet.id} className="flex gap-3 items-start group">
                      <div className="mt-3 text-[#64748B] cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="relative">
                          <Textarea
                            value={language === 'id' ? bullet.textId : bullet.textEn}
                            onChange={(e) => updateBullet(exp.id, bullet.id, e.target.value)}
                            placeholder={language === 'id' 
                              ? "Meningkatkan konversi penjualan sebesar 25%..." 
                              : "Increased sales conversion by 25%..."}
                            rows={2}
                            className={`pr-10 min-h-[80px] transition-all ${bullet.aiOptimized ? 'border-ai/30 bg-ai/5 shadow-ai-sm focus:border-ai' : ''}`}
                          />
                          {bullet.aiOptimized && (
                            <div className="absolute -top-2.5 right-2 bg-ai text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
                              <Sparkles className="w-2.5 h-2.5" />
                              AI OPTIMIZED
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center px-1">
                          <button
                            type="button"
                            onClick={() => handleOptimizeBullet(exp.id, bullet.id, language === 'id' ? bullet.textId : bullet.textEn)}
                            disabled={optimizingId === bullet.id || (language === 'id' ? bullet.textId.length : bullet.textEn.length) < 10}
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all relative overflow-hidden group ${
                              (language === 'id' ? bullet.textId.length : bullet.textEn.length) < 10 
                                ? 'text-[#64748B] bg-surface-2 cursor-not-allowed opacity-60' 
                                : 'text-ai-700 bg-ai-50 border border-ai-200 hover:bg-ai-100 hover:shadow-sm'
                            }`}
                          >
                            {optimizingId === bullet.id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-ai border-t-transparent rounded-full animate-spin" />
                                {language === 'id' ? 'AI Menyempurnakan...' : 'AI Improving...'}
                              </>
                            ) : (
                              <>
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <Sparkles className="w-3.5 h-3.5 text-ai" />
                                <span className="z-10">✨ {language === 'id' ? 'Sempurnakan dengan AI' : 'Improve with AI'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBullet(exp.id, bullet.id)}
                        className="mt-3 text-[#64748B] hover:text-danger p-2 rounded-xl hover:bg-danger/10 transition-colors opacity-30 group-hover:opacity-100"
                        title={language === 'id' ? 'Hapus bullet' : 'Delete bullet'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {exp.bullets.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-border rounded-2xl text-sm text-[#64748B] bg-surface/50">
                      {language === 'id' 
                        ? 'Belum ada poin pencapaian. Klik "Tambah Poin" untuk memulai.' 
                        : 'No achievement points yet. Click "Add Bullet" to start.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Responsive Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border z-40 md:static md:bg-transparent md:border-none md:p-0 md:mt-8 md:mb-12">
        <div className="max-w-3xl mx-auto flex justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 md:flex-none md:px-8 h-12 md:h-11 rounded-xl"
            onClick={() => router.push('/builder/target')}
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
    </>
  );
}
