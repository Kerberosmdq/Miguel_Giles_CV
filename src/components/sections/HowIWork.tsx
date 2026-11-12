import { getTranslations } from 'next-intl/server';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AgentFlow } from '@/components/diagrams/AgentFlow';
import styles from './Section.module.css';

export async function HowIWork() {
  const t = await getTranslations('method');
  return (
    <section id="metodo" className={styles.section} aria-labelledby="metodo-title">
      <div className="container">
        <SectionLabel>{t('label')}</SectionLabel>
        <h2 id="metodo-title">{t('title')}</h2>
        <p className={styles.intro}>{t('intro')}</p>
        <AgentFlow />
      </div>
    </section>
  );
}
