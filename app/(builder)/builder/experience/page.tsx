'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, ArrowRight, GripVertical, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AIBadge } from '@/components/ui/ai-badge';
import { useCVStore } from '@/store/cv-store';
import { useAIEnhance } from '@/hooks/use-ai-enhance';

export default function ExperienceStep() {
  const router = useRouter();
  const { experiences, addExperience, updateExperience, removeExperience, addBullet, updateBullet, removeBullet, language } = useCVStore();
  const { optimizeBullet } = useAIEnhance();
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const handleNext = () => {
    router.push('/builder/skills');
  };

  const handleOptimizeBullet = async (expId: string, bulletId: string, text: string) => {
    if (!text || text.length < 5) return;
    setOptimizingId(bulletId);
    
    const optimized = await optimizeBullet(expId, bulletId, text);
    
    if (optimized) {
      // Typing effect: slowly update the bullet text in the store
      let currentText = '';
      const words = optimized.split(' ');
      
      // Update store with empty first
      updateBullet(expId, bulletId, '');
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        // We use a small timeout to simulate typing
        await new Promise(resolve => setTimeout(resolve, 30));
        updateBullet(expId, bulletId, currentText);
      }
    }
    
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
            <h3 className="text-lg font-bold text-primary mb-2">Belum ada pengalaman</h3>
            <p className="text-sm text-[#64748B] mb-6 max-w-xs mx-auto">Tambahkan pengalaman kerja Anda untuk mulai membangun CV yang powerful.</p>
            <Button variant="primary" onClick={() => addExperience()} leftIcon={<Plus className="w-4 h-4" />}>
              Tambah Pengalaman Pertama
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
                  <h2 className="text-lg font-bold text-primary">Detail Pekerjaan</h2>
                  <p className="text-xs text-[#64748B]">Isi informasi dasar tentang peran Anda.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <Input
                  label="Posisi / Jabatan"
                  placeholder="mis. Senior Product Designer"
                  value={exp.jobTitle}
                  onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                />
                <Input
                  label="Nama Perusahaan"
                  placeholder="mis. Apple Inc."
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
                <Input
                  label="Lokasi"
                  placeholder="mis. Cupertino, CA (Hybrid)"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                />
                <div className="flex gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      label="Mulai"
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
                      label="Selesai"
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
                  Saya masih bekerja di sini
                </label>
              </div>

              {/* Bullet Points Section */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-primary">Tanggung Jawab & Pencapaian</h3>
                    <AIBadge>STAR Method Ready</AIBadge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-xl border-dashed text-ai-700 hover:bg-ai-50"
                      onClick={async () => {
                        const { generateExperienceBullets } = await import('@/lib/generateExperience');
                        const suggested = generateExperienceBullets(exp.jobTitle, language);
                        suggested.forEach(text => {
                          const bid = crypto.randomUUID();
                          addBullet(exp.id);
                          // We need a small delay because addBullet is async in state
                          setTimeout(() => {
                             const state = useCVStore.getState();
                             const currentExp = state.experiences.find(e => e.id === exp.id);
                             if (currentExp) {
                               const lastBullet = currentExp.bullets[currentExp.bullets.length - 1];
                               updateBullet(exp.id, lastBullet.id, text);
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
                      Tambah Poin
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
                            value={bullet.text}
                            onChange={(e) => updateBullet(exp.id, bullet.id, e.target.value)}
                            placeholder="Meningkatkan konversi penjualan sebesar 25% dalam 6 bulan dengan optimasi SEO..."
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
                            onClick={() => handleOptimizeBullet(exp.id, bullet.id, bullet.text)}
                            disabled={optimizingId === bullet.id || bullet.text.length < 10}
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all relative overflow-hidden group ${
                              bullet.text.length < 10 
                                ? 'text-[#64748B] bg-surface-2 cursor-not-allowed opacity-60' 
                                : 'text-ai-700 bg-ai-50 border border-ai-200 hover:bg-ai-100 hover:shadow-sm'
                            }`}
                          >
                            {optimizingId === bullet.id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-ai border-t-transparent rounded-full animate-spin" />
                                AI Menyempurnakan...
                              </>
                            ) : (
                              <>
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <Sparkles className="w-3.5 h-3.5 text-ai" />
                                <span className="z-10">✨ Sempurnakan dengan AI</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBullet(exp.id, bullet.id)}
                        className="mt-3 text-[#64748B] hover:text-danger p-2 rounded-xl hover:bg-danger/10 transition-colors opacity-30 group-hover:opacity-100"
                        title="Hapus bullet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {exp.bullets.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-border rounded-2xl text-sm text-[#64748B] bg-surface/50">
                      Belum ada poin pencapaian. Klik &quot;Tambah Poin&quot; untuk memulai.
                    </div>
                  )}
                  
                  {exp.bullets.length > 0 && exp.bullets.some(b => !b.text.includes('%') && !b.text.includes('0') && !b.text.match(/\d/)) && (
                    <div className="flex items-start gap-3 bg-ai-50 border border-ai-100 text-ai-800 p-4 rounded-xl mt-4 animate-slide-up">
                      <div className="w-8 h-8 rounded-lg bg-ai/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-ai" />
                      </div>
                      <div>
                        <p className="text-xs font-bold mb-1">💡 Recruiter Insight</p>
                        <p className="text-[11px] leading-relaxed text-ai-700">
                          Gunakan angka! HR sangat menyukai metrik kuantitatif. Cobalah menambahkan persentase, jumlah tim, atau penghematan waktu/biaya pada poin Anda.
                        </p>
                      </div>
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
            Kembali
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-[2] md:flex-none md:px-12 h-12 md:h-11 rounded-xl shadow-ai"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Lanjutkan
          </Button>
        </div>
      </div>
    </>
  );
}
