import { getTranslations } from 'next-intl/server';
import { Flow } from './Flow';
import styles from './Diagram.module.css';

export async function RagFlow() {
  const t = await getTranslations('nexindu.rag');
  const indexing = t.raw('indexing') as string[];
  const query = t.raw('query') as string[];
  const mark = (items: string[]) =>
    items.map((title, i) => ({
      title,
      tone: i === 0 || i === items.length - 1 ? ('key' as const) : undefined,
    }));

  return (
    <figure className={styles.figure}>
      <p className={styles.rowLabel}>{t('indexingLabel')}</p>
      <Flow steps={mark(indexing)} label={`${t('figLabel')}: ${t('indexingLabel')}`} />
      <p className={styles.rowLabel}>{t('queryLabel')}</p>
      <Flow steps={mark(query)} label={`${t('figLabel')}: ${t('queryLabel')}`} />
      <figcaption className={styles.caption}>{t('caption')}</figcaption>
    </figure>
  );
}
