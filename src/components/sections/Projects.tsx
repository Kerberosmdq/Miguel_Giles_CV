'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Projects.module.css';

const projects = [
  { 
    id: 'nexindu', 
    name: 'NexIndu', 
    hasLink: true,
    link: 'https://www.nexindu.com.ar',
  },
  { id: 'nexkio', name: 'NexKio', hasLink: false },
  { id: 'nexquipu', name: 'NexQuipu', hasLink: false },
  { id: 'nexwod', name: 'NexWod', hasLink: false },
  { id: 'nexpulse', name: 'NexPulse', hasLink: false },
  { id: 'nexgrid', name: 'NexGrid', hasLink: false },
];

export default function Projects() {
  const t = useTranslations('projects');
  const targetRef = useRef<HTMLDivElement>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Shift horizontal scroll depending on the number of projects.
  // 6 projects. Calculate exactly how far to move to reach the end.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

  return (
    <section className={styles.projectsSection} id="work" ref={targetRef}>
      <div className={styles.stickyContainer}>
        
        {/* Header stays pinned but fades slightly based on scroll if desired, or just sits on top */}
        <div className={styles.header}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <h2 className={styles.title}>{t('title')}</h2>
              <p className={styles.subtitle}>{t('subtitle')}</p>
            </motion.div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className={styles.scrollWrapper}>
          <motion.div 
            className={styles.horizontalTrack}
            style={isMounted ? { x: isMobile ? 0 : x } : { x: 0 }}
          >
            {projects.map((project, idx) => (
              <div key={project.id} className={styles.cardContainer}>
                <div className={styles.projectCard}>
                  
                  {/* Left Info Column */}
                  <div className={styles.projectInfo}>
                    <div className={styles.projectHeader}>
                      <h3 className={styles.projectName}>{project.name}</h3>
                      <span className={styles.projectBadge}>
                        {t(`items.${project.id}.badge`)}
                      </span>
                    </div>
                    
                    <p className={styles.projectDescription}>
                      {t(`items.${project.id}.description`)}
                    </p>
                    
                    <div className={styles.projectActions}>
                      {project.hasLink ? (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary"
                          data-cursor-text="VISIT"
                        >
                          {t('viewProject')}
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      ) : (
                        <span className={styles.comingSoon}>{t('comingSoon')}</span>
                      )}
                    </div>
                  </div>

                  {/* Right Visual Column */}
                  <div className={styles.projectVisual}>
                    <div className={styles.logoWrapper}>
                      <Image 
                        src={`/images/Projects/${project.id}.png`} 
                        alt={`${project.name} Logo`}
                        width={200}
                        height={200}
                        className={styles.projectLogo}
                      />
                    </div>
                    {/* Decorative glow matching the logo */}
                    <div className={styles.visualGlow} />
                  </div>

                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
