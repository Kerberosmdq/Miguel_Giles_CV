'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  const t = useTranslations('hero');
  const pathname = usePathname();
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

  // Framer motion variants for text reveal
  const titleVariants = {
    hidden: { clipPath: 'inset(100% 0 0 0)' },
    visible: { 
      clipPath: 'inset(0% 0 0 0)',
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], staggerChildren: 0.1 }
    }
  };

  const lineVariants = {
    hidden: { y: '100%' },
    visible: { 
      y: '0%',
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }
    }
  };

  return (
    <section id="hero" className={styles.hero}>
      {/* ── Dark Side (Left - 40%) ── */}
      <motion.div className={styles.darkSide} style={isMounted ? { width: darkWidth } : { width: '40%' }}>
        <motion.div
          className={styles.photoContainer}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={isMounted ? { opacity: opacityFade } : { opacity: 1 }}
        >
          <button
            className="btn btn-primary"
            data-cursor-text="EXPLORE"
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
          <motion.p
            className={styles.greeting}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            {t('greeting')}
          </motion.p>

          <motion.div 
            className={styles.nameContainer}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Split name for animated lines if needed, or single block */}
            <motion.div className={styles.lineMask}>
              <motion.h1 variants={lineVariants} className={styles.name}>
                {t('name')}
              </motion.h1>
            </motion.div>
          </motion.div>

          <motion.p
            className={styles.role}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            {t('role')}
          </motion.p>

          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            {t('tagline')}
          </motion.p>

          <motion.div
            className={styles.lightCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
          >
            <button 
              className="btn btn-outline-light" 
              data-cursor-text="PDF"
              onClick={() => window.location.href = `/${pathname.split('/')[1] || 'es'}/cv`}
            >
              <span className={styles.btnText}>{t('cta_secondary')}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13l10-10M6 3h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Animated Divider ── */}
      <motion.div 
        className={styles.centerDivider}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
        style={isMounted ? { opacity: opacityFade } : { opacity: 1 }}
      />
    </section>
  );
}
