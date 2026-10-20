'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionTransition } from '../ui/SectionTransition';
import styles from './Experience.module.css';

const ENTRIES = ['dev', 'bbraun', 'coiron'] as const;

export default function Experience() {
  const t = useTranslations('experience');

  return (
    <SectionTransition type="darkToLight">
      <section className={`section-light ${styles.experienceSection}`} id="experience">
        <div className="container">
          <div className={styles.header}>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>

          <ol className={styles.timeline}>
            {ENTRIES.map((key) => {
              const bullets = t.raw(`items.${key}.bullets`) as string[];
              const meta = t.has(`items.${key}.meta`) ? t(`items.${key}.meta`) : null;
              return (
                <motion.li
                  key={key}
                  className={styles.entry}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <span className={styles.node} aria-hidden="true" />
                  <div className={styles.card}>
                    <h3 className={styles.role}>{t(`items.${key}.role`)}</h3>
                    <p className={styles.company}>{t(`items.${key}.company`)}</p>
                    <p className={styles.period}>
                      {t(`items.${key}.period`)}
                      {meta ? ` · ${meta}` : ''}
                    </p>
                    <ul className={styles.bullets}>
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>
    </SectionTransition>
  );
}
