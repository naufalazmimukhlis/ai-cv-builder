'use client';

import * as React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import { ATSTemplatePDF } from '@/components/cv-template/ats-template-pdf';

export function PDFExportButton() {
  const [mounted, setMounted] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Ambil data langsung dari state individu agar equality check tidak gagal
  const personal = useCVStore((s) => s.personal);
  const target = useCVStore((s) => s.target);
  const experiences = useCVStore((s) => s.experiences);
  const skills = useCVStore((s) => s.skills);
  const education = useCVStore((s) => s.education);
  const certifications = useCVStore((s) => s.certifications);
  const professionalSummary = useCVStore((s) => s.professionalSummary);
  const language = useCVStore((s) => s.language);

  const cvData = React.useMemo(() => ({
    personal,
    target,
    experiences,
    skills,
    education,
    certifications,
    professionalSummary,
  }), [personal, target, experiences, skills, education, certifications, professionalSummary]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="warm" size="lg" disabled leftIcon={<Download className="w-4 h-4" />}>
        {language === 'id' ? 'Memuat...' : 'Loading...'}
      </Button>
    );
  }

  const filename = `${cvData.personal.fullName
    ? cvData.personal.fullName.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
    : 'cv'}_cv-ats.pdf`;

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      // Dinamis import untuk menghindari SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      
      const blob = await pdf(<ATSTemplatePDF data={cvData} lang={language} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'cv-ats.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="warm"
      size="lg"
      disabled={isGenerating || !cvData.personal.fullName}
      loading={isGenerating}
      leftIcon={<Download className="w-4 h-4" />}
      className="w-full sm:w-auto shadow-button hover:shadow-button-hover font-semibold"
    >
      {isGenerating 
        ? (language === 'id' ? 'Membuat PDF...' : 'Generating PDF...') 
        : (language === 'id' ? 'Unduh PDF (ATS Ready)' : 'Download PDF (ATS Ready)')}
    </Button>
  );
}
