import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Preloader } from '@/components/ui/Preloader';
import { CustomCursor } from '@/components/ui/CustomCursor';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
    metadataBase: new URL('https://miguelgiles.dev'),
    title: isEs
      ? 'Miguel Giles — Electromecánico & Desarrollador | Apps NEX'
      : 'Miguel Giles — Electromechanic & Developer | NEX Apps',
    description: isEs
      ? 'Portfolio de Miguel Giles. +13 años en mantenimiento industrial. Desarrollador Full Stack autodidacta creando apps que resuelven problemas reales.'
      : 'Miguel Giles Portfolio. 13+ years in industrial maintenance. Self-taught Full Stack developer building apps that solve real problems.',
    keywords: [
      'Miguel Giles',
      'developer',
      'electromechanic',
      'portfolio',
      'Next.js',
      'TypeScript',
      'vibe coding',
      'NEX apps',
      'GxP',
      'Mar del Plata',
    ],
    authors: [{ name: 'Miguel Giles' }],
    creator: 'Miguel Giles',
    openGraph: {
      type: 'website',
      locale: isEs ? 'es_AR' : 'en_US',
      url: `https://miguelgiles.dev/${locale}`,
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Miguel Giles',
  jobTitle: 'Full Stack Developer & Electromechanical Technician',
  url: 'https://miguelgiles.dev',
  email: 'miga.gls246@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mar del Plata',
    addressCountry: 'AR',
  },
  sameAs: [
    'https://linkedin.com/in/miguel-giles',
    'https://github.com/kerberosmdq',
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
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
            {locale === 'es' ? 'Ir al contenido' : 'Skip to content'}
          </a>
          <Preloader />
          <CustomCursor />
          <div className="noise-overlay" aria-hidden="true" />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
