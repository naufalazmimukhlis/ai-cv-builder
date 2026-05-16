'use client';

import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';

export default function EducationStep() {
  const router = useRouter();
  const { education, certifications, addEducation, updateEducation, removeEducation, addCertification, updateCertification, removeCertification, language } = useCVStore();

  const handleFinish = () => {
    router.push('/builder/profile');
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary mb-2">
          {language === 'id' ? 'Pendidikan & Sertifikasi' : 'Education & Certifications'}
        </h1>
        <p className="text-sm text-[#64748B]">
          {language === 'id' 
            ? 'Masukkan riwayat pendidikan formal dan sertifikasi profesional Anda.'
            : 'Enter your formal education history and professional certifications.'}
        </p>
      </div>

      <div className="space-y-12 pb-32 md:pb-12">
        {/* Education Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              {language === 'id' ? 'Pendidikan Formal' : 'Formal Education'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-4 rounded-xl border-dashed"
              onClick={() => addEducation()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {language === 'id' ? 'Tambah' : 'Add'}
            </Button>
          </div>

          {education.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl bg-surface-2">
              <p className="text-sm text-[#64748B]">
                {language === 'id' ? 'Belum ada riwayat pendidikan yang ditambahkan.' : 'No education history added yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {education.map((edu, idx) => (
                <div key={edu.id} className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 relative animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-[#64748B] hover:text-danger p-2 rounded-xl hover:bg-danger/10 transition-colors"
                      aria-label="Hapus pendidikan"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label={language === 'id' ? 'Nama Institusi' : 'Institution Name'}
                      placeholder="mis. Universitas Indonesia"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    />
                    <Input
                      label={language === 'id' ? 'Tingkat / Gelar' : 'Degree / Level'}
                      placeholder="mis. Sarjana (S1)"
                      value={language === 'id' ? edu.degreeId : edu.degreeEn}
                      onChange={(e) => updateEducation(edu.id, language === 'id' ? { degreeId: e.target.value } : { degreeEn: e.target.value })}
                    />
                    <Input
                      label={language === 'id' ? 'Jurusan' : 'Major'}
                      placeholder="mis. Teknik Informatika"
                      value={language === 'id' ? edu.majorId : edu.majorEn}
                      onChange={(e) => updateEducation(edu.id, language === 'id' ? { majorId: e.target.value } : { majorEn: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-5">
                      <Input
                        label={language === 'id' ? 'Tahun Lulus' : 'Graduation Year'}
                        placeholder="mis. 2023"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(edu.id, { graduationYear: e.target.value })}
                      />
                      <Input
                        label="IPK (Opsional)"
                        placeholder="mis. 3.85"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Certification Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              {language === 'id' ? 'Sertifikasi & Kursus' : 'Certifications & Courses'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-4 rounded-xl border-dashed"
              onClick={() => addCertification()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {language === 'id' ? 'Tambah' : 'Add'}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {certifications.map((cert, idx) => (
              <div key={cert.id} className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 relative animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="absolute top-6 right-6">
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="text-[#64748B] hover:text-danger p-2 rounded-xl hover:bg-danger/10 transition-colors"
                    aria-label="Hapus sertifikasi"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label={language === 'id' ? 'Nama Sertifikasi' : 'Certification Name'}
                    placeholder="mis. Google UX Design..."
                    value={language === 'id' ? cert.nameId : cert.nameEn}
                    onChange={(e) => updateCertification(cert.id, language === 'id' ? { nameId: e.target.value } : { nameEn: e.target.value })}
                  />
                  <Input
                    label={language === 'id' ? 'Penerbit' : 'Issuer'}
                    placeholder="mis. Google / Coursera"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  />
                  <Input
                    label={language === 'id' ? 'Tahun' : 'Year'}
                    placeholder="mis. 2024"
                    value={cert.year}
                    onChange={(e) => updateCertification(cert.id, { year: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Responsive Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border z-40 md:static md:bg-transparent md:border-none md:p-0 md:mt-8 md:mb-12">
        <div className="max-w-3xl mx-auto flex justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 md:flex-none md:px-8 h-12 md:h-11 rounded-xl"
            onClick={() => router.push('/builder/skills')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {language === 'id' ? 'Kembali' : 'Back'}
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-[2] md:flex-none md:px-12 h-12 md:h-11 rounded-xl shadow-ai bg-success hover:bg-emerald-600 border-none"
            onClick={handleFinish}
            rightIcon={<CheckCircle className="w-4 h-4" />}
          >
            {language === 'id' ? 'Lanjut ke Profil' : 'Continue to Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}
