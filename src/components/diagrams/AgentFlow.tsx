import { getTranslations } from 'next-intl/server';
import { Flow } from './Flow';
import styles from './Diagram.module.css';

export async function AgentFlow() {
  const t = await getTranslations('method');
  const steps = t.raw('steps') as { title: string; desc: string }[];

  return (
    <figure className={styles.figure}>
      <Flow
        numbered
        label={t('figLabel')}
        steps={steps.map((s, i) => ({
          ...s,
          tone: i === steps.length - 1 ? ('ok' as const) : undefined,
        }))}
      />
      <figcaption className={styles.caption}>{t('caption')}</figcaption>
    </figure>
  );
}
