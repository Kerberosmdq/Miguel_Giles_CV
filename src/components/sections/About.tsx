'use client';

import { useTranslations } from 'next-intl';
import styles from './About.module.css';

export default function About() {
  const t = useTranslations('about');
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <section id="about" className={`section-dark ${styles.aboutSection}`}>
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.text}>{t('text')}</p>
        <dl className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt className={styles.value}>{s.value}</dt>
              <dd className={styles.label}>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
