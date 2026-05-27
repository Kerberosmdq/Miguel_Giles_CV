'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.content}
        >
          <p className={styles.copyright}>
            © {currentYear} Miguel Giles. {t('copyright')}
          </p>
          <p className={styles.forged}>
            {t('forgedWith')} <span className={styles.accent}>Next.js</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
