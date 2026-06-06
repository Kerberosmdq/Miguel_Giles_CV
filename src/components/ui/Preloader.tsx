'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preloader.module.css';

const LETTERS_FIRST = 'MIGUEL'.split('');
const LETTERS_LAST = 'GILES'.split('');

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedBefore');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (hasVisited || prefersReducedMotion) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasVisitedBefore', 'true');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.preloader}
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.1 }}
        >
          <div className={styles.content}>
            {/* Logo SVG Draw */}
            <motion.div className={styles.logoContainer}>
              <svg viewBox="0 0 100 100" width="60" height="60" className={styles.logoSvg}>
                <motion.path 
                  d="M20 80 L50 20 L80 80 M50 20 L50 80" 
                  stroke="var(--accent)" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
            
            {/* Staggered Letter Reveal */}
            <div className={styles.nameRow}>
              <div className={styles.wordGroup}>
                {LETTERS_FIRST.map((letter, i) => (
                  <span key={`first-${i}`} className={styles.letterMask}>
                    <motion.span
                      className={styles.letter}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                      }}
                    >
                      {letter}
                    </motion.span>
                  </span>
                ))}
              </div>
              <div className={styles.wordGroup}>
                {LETTERS_LAST.map((letter, i) => (
                  <span key={`last-${i}`} className={styles.letterMask}>
                    <motion.span
                      className={styles.letter}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.7 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                      }}
                    >
                      {letter}
                    </motion.span>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Progress bar */}
            <motion.div 
              className={styles.progressBar}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.2, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
