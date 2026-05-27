'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

import Image from 'next/image';

const NAV_ITEMS = ['work', 'about', 'experience', 'stack', 'contact'] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLocale = pathname.startsWith('/en') ? 'en' : 'es';
  const otherLocale = currentLocale === 'es' ? 'en' : 'es';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > lastScrollY && currentY > 200);
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const switchLanguage = () => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${otherLocale}`);
    router.push(newPath);
  };

  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}
    >
      <div className={styles.inner}>
        <a href={`/${currentLocale}`} className={styles.logo} aria-label="Miguel Giles">
          <svg viewBox="0 0 100 100" width="60" height="60" className={styles.logoSvg}>
            <defs>
              <filter id="removeBg" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  2 2 2 0 -0.6
                " />
              </filter>
            </defs>
            <image href="/images/logo.png" width="100" height="100" filter="url(#removeBg)" />
          </svg>
        </a>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={styles.navLink}
              onClick={() => scrollToSection(item)}
            >
              {t(item)}
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          <button className={styles.langSwitch} onClick={switchLanguage}>
            <span className={currentLocale === 'es' ? styles.langActive : ''}>
              ES
            </span>
            <span className={styles.langDivider}>|</span>
            <span className={currentLocale === 'en' ? styles.langActive : ''}>
              EN
            </span>
          </button>

          <button
            className={styles.cta}
            onClick={() => scrollToSection('contact')}
          >
            {t('cta')}
          </button>

          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
