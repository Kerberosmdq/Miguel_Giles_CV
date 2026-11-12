import { SITE_URL } from '@/lib/site';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Miguel Giles — Applied AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITLES = {
  es: 'IA que se puede auditar, para manufactura regulada.',
  en: 'Auditable AI for regulated manufacturing.',
} as const;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = TITLES[locale === 'en' ? 'en' : 'es'];

  return new ImageResponse(
    (
      <div
        style={{
          background: '#F7F6F2',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          fontFamily: 'sans-serif',
          borderTop: '12px solid #1F4E8C',
        }}
      >
        <div style={{ color: '#1F4E8C', fontSize: 24, letterSpacing: '0.06em', marginBottom: 32 }}>
          DOC-001 · Applied AI Engineer · Rev. 2026-11
        </div>
        <div style={{ color: '#1B1F27', fontSize: 40, fontWeight: 500, marginBottom: 16 }}>
          Miguel Giles
        </div>
        <div style={{ color: '#1B1F27', fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ color: '#5A6070', fontSize: 22, marginTop: 48 }}>
          {SITE_URL.replace('https://', '')}
        </div>
      </div>
    ),
    { ...size }
  );
}
