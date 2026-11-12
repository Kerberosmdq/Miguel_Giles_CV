import { getTranslations } from 'next-intl/server';
import { SectionLabel } from '@/components/ui/SectionLabel';
import shared from './Section.module.css';
import styles from './Education.module.css';

export async function Education() {
  const t = await getTranslations('education');
  const meta = t.raw('featured.meta') as string[];

  return (
    <section id="formacion" className={shared.section} aria-labelledby="formacion-title">
      <div className="container">
        <SectionLabel>{t('label')}</SectionLabel>
        <h2 id="formacion-title">{t('title')}</h2>

        <article className={styles.featured}>
          <h3>{t('featured.title')}</h3>
          <p className={styles.org}>{t('featured.org')}</p>
          <p className={`mono ${styles.meta}`}>{meta.join(' · ')}</p>
        </article>

        <div className={styles.secondary}>
          <p>
            <strong>{t('tech.title')}</strong> — {t('tech.org')} · {t('tech.year')}
          </p>
          <p>
            <span className="mono">{t('languagesLabel')}:</span> {t('languages')}
          </p>
        </div>
      </div>
    </section>
  );
}
