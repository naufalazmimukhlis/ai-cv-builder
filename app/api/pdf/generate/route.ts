import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP } from '@/lib/rate-limiter';
import type { CVData } from '@/types/cv';

export const maxDuration = 30;

// Server-side PDF generation is handled as a fallback
// Primary: client-side @react-pdf/renderer
// This route returns CV data for server-side rendering if needed
export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await rateLimit(`pdf:${ip}`);
  if (!success) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan.' }, { status: 429 });
  }

  let cvData: CVData;
  try {
    const body = await request.json() as { cvData: CVData };
    cvData = body.cvData;
    if (!cvData?.personal?.fullName) {
      return NextResponse.json({ error: 'Data CV tidak lengkap.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
  }

  try {
    // Return structured CV data for client-side PDF generation
    // The actual PDF rendering is done client-side with @react-pdf/renderer
    const filename = `${cvData.personal.fullName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')}_cv-ats.pdf`;

    return NextResponse.json({
      success: true,
      filename,
      message: 'Gunakan client-side PDF generation',
    });
  } catch (err) {
    console.error('[PDF Error]:', err);
    return NextResponse.json({ error: 'Gagal memproses data PDF.' }, { status: 500 });
  }
}
