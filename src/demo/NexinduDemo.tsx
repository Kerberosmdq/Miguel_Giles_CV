'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider, useLocale, type AbstractIntlMessages } from 'next-intl';
import './demo.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

// La demo usa la hora y la fecha del visitante: sólo se renderiza en el cliente.
const ProductDemo = dynamic(() => import('./nexindu/ProductDemo'), { ssr: false });

/**
 * Mini demo de NexIndu (portada de la landing de NexIndu, con datos ficticios).
 * Tiene su propio provider de next-intl con los textos de la app original, así las
 * escenas se copian sin tocar sus claves de traducción.
 */
export default function NexinduDemo() {
  const locale = useLocale();
  const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = locale === 'en' ? import('./messages/nexindu.en.json') : import('./messages/nexindu.es.json');
    load.then((m) => {
      if (!cancelled) setMessages(m.default as AbstractIntlMessages);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className={`nexdemo ${geistSans.variable} ${geistMono.variable}`} style={{ background: 'transparent' }}>
      {messages && (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ProductDemo />
        </NextIntlClientProvider>
      )}
    </div>
  );
}
