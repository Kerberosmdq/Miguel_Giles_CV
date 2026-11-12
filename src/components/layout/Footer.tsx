import { getTranslations } from 'next-intl/server';
import { EMAIL, LINKEDIN_URL, GITHUB_URL } from '@/lib/site';
import styles from './Footer.module.css';

export async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className="mono">© 2026 Miguel Giles · DOC-001 Rev. 2026-11</p>
        <ul className={styles.links} aria-label={t('contact')}>
          <li><a href={`mailto:${EMAIL}`}>Email</a></li>
          <li><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </div>
    </footer>
  );
}
