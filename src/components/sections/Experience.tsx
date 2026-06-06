'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { SectionTransition } from '../ui/SectionTransition';
import styles from './Experience.module.css';

export default function Experience() {
  const t = useTranslations('experience');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Animate the vertical line drawing down
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // Animate the bridge line drawing across
  const bridgeScaleX = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

  return (
    <SectionTransition type="darkToLight">
      <section className={`section-light ${styles.experienceSection}`} id="experience" ref={containerRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={styles.header}
          >
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </motion.div>

          <div className={styles.dualTracksContainer}>
            {/* The animated track lines */}
            <motion.div className={styles.centerLine} style={isMounted ? { scaleY: lineScaleY } : { scaleY: 0 }} />
            
            {/* Industrial Track (Left) */}
            <div className={styles.track}>
              <h3 className={styles.trackTitle}>{t('industrial.title')}</h3>
              
              <div className={styles.timeline}>
                {/* 2013-2017: Coiron */}
                <motion.div 
                  className={styles.entryLeft}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className={styles.node} />
                  <div className={styles.yearLabel}>2013</div>
                  <div className={styles.card}>
                    <div className={styles.companyHeader}>
                      <div className={styles.companyLogo}>C</div>
                      <h4 className={styles.role}>{t('industrial.coiron.role')}</h4>
                    </div>
                    <p className={styles.period}>{t('industrial.coiron.period')}</p>
                    <p className={styles.description}>{t('industrial.coiron.description')}</p>
                  </div>
                </motion.div>

                {/* 2017-Present: B.Braun */}
                <motion.div 
                  className={styles.entryLeft}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ marginTop: 'var(--space-16)' }}
                >
                  <div className={styles.node} />
                  <div className={styles.yearLabel}>2017</div>
                  <div className={styles.card}>
                    <div className={styles.companyHeader}>
                      <div className={`${styles.companyLogo} ${styles.logoBbraun}`}>B</div>
                      <h4 className={styles.role}>{t('industrial.bbraun.role')}</h4>
                    </div>
                    <p className={styles.period}>{t('industrial.bbraun.period')}</p>
                    <p className={styles.description}>{t('industrial.bbraun.description')}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* The Pivot Bridge */}
            <div className={styles.bridgeContainer}>
              <motion.div className={styles.bridgeLine} style={isMounted ? { scaleX: bridgeScaleX } : { scaleX: 0 }} />
              <motion.div 
                className={styles.pivotPoint}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-200px" }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                2023
              </motion.div>
            </div>

            {/* Developer Track (Right) */}
            <div className={styles.track}>
              <h3 className={styles.trackTitle}>{t('developer.title')}</h3>
              
              <div className={styles.timeline}>
                {/* 2023-Present: NEX Apps */}
                <motion.div 
                  className={styles.entryRight}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ marginTop: 'calc(var(--space-32) * 2)' }} // Offset to align below the bridge
                >
                  <div className={styles.node} />
                  <div className={styles.yearLabel}>2023</div>
                  <div className={styles.card}>
                    <div className={styles.companyHeader}>
                      <div className={`${styles.companyLogo} ${styles.logoNex}`}>N</div>
                      <h4 className={styles.role}>{t('developer.recent.role')}</h4>
                    </div>
                    <p className={styles.period}>{t('developer.recent.period')} | {t('developer.recent.company')}</p>
                    <p className={styles.description}>{t('developer.recent.description')}</p>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </SectionTransition>
  );
}
