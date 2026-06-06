'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styles from './About.module.css';

// 1. Mechanic Visual - RAW SCADA
const MechanicVisual = () => (
  <div className={styles.scadaContainer}>
    <div className={styles.scadaHeader}>
      <span>SYS_TELEMETRY</span>
      <span className={styles.scadaBlink}>[ REC ]</span>
    </div>
    <div className={styles.scadaGrid}>
      <div className={styles.scadaBox}>
        <div className={styles.scadaLabel}>PRSS_01 // BAR</div>
        <div className={styles.scadaValue}>124.05</div>
      </div>
      <div className={styles.scadaBox}>
        <div className={styles.scadaLabel}>TEMP_CORE // °C</div>
        <div className={styles.scadaValue}>-18.4</div>
      </div>
      <div className={styles.scadaBoxLarge}>
        <div className={styles.scadaLabel}>SYSTEM_STATE</div>
        <div className={styles.scadaGridLines}>
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i}
              className={styles.scadaBar}
              animate={{ height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
              transition={{ repeat: Infinity, duration: 0.5 + Math.random(), repeatType: "mirror" }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 2. Spark Visual - RAW CIRCUIT
const SparkVisual = () => (
  <div className={styles.circuitContainer}>
    <svg width="100%" height="100%" viewBox="0 0 400 400" className={styles.circuitSvg}>
      <motion.path 
        d="M 50 350 L 50 200 L 150 100 L 250 100 L 350 200 L 350 50"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
      />
      <motion.path 
        d="M 100 350 L 100 250 L 200 150 L 300 150 L 300 350"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      />
      {/* Nodes */}
      <circle cx="50" cy="350" r="4" fill="var(--accent)" />
      <circle cx="150" cy="100" r="4" fill="var(--accent)" />
      <circle cx="250" cy="100" r="4" fill="var(--accent)" />
      <circle cx="350" cy="50" r="4" fill="var(--accent)" />
      
      <circle cx="100" cy="350" r="3" fill="#ffffff" />
      <circle cx="200" cy="150" r="3" fill="#ffffff" />
      <circle cx="300" cy="150" r="3" fill="#ffffff" />
    </svg>
    <div className={styles.circuitLabel}>LOGIC_GATE // ROUTING</div>
  </div>
);

// 3. Builder Visual - PURE TERMINAL
const BuilderVisual = () => {
  const codeText = `> INIT SYSTEM...
> LOADING MODULES... [OK]
> COMPILING LOGIC... [OK]

class Engineer {
  constructor() {
    this.skills = ["Mecánica", "Código"];
    this.focus = "Sistemas Reales";
  }

  build() {
    return System.deploy();
  }
}

> DEPLOYMENT SUCCESSFUL.`;

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.termHeader}>
        <span>root@nex-os:~</span>
      </div>
      <div className={styles.termBody}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {codeText.split('\n').map((line, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={styles.termLine}
            >
              {line}
            </motion.div>
          ))}
          <motion.div 
            className={styles.termCursor}
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            _
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default function About() {
  const t = useTranslations('about');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest < 0.33) setActiveIndex(0);
      else if (latest >= 0.33 && latest < 0.66) setActiveIndex(1);
      else setActiveIndex(2);
    });
  }, [scrollYProgress]);

  const chapters = [
    { id: 'mechanic', visual: <MechanicVisual /> },
    { id: 'spark', visual: <SparkVisual /> },
    { id: 'builder', visual: <BuilderVisual /> },
  ];

  return (
    <section id="about" ref={containerRef} className={styles.aboutSection}>
      <div className={styles.stickyContainer}>
        
        {/* Left Side: Text Storytelling */}
        <div className={styles.textContent}>
          <div className={styles.textInner}>
            {chapters.map((chapter, index) => {
              // Calculate opacity based on scroll for smooth fading
              const start = index * 0.33;
              const end = (index + 1) * 0.33;
              const center = (start + end) / 2;
              
              // We use simple CSS opacity toggled by activeIndex to keep it sharp and industrial,
              // or smooth via motion. Since we want "corte duro / industrial", a sharp transition fits better.
              const isActive = activeIndex === index;

              return (
                <div 
                  key={chapter.id} 
                  className={`${styles.chapterText} ${isActive ? styles.chapterActive : ''}`}
                >
                  <span className={styles.eyebrow}>[ PHASE 0{index + 1} ]</span>
                  <h2 className={styles.title}>{t(`chapters.${chapter.id}.title`)}</h2>
                  <p className={styles.description}>{t(`chapters.${chapter.id}.description`)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Raw Visuals */}
        <div className={styles.visualContent}>
          <div className={styles.visualFrame}>
            {/* Corner decorations for industrial feel */}
            <div className={styles.cornerTL}></div>
            <div className={styles.cornerTR}></div>
            <div className={styles.cornerBL}></div>
            <div className={styles.cornerBR}></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={styles.visualInner}
              >
                {chapters[activeIndex].visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
