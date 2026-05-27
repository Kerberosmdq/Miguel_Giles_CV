'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';

export default function Experience() {
  const t = useTranslations('experience');

  return (
    <section id="experience" className={`section-light ${styles.experienceSection}`}>
      <div className={styles.container}>
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('title')}
        </motion.h2>

        <div className={styles.timelineGrid}>
          {/* Industrial Timeline */}
          <div className={styles.timelineColumn}>
            <h3 className={styles.columnTitle}>{t('industrial.title')}</h3>
            
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <span className={styles.period}>{t('industrial.bbraun.period')}</span>
                <h4 className={styles.role}>{t('industrial.bbraun.role')}</h4>
                <h5 className={styles.company}>B.Braun</h5>
                <p className={styles.description}>{t('industrial.bbraun.description')}</p>
              </div>
            </motion.div>

            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <span className={styles.period}>{t('industrial.coiron.period')}</span>
                <h4 className={styles.role}>{t('industrial.coiron.role')}</h4>
                <h5 className={styles.company}>Coiron</h5>
                <p className={styles.description}>{t('industrial.coiron.description')}</p>
              </div>
            </motion.div>
          </div>

          {/* Developer Timeline */}
          <div className={styles.timelineColumn}>
            <h3 className={styles.columnTitle}>{t('developer.title')}</h3>
            
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <span className={styles.period}>{t('developer.recent.period')}</span>
                <h4 className={styles.role}>{t('developer.recent.role')}</h4>
                <h5 className={styles.company}>{t('developer.recent.company')}</h5>
                <p className={styles.description}>{t('developer.recent.description')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
