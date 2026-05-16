'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Edit2 } from 'lucide-react';
import { ATSTemplate } from '@/components/cv-template/ats-template';
import { PDFExportButton } from '@/components/pdf-export-button';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import { ATSScoreBadge } from '@/components/ai-enhance/ats-score-badge';

export default function PreviewPage() {
  const atsScore = useCVStore((s) => s.atsScore);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/builder/education">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Kembali Edit
              </Button>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <h1 className="text-lg font-display font-semibold text-primary hidden sm:block">
              Pratinjau CV Final
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {atsScore !== null && (
              <div className="hidden sm:block">
                <ATSScoreBadge score={atsScore} compact />
              </div>
            )}
            <PDFExportButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Tips & Stats */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* ATS Score Detail */}
            {atsScore !== null && (
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ai" />
                  Analisis ATS
                </h3>
                <ATSScoreBadge score={atsScore} large className="w-full" />
                
                <div className="mt-6 pt-4 border-t border-border">
                  <Link href="/builder/target" className="block w-full">
                    <Button variant="outline" size="sm" className="w-full" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                      Sesuaikan Keywords
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Print Tips */}
            <div className="bg-surface-2 rounded-2xl p-5 border border-border">
              <h3 className="font-semibold text-[#1A2332] mb-3 text-sm">Tips Mencetak / PDF</h3>
              <ul className="space-y-2 text-xs text-[#64748B]">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  CV ini menggunakan format A4 standar industri (210 x 297 mm).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Desain dibuat khusus untuk sistem ATS: tanpa kolom ganda, tanpa gambar/foto, teks murni.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  PDF yang dihasilkan mendukung seleksi teks penuh (full text selectable) yang wajib untuk ATS.
                </li>
              </ul>
            </div>
          </div>

          {/* Right: CV Preview */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-xl shadow-modal border border-border overflow-hidden w-full max-w-[21cm]">
              <ATSTemplate />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
