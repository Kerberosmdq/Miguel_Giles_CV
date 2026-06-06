'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './SectionTransition.module.css';

interface SectionTransitionProps {
  type: 'darkToLight' | 'lightToDark';
  children: React.ReactNode;
}

export function SectionTransition({ type, children }: SectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // For darkToLight: The dark section peels away diagonally to reveal the light section
  const clipPathDarkToLight = useTransform(
    scrollYProgress,
    [0.3, 0.7],
    ['polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 100%)']
  );

  // For lightToDark: The light section scales down slightly and fades into dark
  const scaleLightToDark = useTransform(scrollYProgress, [0.3, 0.7], [1, 0.95]);
  const opacityLightToDark = useTransform(scrollYProgress, [0.4, 0.8], [1, 0]);

  if (type === 'darkToLight') {
    return (
      <div ref={containerRef} className={styles.transitionContainer}>
        {/* The underlying light section that gets revealed */}
        <div className={styles.underlyingSection}>
          {children}
        </div>
        
        {/* The overlaying dark section that peels away - we'll need to pass the dark content as a prop in a real implementation, 
            but for now we'll rely on the parent components to use this wrapper correctly */}
      </div>
    );
  }

  // Light to Dark
  return (
    <motion.div 
      ref={containerRef}
      style={isMounted ? { scale: scaleLightToDark, opacity: opacityLightToDark } : { scale: 1, opacity: 1 }}
      className={styles.transitionWrapper}
    >
      {children}
    </motion.div>
  );
}
