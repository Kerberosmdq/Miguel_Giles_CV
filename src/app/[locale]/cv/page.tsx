'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CV.module.css';

export default function CVPage() {
  const t = useTranslations('cv');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';

  const nexinduBullets = t.raw('software.nexindu.bullets') as string[];
  const nexkioBullets = t.raw('software.nexkio.bullets') as string[];
  const bbraunBullets = t.raw('industrial.bbraun.bullets') as string[];
  const coironBullets = t.raw('industrial.coiron.bullets') as string[];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.printHeader}>
        <button className="btn btn-primary" onClick={handlePrint}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }} aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          {t('print')}
        </button>
        <Link href={`/${locale}`} className="btn btn-outline-dark">
          {t('back')}
        </Link>
      </div>

      <motion.div
        className={styles.resumePaper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.photoContainer}>
              <Image
                src="/images/miguel-profile.png"
                alt="Miguel Giles"
                width={110}
                height={110}
                className={styles.profilePhoto}
                priority
              />
            </div>
            <h1 className={styles.name}>Miguel Giles</h1>
            <p className={styles.role}>{t('role')}</p>
          </div>

          {/* Contact */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>{t('sidebar.contactTitle')}</h3>
            <ul className={styles.contactList}>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <a href="mailto:miga.gls246@gmail.com" className={styles.contactLink}>miga.gls246@gmail.com</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +54 9 223 455-6968
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Mar del Plata, Argentina
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <a href="https://miguelgiles.dev" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>miguelgiles.dev</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                <a href="https://linkedin.com/in/miguel-giles" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>linkedin.com/in/miguel-giles</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                <a href="https://github.com/kerberosmdq" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>github.com/kerberosmdq</a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>{t('sidebar.techTitle')}</h3>
            <div className={styles.skillTags}>
              <span>Next.js</span>
              <span>React</span>
              <span>TypeScript</span>
              <span>Python</span>
              <span>IA (RAG)</span>
              <span>SQL / NoSQL</span>
            </div>
          </div>

          {/* Industrial Skills */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>{t('sidebar.hardSkillsTitle')}</h3>
            <div className={styles.skillTags}>
              <span>Automatización (PLC)</span>
              <span>Troubleshooting</span>
              <span>Neumática</span>
              <span>Electricidad</span>
              <span>Lean / 5S</span>
            </div>
          </div>

          {/* Education */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>{t('sidebar.educationTitle')}</h3>
            <div className={styles.eduItem}>
              <span className={styles.eduDegree}>{t('education.title')}</span>
              <span className={styles.eduSchool}>{t('education.school')}</span>
              <span className={styles.eduYear}>{t('education.year')}</span>
            </div>
            <div className={styles.eduItem} style={{ marginTop: '10px' }}>
              <span className={styles.eduDegree}>{t('education.selfTaught')}</span>
              <span className={styles.eduYear}>{t('education.selfTaughtPeriod')}</span>
            </div>
          </div>

          {/* Languages */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>{t('sidebar.languagesTitle')}</h3>
            <div className={styles.langRow}>
              <span className={styles.langName}>{t('languages.spanish')}</span>
              <span className={styles.langLevel}>{t('languages.spanishLevel')}</span>
            </div>
            <div className={styles.langRow}>
              <span className={styles.langName}>{t('languages.english')}</span>
              <span className={styles.langLevel}>{t('languages.englishLevel')}</span>
            </div>
          </div>

          {/* QR */}
          <div className={styles.qrSection}>
            <img
              src="/images/qr-miguelgiles.svg"
              alt="QR miguelgiles.dev"
              className={styles.qrCode}
              width={88}
              height={88}
            />
            <span className={styles.qrText}>miguelgiles.dev</span>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className={styles.mainContent}>

          {/* Profile */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('profile.title')}</h2>
            <p className={styles.profileText}>{t('profile.text')}</p>
          </section>

          {/* Software Projects */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('software.title')}</h2>

            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>NexIndu</h3>
                  <a href="https://nexindu.com.ar" target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                    {t('software.nexindu.link')}
                  </a>
                </div>
                <span className={styles.itemPeriodRight}>{t('software.nexindu.period')}</span>
              </div>
              <ul className={styles.bulletList}>
                {nexinduBullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>NexKio</h3>
                </div>
                <span className={styles.statusBadge}>{t('software.nexkio.status')}</span>
              </div>
              <ul className={styles.bulletList}>
                {nexkioBullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <p className={styles.moreText}>{t('software.more')}</p>
          </section>

          {/* Industrial Experience */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('industrial.title')}</h2>

            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>{t('industrial.bbraun.role')}</h3>
                  <span className={styles.itemSubtitle}>{t('industrial.bbraun.company')}</span>
                </div>
                <span className={styles.itemPeriodRight}>{t('industrial.bbraun.period')}</span>
              </div>
              <ul className={styles.bulletList}>
                {bbraunBullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>{t('industrial.coiron.role')}</h3>
                  <span className={styles.itemSubtitle}>{t('industrial.coiron.company')}</span>
                </div>
                <span className={styles.itemPeriodRight}>{t('industrial.coiron.period')}</span>
              </div>
              <ul className={styles.bulletList}>
                {coironBullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </section>
        </main>
      </motion.div>
    </div>
  );
}
