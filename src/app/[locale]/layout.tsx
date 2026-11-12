import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { SITE_URL, EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/lib/site';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  return {
    metadataBase: new URL(SITE_URL),
    title: isEs
      ? 'Miguel Giles — Applied AI Engineer · Software para manufactura regulada (GxP)'
      : 'Miguel Giles — Applied AI Engineer · Software for regulated manufacturing (GxP)',
    description: isEs
      ? 'Applied AI Engineer: RAG, LLMs y orquestación multiagente para manufactura regulada (GxP, 21 CFR Part 11). Creador de NexIndu. 13+ años en mantenimiento y automatización industrial.'
      : 'Applied AI Engineer: RAG, LLMs and multi-agent orchestration for regulated manufacturing (GxP, 21 CFR Part 11). Creator of NexIndu. 13+ years in industrial maintenance and automation.',
    keywords: [
      'Applied AI Engineer',
      'RAG',
      'LLM',
      'pgvector',
      'multi-agent',
      'GxP',
      '21 CFR Part 11',
      'CMMS',
      'NexIndu',
      'Mar del Plata',
    ],
    authors: [{ name: 'Miguel Giles' }],
    creator: 'Miguel Giles',
    openGraph: {
      type: 'website',
      locale: isEs ? 'es_AR' : 'en_US',
      url: `${SITE_URL}/${locale}`,
      siteName: 'Miguel Giles',
      title: isEs
        ? 'Miguel Giles — Applied AI Engineer'
        : 'Miguel Giles — Applied AI Engineer',
      description: isEs
        ? 'IA que se puede auditar, para manufactura regulada. RAG, trazabilidad y 21 CFR Part 11.'
        : 'Auditable AI for regulated manufacturing. RAG, traceability and 21 CFR Part 11.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Miguel Giles — Applied AI Engineer',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/es`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Miguel Giles',
  jobTitle: 'Applied AI Engineer',
  knowsAbout: [
    'Retrieval-Augmented Generation',
    'Large Language Models',
    'pgvector',
    'Multi-agent orchestration',
    'GxP',
    '21 CFR Part 11',
    'CMMS',
    'PLC automation',
    'Next.js',
    'TypeScript',
    'PostgreSQL',
  ],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'Diplomado Python & Inteligencia Artificial',
    credentialCategory: 'Diploma',
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: 'UTN Facultad Regional Delta + Instituto Linux',
    },
  },
  url: SITE_URL,
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mar del Plata',
    addressCountry: 'AR',
  },
  sameAs: [
    LINKEDIN_URL,
    GITHUB_URL,
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="skip-link">
            {(messages as { ui: { skip: string } }).ui.skip}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
