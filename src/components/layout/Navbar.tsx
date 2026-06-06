'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  // Simple logic to switch locale path
  const nextLocale = locale === 'es' ? 'en' : 'es';
  // Fallback in case pathname is just "/" which is rare with next-intl middleware
  const switchPath = pathname.startsWith(`/${locale}`) 
    ? pathname.replace(`/${locale}`, `/${nextLocale}`) 
    : `/${nextLocale}${pathname}`;

  const links = [
    { href: '#work', label: t('work') },
    { href: '#about', label: t('about') },
    { href: '#experience', label: t('experience') },
    { href: '#stack', label: t('stack') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple active section detection
      const sections = ['hero', 'work', 'about', 'experience', 'stack', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.navContainer}`}>
          <a href="#hero" className={styles.logo} data-cursor-text="HOME">
            <Image 
              src="/images/logo_2.png" 
              alt="Miguel Giles Logo" 
              width={68} 
              height={68} 
              className={styles.logoImage} 
              priority
            />
          </a>

          <nav className={styles.desktopNav}>
            {links.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  data-cursor-text="GO"
                >
                  {link.label}
                  {isActive && (
                    <motion.div layoutId="activeNav" className={styles.activeIndicator} />
                  )}
                </a>
              );
            })}
          </nav>

          <div className={styles.navActions}>
            <Link 
              href={switchPath} 
              className={styles.langToggle}
              data-cursor-text="LANG"
            >
              <span className={locale === 'es' ? styles.activeLang : styles.inactiveLang}>ES</span>
              <span className={styles.langSeparator}>/</span>
              <span className={locale === 'en' ? styles.activeLang : styles.inactiveLang}>EN</span>
            </Link>

            <button 
              className={`btn btn-primary ${styles.ctaBtn}`}
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-cursor-text="HI"
            >
              {t('cta')}
            </button>
            <button 
              className={styles.menuToggle} 
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className={styles.mobileMenuContent}>
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + links.length * 0.1 }}
                style={{ color: 'var(--accent)', marginTop: 'var(--space-8)' }}
              >
                {t('cta')}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
