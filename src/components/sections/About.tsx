'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, type Variants } from 'framer-motion';
import styles from './About.module.css';

// 1. Mechanic Visual - SCADA PLC Dashboard
const MechanicVisual = () => (
  <div className={styles.visualDark}>
    <div className={styles.scadaDashboard}>
      <div className={styles.scadaHeader}>PLC_MONITOR_01</div>
      <div className={styles.scadaGrid}>
        <div className={styles.scadaGauge}>
           <svg viewBox="0 0 36 36" className={styles.circularChart}>
             <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
             <motion.path 
               className={styles.circle} 
               animate={{ strokeDasharray: ["0, 100", "85, 100", "45, 100", "75, 100"] }}
               transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
             />
           </svg>
           <div className={styles.scadaLabel}>TEMP</div>
        </div>
        <div className={styles.scadaBars}>
           <motion.div className={styles.bar} animate={{ height: ['40%', '90%', '60%'] }} transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut" }} />
           <motion.div className={styles.bar} animate={{ height: ['80%', '30%', '85%'] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} />
           <motion.div className={styles.bar} animate={{ height: ['50%', '100%', '30%'] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
           <motion.div className={styles.bar} animate={{ height: ['90%', '50%', '95%'] }} transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }} />
        </div>
      </div>
      <div className={styles.scadaStatus}>
        <span className={styles.pulseDot}></span> SYS_RUNNING
      </div>
    </div>
  </div>
);

// 2. Spark Visual - Data Stream / Circuit
const SparkVisual = () => (
  <div className={styles.visualDark}>
    <div className={styles.circuitContainer}>
      <svg className={styles.circuitLines} viewBox="0 0 100 100" preserveAspectRatio="none">
         <motion.path 
           d="M0 50 L40 50 L50 20 L70 20 L100 20" 
           stroke="var(--accent)" strokeWidth="1" fill="none"
           initial={{ pathLength: 0 }}
           whileInView={{ pathLength: 1 }}
           transition={{ duration: 2, ease: "easeInOut" }}
         />
         <motion.path 
           d="M0 70 L30 70 L40 90 L80 90 L100 90" 
           stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1" fill="none"
           initial={{ pathLength: 0 }}
           whileInView={{ pathLength: 1 }}
           transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
         />
      </svg>
      <motion.div 
        className={styles.floatingNode}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        VIBE_CODING_SYNC
      </motion.div>
    </div>
  </div>
);

// 3. Builder Visual - Code Terminal
const BuilderVisual = () => {
  const [text, setText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const fullText = `const Miguel: Developer = {
  stack: ["Next.js", "React", "Python"],
  focus: "Industrial GxP Systems",
  status: "Building NexIndu..."
};`;

  useEffect(() => {
    if (!isInView) return;
    
    let i = 0;
    setText(''); // Reset text when it comes into view
    
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [isInView, fullText]);

  return (
    <div ref={ref} className={styles.visualTerminal}>
      <div className={styles.termHeader}>
        <span className={styles.macBtn} style={{background: '#ff5f56'}}></span>
        <span className={styles.macBtn} style={{background: '#ffbd2e'}}></span>
        <span className={styles.macBtn} style={{background: '#27c93f'}}></span>
      </div>
      <pre className={styles.termCode}>
        <code>{text}<span className={styles.cursor}>|</span></code>
      </pre>
    </div>
  );
};

export default function About() {
  const t = useTranslations('about');

  const chapters = [
    {
      id: 'mechanic',
      visual: <MechanicVisual />,
    },
    {
      id: 'spark',
      visual: <SparkVisual />,
    },
    {
      id: 'builder',
      visual: <BuilderVisual />,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    },
  };

  return (
    <section id="about" className={`section-light ${styles.aboutSection}`}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{t('title')}</h2>
        </motion.div>

        <div className={styles.chapters}>
          {chapters.map((chapter, index) => {
            return (
              <motion.div 
                key={chapter.id}
                className={styles.chapter}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
              >
                <motion.div className={styles.content} variants={itemVariants}>
                  <div className={styles.chapterHeader}>
                    <span className={styles.chapterNumber}>
                      0{index + 1}
                    </span>
                    <h3 className={styles.chapterTitle}>
                      {t(`chapters.${chapter.id}.title`)}
                    </h3>
                  </div>
                  <p className={styles.chapterDescription}>
                    {t(`chapters.${chapter.id}.description`)}
                  </p>
                </motion.div>

                <motion.div className={styles.visualContainer} variants={itemVariants}>
                  {chapter.visual}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
