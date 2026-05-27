import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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
    title: isEs
      ? 'Miguel Giles — Electromecánico & Desarrollador | Apps NEX'
      : 'Miguel Giles — Electromechanic & Developer | NEX Apps',
    description: isEs
      ? 'Portfolio de Miguel Giles. +10 años en mantenimiento industrial. Desarrollador autodidacta creando apps que resuelven problemas reales.'
      : 'Miguel Giles Portfolio. 10+ years in industrial maintenance. Self-taught developer building apps that solve real problems.',
    keywords: [
      'Miguel Giles',
      'developer',
      'electromechanic',
      'portfolio',
      'Next.js',
      'TypeScript',
      'vibe coding',
      'NEX apps',
    ],
    authors: [{ name: 'Miguel Giles' }],
    creator: 'Miguel Giles',
    openGraph: {
      type: 'website',
      locale: isEs ? 'es_AR' : 'en_US',
      url: 'https://miguelgiles.dev',
      siteName: 'Miguel Giles',
      title: isEs
        ? 'Miguel Giles — Electromecánico & Desarrollador'
        : 'Miguel Giles — Electromechanic & Developer',
      description: isEs
        ? 'De arreglar máquinas a construirlas digitalmente. Conocé mi historia y mis proyectos.'
        : 'From fixing machines to building them digitally. Discover my story and projects.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Miguel Giles — Electromechanic × Developer',
    },
    alternates: {
      canonical: `https://miguelgiles.dev/${locale}`,
      languages: {
        es: 'https://miguelgiles.dev/es',
        en: 'https://miguelgiles.dev/en',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="grain-overlay" aria-hidden="true" />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
