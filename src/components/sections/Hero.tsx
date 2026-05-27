'use client';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  const t = useTranslations('hero');
  const pathname = usePathname();

  return (
    <section id="hero" className={styles.hero}>
      {/* ── Dark Side (Left) ── */}
      <div className={styles.darkSide}>
        <motion.div
          className={styles.photoContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.photoGlow}>
            <div className={styles.photoWrapper}>
              <Image
                src="/images/miguel-profile.png"
                alt="Miguel Giles"
                width={320}
                height={320}
                priority
                className={styles.photo}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.darkCta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <button
            className="btn btn-primary"
            onClick={() => {
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {t('cta_primary')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>

      {/* ── Light Side (Right) ── */}
      <div className={styles.lightSide}>
        <div className={styles.textContent}>
          <motion.p
            className={styles.greeting}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('greeting')}
          </motion.p>

          <motion.h1
            className={styles.name}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('name')}
          </motion.h1>

          <motion.p
            className={styles.role}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {t('role')}
          </motion.p>

          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            {t('tagline')}
          </motion.p>

          <motion.div
            className={styles.lightCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <button className="btn btn-outline-light" onClick={() => window.location.href = `/${pathname.split('/')[1] || 'es'}/cv`}>
              {t('cta_secondary')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13l10-10M6 3h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <motion.div
          className={styles.scrollDot}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
