import { getTranslations } from 'next-intl/server';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TagList } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { RagFlow } from '@/components/diagrams/RagFlow';
import { RoutingFlow } from '@/components/diagrams/RoutingFlow';
import { NexinduDemoLazy } from './NexinduDemoLazy';
import { NEXINDU_URL } from '@/lib/site';
import styles from './CaseNexindu.module.css';

type Block = { title: string; items: string[] };

export async function CaseNexindu() {
  const t = await getTranslations('nexindu');
  const approach = t.raw('approach') as { k: string; v: string }[];
  const blocks = t.raw('blocks') as Block[];
  const stack = t.raw('stack') as string[];

  return (
    <section id="nexindu" className={styles.section} aria-labelledby="nexindu-title">
      <div className="container">
        <SectionLabel>{t('label')}</SectionLabel>
        <h2 id="nexindu-title">{t('title')}</h2>
        <p className={`mono ${styles.status}`}>
          {t('status')}{' '}
          <a href={NEXINDU_URL} target="_blank" rel="noopener noreferrer">nexindu.com.ar</a>
        </p>

        <div className={styles.cols}>
          <div>
            <h3 className={styles.sub}>{t('problemTitle')}</h3>
            <p className={styles.problem}>{t('problem')}</p>
          </div>
          <div>
            <h3 className={styles.sub}>{t('approachTitle')}</h3>
            <dl className={styles.approach}>
              {approach.map((a) => (
                <div key={a.k} className={styles.row}>
                  <dt>{a.k}</dt>
                  <dd>{a.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={styles.diagrams}>
          <RagFlow />
          <RoutingFlow />
        </div>

        <div className={styles.blocks}>
          {blocks.map((b) => (
            <div key={b.title} className={styles.block}>
              <h3 className={styles.blockTitle}>{b.title}</h3>
              <ul>
                {b.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <figure className={styles.demo}>
          <div className={styles.demoFrame} role="group" aria-label={t('demoLabel')}>
            <NexinduDemoLazy />
          </div>
          <figcaption className="mono">{t('demoCaption')}</figcaption>
        </figure>

        <TagList items={stack} label={t('stackLabel')} />

        <div className={styles.cta}>
          <Button href={NEXINDU_URL} target="_blank" rel="noopener noreferrer">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
