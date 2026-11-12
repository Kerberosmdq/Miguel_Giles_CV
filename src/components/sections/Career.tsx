import { getTranslations } from 'next-intl/server';
import { SectionLabel } from '@/components/ui/SectionLabel';
import shared from './Section.module.css';
import styles from './Career.module.css';

type Item = { period: string; role: string; org: string; text: string };

export async function Career() {
  const t = await getTranslations('career');
  const items = t.raw('items') as Item[];

  return (
    <section id="trayectoria" className={shared.section} aria-labelledby="trayectoria-title">
      <div className="container">
        <SectionLabel>{t('label')}</SectionLabel>
        <h2 id="trayectoria-title">{t('title')}</h2>
        <p className={shared.intro}>{t('intro')}</p>

        <ol className={styles.timeline} aria-label={t('timelineLabel')}>
          {items.map((i) => (
            <li key={i.period + i.role} className={styles.item}>
              <p className={`mono ${styles.period}`}>{i.period}</p>
              <div>
                <h3 className={styles.role}>{i.role}</h3>
                {i.org && <p className={styles.org}>{i.org}</p>}
                {i.text && <p className={styles.text}>{i.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
