import { getTranslations, getLocale } from 'next-intl/server';
import { Flow } from '@/components/diagrams/Flow';
import { Button } from '@/components/ui/Button';
import { LINKEDIN_URL } from '@/lib/site';
import styles from './Hero.module.css';

export async function Hero() {
  const t = await getTranslations('hero');
  const locale = await getLocale();
  const tags = t.raw('tags') as string[];
  const rag = t.raw('ragMini') as string[];

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className="container">
        <p className="mono">{t('meta')}</p>
        <h1 id="hero-title" className={styles.title}>{t('title')}</h1>
        <p className={styles.lead}>{t('lead')}</p>
        <p className={`mono ${styles.tags}`}>{tags.join(' · ')}</p>

        <div className={styles.ctas}>
          <Button href="#nexindu">{t('ctaPrimary')}</Button>
          <Button
            variant="secondary"
            href={`/cv/Miguel_Giles_CV_${locale.toUpperCase()}.pdf`}
            download
          >
            {t('ctaSecondary')}
          </Button>
          <a className={styles.link} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
        <p className={`mono ${styles.availability}`}>{t('availability')}</p>

        <div className={styles.rag}>
          <Flow
            compact
            label={t('ragMiniLabel')}
            steps={rag.map((title, i) => ({
              title,
              tone: i === 0 || i === rag.length - 1 ? 'key' : undefined,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
