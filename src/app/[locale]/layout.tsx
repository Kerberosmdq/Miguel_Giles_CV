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
      ? 'Miguel Giles — Desarrollador Full Stack | Next.js · TypeScript'
      : 'Miguel Giles — Full Stack Developer | Next.js · TypeScript',
    description: isEs
      ? 'Desarrollador Full Stack con 13 años en la industria (9 en farma GxP). Apps en uso real con Next.js, TypeScript y Supabase. Disponible para trabajo remoto.'
      : 'Full Stack Developer with 13 years in industry (9 in GxP pharma). Apps in real use built with Next.js, TypeScript and Supabase. Open to remote work.',
    keywords: [
      'Miguel Giles',
      'Full Stack Developer',
      'Desarrollador Full Stack',
      'Next.js',
      'TypeScript',
      'Supabase',
      'GxP',
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
        ? 'Miguel Giles — Desarrollador Full Stack'
        : 'Miguel Giles — Full Stack Developer',
      description: isEs
        ? 'Apps en uso real con Next.js, TypeScript y Supabase. 13 años en la industria, 9 en farma GxP.'
        : 'Apps in real use built with Next.js, TypeScript and Supabase. 13 years in industry, 9 in GxP pharma.',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEs ? 'Miguel Giles — Desarrollador Full Stack' : 'Miguel Giles — Full Stack Developer',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
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
  jobTitle: 'Full Stack Developer',
  knowsAbout: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Playwright', 'PLC automation', 'GxP'],
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
