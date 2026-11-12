import { getTranslations } from 'next-intl/server';
import { Flow } from './Flow';
import styles from './Diagram.module.css';

export async function RoutingFlow() {
  const t = await getTranslations('nexindu.routing');
  return (
    <figure className={styles.figure}>
      <Flow
        label={t('figLabel')}
        steps={[
          { title: t('query'), tone: 'key' },
          { title: t('classifier') },
        ]}
      />
      <div className={styles.branches}>
        <Flow
          vertical
          steps={[
            { title: t('aIntents') },
            { title: t('aAction'), tone: 'key' },
          ]}
        />
        <Flow
          vertical
          steps={[
            { title: t('bIntents') },
            { title: t('bAction'), tone: 'key' },
            { title: t('bFallback') },
          ]}
        />
      </div>
      <p className={styles.bar}>{t('bar')}</p>
      <figcaption className={styles.caption}>{t('caption')}</figcaption>
    </figure>
  );
}
