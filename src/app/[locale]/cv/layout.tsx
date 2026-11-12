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
      ? 'CV — Miguel Giles · Applied AI Engineer'
      : 'Resume — Miguel Giles · Applied AI Engineer',
    description: isEs
      ? 'CV de Miguel Giles: Applied AI Engineer para manufactura regulada (GxP, 21 CFR Part 11). RAG, LLMs y orquestación multiagente. 13+ años en mantenimiento y automatización industrial.'
      : 'Resume of Miguel Giles: Applied AI Engineer for regulated manufacturing (GxP, 21 CFR Part 11). RAG, LLMs and multi-agent orchestration. 13+ years in industrial maintenance and automation.',
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
