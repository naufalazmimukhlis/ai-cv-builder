'use client';

import * as React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';

interface PDFExportButtonProps {
  resumeRef: React.RefObject<HTMLDivElement>;
}

export function PDFExportButton({ resumeRef }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const language = useCVStore((s) => s.language);
  const fullName = useCVStore((s) => s.personal.fullName);

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    try {
      setIsGenerating(true);

      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const element = resumeRef.current;

      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        windowWidth: 850,
        onclone: (clonedDoc) => {
          const cvContainer = clonedDoc.querySelector('.cv-preview-container') as HTMLElement;
          if (cvContainer) {
            // Aggressively clean up all parent styles in the clone
            let curr: HTMLElement | null = cvContainer;
            while (curr) {
              curr.style.transform = 'none';
              curr.style.opacity = '1';
              curr.style.filter = 'none';
              curr.style.animation = 'none';
              curr.style.transition = 'none';
              curr = curr.parentElement;
            }

            // Remove any absolute elements or things that might overlap
            const allElements = cvContainer.querySelectorAll('*');
            allElements.forEach((el) => {
              const style = (el as HTMLElement).style;
              style.setProperty('color', '#000000', 'important');
              style.setProperty('opacity', '1', 'important');
              style.setProperty('filter', 'none', 'important');
              style.setProperty('text-shadow', 'none', 'important');
              style.setProperty('background-image', 'none', 'important');
              style.setProperty('transition', 'none', 'important');
              style.setProperty('animation', 'none', 'important');
              style.setProperty('box-shadow', 'none', 'important');
              
              if (el.tagName === 'HR' || (el as HTMLElement).className.includes('divider')) {
                style.setProperty('border-color', '#000000', 'important');
                style.setProperty('background-color', '#000000', 'important');
              }
            });

            // Ensure fixed width for stable layout calculation (matching preview's 850px)
            cvContainer.style.width = '850px'; 
            cvContainer.style.maxWidth = '850px';
            cvContainer.style.minWidth = '850px';
            cvContainer.style.padding = '1.5cm 1.8cm'; 
            cvContainer.style.textAlign = 'justify';
            cvContainer.style.setProperty('text-justify', 'inter-word', 'important');
            cvContainer.style.letterSpacing = 'normal';
            cvContainer.style.wordSpacing = 'normal';
          }
        },
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Halaman Pertama
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Halaman Berikutnya (Multi-page support)
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const filename = `${fullName
        ? fullName.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
        : 'cv'}_cv-ats.pdf`;

      pdf.save(filename);
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
      disabled={isGenerating || !fullName}
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
