'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './CV.module.css';

export default function CVPage() {
  const t = useTranslations('cv');
  const pathname = usePathname();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.printHeader}>
        <button className="btn btn-primary" onClick={handlePrint}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          {t('print')}
        </button>
        <button className="btn btn-outline-dark" onClick={() => window.location.href = `/${pathname.split('/')[1] || 'es'}`}>
          Volver
        </button>
      </div>

      <motion.div 
        className={styles.resumePaper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.photoContainer}>
              <Image 
                src="/images/miguel-profile.png" 
                alt="Miguel Giles" 
                width={120} 
                height={120} 
                className={styles.profilePhoto}
                priority
              />
            </div>
            <h1 className={styles.name}>Miguel Giles</h1>
            <p className={styles.role}>Full Stack Developer &<br/>Técnico Electromecánico</p>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Contacto</h3>
            <ul className={styles.contactList}>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                miga.gls246@gmail.com
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +54 223 455 6968
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Mar del Plata, Arg
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                miguelgiles.dev
              </li>
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>{t('techStack')}</h3>
            <div className={styles.skillTags}>
              <span>Next.js</span><span>React</span><span>TypeScript</span><span>Python</span><span>IA (RAG)</span><span>SQL / NoSQL</span>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>{t('hardSkills')}</h3>
            <div className={styles.skillTags}>
              <span>Automatización (PLC)</span><span>Troubleshooting</span><span>Neumática e Hidráulica</span><span>Electricidad</span><span>Lean/5S</span>
            </div>
          </div>
          
          <div className={styles.qrSection}>
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://miguelgiles.dev&color=0E141B&bgcolor=ffffff" alt="QR Code miguelgiles.dev" className={styles.qrCode} />
             <span className={styles.qrText}>miguelgiles.dev</span>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('profileTitle')}</h2>
            <p className={styles.profileText}>{t('profileText')}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('softwareTitle')}</h2>
            
            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>NexIndu</h3>
                </div>
                <span className={styles.itemPeriodRight}>2025 - Presente</span>
              </div>
              <p className={styles.itemDesc}>{t('softwareNexIndu')}</p>
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>NexKio</h3>
                </div>
                <span className={styles.itemPeriodRight}>2026</span>
              </div>
              <p className={styles.itemDesc}>{t('softwareNexKio')}</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('industrialTitle')}</h2>
            
            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>{t('bbraunRole')}</h3>
                  <span className={styles.itemSubtitle}>B.Braun Medical Argentina</span>
                </div>
                <span className={styles.itemPeriodRight}>{t('bbraunPeriod')}</span>
              </div>
              <p className={styles.itemDesc}>{t('bbraunDesc')}</p>
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeaderFlex}>
                <div>
                  <h3 className={styles.itemTitle}>{t('coironRole')}</h3>
                  <span className={styles.itemSubtitle}>Coiron</span>
                </div>
                <span className={styles.itemPeriodRight}>{t('coironPeriod')}</span>
              </div>
              <p className={styles.itemDesc}>{t('coironDesc')}</p>
            </div>
          </section>
        </main>
      </motion.div>
    </div>
  );
}
