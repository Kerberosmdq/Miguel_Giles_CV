'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import styles from './Header.module.css';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const nextLocale = locale === 'es' ? 'en' : 'es';
  const cvHref = `/cv/Miguel_Giles_CV_${locale.toUpperCase()}.pdf`;

  const links = [
    { href: '#nexindu', label: t('nexindu') },
    { href: '#metodo', label: t('method') },
    { href: '#trayectoria', label: t('career') },
    { href: '#contacto', label: t('contact') },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <a href="#top" className={styles.logo} aria-label={t('home')}>
          M. GILES
        </a>

        <nav
          id="site-nav"
          aria-label={t('primary')}
          className={`${styles.nav} ${open ? styles.open : ''}`}
        >
          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={styles.link} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={cvHref} download className={styles.link}>
                {t('cv')}
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link
            href={pathname}
            locale={nextLocale}
            className={styles.lang}
            hrefLang={nextLocale}
            aria-label={t('language')}
          >
            <span aria-current={locale === 'es' ? 'true' : undefined}>ES</span>
            <span aria-hidden="true"> / </span>
            <span aria-current={locale === 'en' ? 'true' : undefined}>EN</span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={styles.bars} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
