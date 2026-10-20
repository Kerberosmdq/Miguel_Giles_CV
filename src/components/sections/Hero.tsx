'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import styles from './Hero.module.css';

export function Hero() {
  const t = useTranslations('hero');
  const { scrollY } = useScroll();

  // Scroll-driven morphs
  const lightWidth = useTransform(scrollY, [0, 400], ['60%', '0%']);
  const darkWidth = useTransform(scrollY, [0, 400], ['40%', '100%']);
  const titleY = useTransform(scrollY, [0, 300], [0, 100]);
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      {/* ── Dark Side (Left - 40%) ── */}
      <motion.div className={styles.darkSide} style={isMounted ? { width: darkWidth } : { width: '40%' }}>
        <motion.div
          className={styles.photoContainer}
          style={isMounted ? { opacity: opacityFade } : { opacity: 1 }}
        >
          <div className={styles.photoWrapper}>
            <Image
              src="/images/miguel-profile.png"
              alt="Miguel Giles"
              width={400}
              height={500}
              priority
              className={styles.photo}
            />
            <div className={styles.photoAccentLine} />
          </div>
        </motion.div>

        <motion.div
          className={styles.darkCta}
          style={isMounted ? { opacity: opacityFade } : { opacity: 1 }}
        >
          <button
            className="btn btn-primary"
            onClick={() => {
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <span className={styles.btnText}>{t('cta_primary')}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </motion.div>

      {/* ── Light Side (Right - 60%) ── */}
      <motion.div className={styles.lightSide} style={isMounted ? { width: lightWidth } : { width: '60%' }}>
        <motion.div className={styles.textContent} style={isMounted ? { y: titleY, opacity: opacityFade } : { y: 0, opacity: 1 }}>
          <p className={styles.greeting}>{t('greeting')}</p>

          <div className={styles.nameContainer}>
            <div className={styles.lineMask}>
              <h1 className={styles.name}>{t('name')}</h1>
            </div>
          </div>

          <p className={styles.role}>{t('role')}</p>
          <p className={styles.stackLine}>{t('stackLine')}</p>

          <div className={styles.divider} />

          <p className={styles.tagline}>{t('tagline')}</p>

          <p className={styles.availability}>
            <span className={styles.availabilityDot} aria-hidden="true" />
            {t('availability')}
          </p>

          <div className={styles.lightCta}>
            <Link href="/cv" className="btn btn-outline-light">
              <span className={styles.btnText}>{t('cta_secondary')}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 13l10-10M6 3h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Animated Divider ── */}
      <motion.div 
        className={styles.centerDivider}
        style={isMounted ? { opacity: opacityFade } : { opacity: 1 }}
      />
    </section>
  );
}
