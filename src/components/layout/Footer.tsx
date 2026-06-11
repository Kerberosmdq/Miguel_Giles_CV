'use client';

import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      {/* Top Gradient Border */}
      <div className={styles.topBorder} />

      {/* Massive Watermark Text */}
      <div className={styles.watermarkContainer}>
        <span className={styles.watermark}>MIGUEL GILES</span>
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.mainRow}>
          <div className={styles.brand}>
            <span className={styles.logo}>NEX.</span>
            <p className={styles.copyright}>
              © {currentYear} Miguel Giles. {t('copyright')}
            </p>
          </div>

          <div className={styles.actions}>
            <button
              onClick={scrollToTop}
              className={styles.backToTop}
              data-cursor-text="UP"
              aria-label="Volver al inicio"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.forged}>
            {t('forgedWith')} <span className={styles.accent}>Vibe Coding</span>
          </p>
          <div className={styles.links}>
            <a href="https://linkedin.com/in/miguel-giles" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/kerberosmdq" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
