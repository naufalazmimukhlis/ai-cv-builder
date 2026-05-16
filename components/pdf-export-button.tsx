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

      // Dinamis import untuk menghindari SSR issues
      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const element = resumeRef.current;
      
      // Setup canvas dengan resolusi tinggi
      const canvas = await html2canvas(element, {
        scale: 2, // Kualitas lebih tajam
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Ukuran A4 dalam mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = pdfHeight;
      let position = 0;

      // Halaman Pertama
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Halaman Berikutnya jika panjang
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
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
