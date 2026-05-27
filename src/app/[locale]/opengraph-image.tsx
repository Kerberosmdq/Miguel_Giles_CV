import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Miguel Giles — Electromechanic × Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: '#00E5FF', fontSize: 20, letterSpacing: '0.15em' }}>
          miguelgiles.dev
        </div>
        <div
          style={{
            color: '#F1F5F9',
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.0,
          }}
        >
          Miguel Giles
        </div>
        <div style={{ color: '#94A3B8', fontSize: 30, letterSpacing: '0.05em' }}>
          Electromechanic × Developer
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
          {['Next.js', 'TypeScript', 'React', 'Python'].map((tech) => (
            <div
              key={tech}
              style={{
                background: '#141414',
                border: '1px solid rgba(0,229,255,0.3)',
                borderRadius: 8,
                padding: '8px 18px',
                color: '#00E5FF',
                fontSize: 18,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            color: '#475569',
            fontSize: 16,
          }}
        >
          Mar del Plata, Argentina
        </div>
      </div>
    ),
    { ...size }
  );
}
