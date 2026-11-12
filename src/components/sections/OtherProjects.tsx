import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { mainProjects, otherProjects } from '@/data/projects';
import shared from './Section.module.css';
import styles from './OtherProjects.module.css';

export async function OtherProjects() {
  const t = await getTranslations('others');

  return (
    <section id="proyectos" className={shared.section} aria-labelledby="proyectos-title">
      <div className="container">
        <SectionLabel>{t('label')}</SectionLabel>
        <h2 id="proyectos-title">{t('title')}</h2>
        <p className={`mono ${shared.note}`}>{t('note')}</p>

        <div className={styles.cards}>
          {mainProjects.map((p) => (
            <article key={p.id} className={styles.card}>
              <header className={styles.head}>
                <Image src={`/images/Projects/${p.id}.png`} alt="" width={48} height={48} className={styles.logo} />
                <div>
                  <h3>{p.name}</h3>
                  <p className={`mono ${styles.badge}`}>{t(`${p.id}.badge`)}</p>
                </div>
              </header>
              <p className={styles.line}>{t(`${p.id}.line`)}</p>
              <ul className={styles.bullets}>
                {(t.raw(`${p.id}.bullets`) as string[]).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <ul className={styles.compact}>
          {otherProjects.map((p) => (
            <li key={p.id} className={styles.row}>
              <Image src={`/images/Projects/${p.id}.png`} alt="" width={48} height={48} className={styles.logo} />
              <div>
                <h3 className={styles.rowName}>{p.name}</h3>
                <p className={styles.rowLine}>{t(p.id)}</p>
                <p className={`mono ${styles.links}`}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">{t('live')}</a>
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">{t('code')}</a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
