'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Raw motion values for the dot (instant tracking)
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  // Sprung motion values for the ring (slight lag but very snappy)
  const ringX = useSpring(dotX, { stiffness: 800, damping: 35, mass: 0.1 });
  const ringY = useSpring(dotY, { stiffness: 800, damping: 35, mass: 0.1 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, [data-cursor]');
      if (interactiveEl) {
        setIsHovering(true);
        const text = interactiveEl.getAttribute('data-cursor-text');
        setHoverText(text || '');
      } else {
        setIsHovering(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, dotX, dotY]);

  if (isTouch) return null;

  return (
    <>
      {/* Dot: follows mouse instantly */}
      <motion.div
        className={styles.cursorDot}
        style={{
          x: dotX,
          y: dotY,
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* Ring: follows with subtle spring lag */}
      <motion.div
        className={`${styles.cursorRing} ${isHovering ? styles.hovering : ''}`}
        style={{
          x: ringX,
          y: ringY,
          opacity: isVisible ? 1 : 0,
        }}
      >
        {hoverText && <span className={styles.cursorText}>{hoverText}</span>}
      </motion.div>
    </>
  );
}
