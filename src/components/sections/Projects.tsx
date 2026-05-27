'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Projects.module.css';

const projectsList = [
  { id: 'nexindu', name: 'NexIndu', url: 'https://www.nexindu.com.ar', status: 'live' },
  { id: 'nexkio', name: 'NexKio', status: 'coming_soon' },
  { id: 'nexquipu', name: 'NexQuipu', status: 'coming_soon' },
  { id: 'nexwod', name: 'NexWod', status: 'coming_soon' },
  { id: 'nexpulse', name: 'NexPulse', status: 'coming_soon' },
  { id: 'nexgrid', name: 'NexGrid', status: 'coming_soon' },
];

const logoScales: Record<string, number> = {
  nexindu: 1.0,
  nexkio: 1.25,   // 125%
  nexquipu: 0.85,
  nexwod: 1.0,
  nexpulse: 0.8,
  nexgrid: 1.0,
};

export default function Projects() {
  const t = useTranslations('projects');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className={styles.projectsSection} id="work">
      <div className={styles.container}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={styles.header}
        >
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projectsList.map((project) => {
            const isLive = project.status === 'live';
            
            return (
              <motion.div
                key={project.id}
                className={styles.card}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.titleGroup}>
                    <div className={styles.logoWrapper}>
                      <Image 
                        src={`/images/Projects/${project.id}.png`} 
                        alt={`${project.name} Logo`}
                        width={72}
                        height={72}
                        className={styles.projectLogoImg}
                        style={{ transform: `scale(${logoScales[project.id] || 1})` }}
                      />
                    </div>
                    <h3 className={styles.cardTitle}>{project.name}</h3>
                  </div>
                  <span className={styles.badge}>{t(`items.${project.id}.badge`)}</span>
                </div>
                <p className={styles.description}>{t(`items.${project.id}.description`)}</p>
                <div className={styles.cta}>
                  {isLive ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {t('viewProject')}
                      <span className={styles.arrow}>→</span>
                    </a>
                  ) : (
                    <span className={styles.linkDisabled}>
                      {t('comingSoon')}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
