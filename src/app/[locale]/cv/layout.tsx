import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  return {
    title: isEs
      ? 'CV — Miguel Giles · Desarrollador Full Stack'
      : 'Resume — Miguel Giles · Full Stack Developer',
    description: isEs
      ? 'CV de Miguel Giles: desarrollador Full Stack (Next.js, TypeScript, Supabase) con 13 años en la industria farmacéutica e industrial.'
      : 'Resume of Miguel Giles: Full Stack developer (Next.js, TypeScript, Supabase) with 13 years in the pharmaceutical and industrial sectors.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/cv`,
      languages: {
        es: `${SITE_URL}/es/cv`,
        en: `${SITE_URL}/en/cv`,
      },
    },
  };
}

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return children;
}
