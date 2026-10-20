'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { mainProjects, otherProjects } from '@/data/projects';
import styles from './Projects.module.css';

const NexinduDemo = dynamic(() => import('@/demo/NexinduDemo'), { ssr: false });

// TODO(fase 2): demos de NexKio y NexQuipu (por ahora muestran el logo)
export default function Projects() {
  const t = useTranslations('projects');

  return (
    <section className={`section-dark ${styles.projectsSection}`} id="work">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.list}>
          {mainProjects.map((project, idx) => {
            const bullets = t.raw(`items.${project.id}.bullets`) as string[];
            return (
              <motion.article
                key={project.id}
                className={`${styles.card} ${idx === 0 ? styles.featured : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className={styles.info}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.name}>{project.name}</h3>
                    <span className={styles.badge}>{t(`items.${project.id}.badge`)}</span>
                  </div>
                  <p className={styles.line}>{t(`items.${project.id}.line`)}</p>
                  <ul className={styles.bullets}>
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                  <ul className={styles.chips} aria-label="Stack">
                    {project.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      {t('live')}
                    </a>
                  )}
                </div>
                {project.id === 'nexindu' ? (
                  <div className={styles.demo}>
                    <NexinduDemo />
                  </div>
                ) : (
                  <div className={styles.visual}>
                    <Image
                      src={`/images/Projects/${project.id}.png`}
                      alt={`${project.name} logo`}
                      width={160}
                      height={160}
                      className={styles.logo}
                    />
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>

        <h3 className={styles.otherTitle}>{t('otherTitle')}</h3>
        <div className={styles.otherGrid}>
          {otherProjects.map((p) => (
            <article key={p.id} className={styles.otherCard}>
              <Image
                src={`/images/Projects/${p.id}.png`}
                alt=""
                width={56}
                height={56}
                className={styles.otherLogo}
              />
              <div>
                <h4 className={styles.otherName}>{p.name}</h4>
                <p className={styles.otherLine}>{t(`items.${p.id}.line`)}</p>
                <div className={styles.otherLinks}>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      {t('live')}
                    </a>
                  )}
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    {t('code')}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
