'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionTransition } from '../ui/SectionTransition';
import styles from './TechStack.module.css';

// Using actual SVGs for key technologies (inline for performance and reliability)
const icons = {
  nextjs: <svg viewBox="0 0 128 128" width="32" height="32"><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h9.6l50.5 64.6c13.5-10.4 22.2-26.6 22.2-44.4 0-35.3-28.7-64-64-64zm29.8 89.2L51.3 49.5h6.8v37.4l35.7 2.3z"/></svg>,
  react: <svg viewBox="-11.5 -10.23174 23 20.46348" width="32" height="32"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>,
  typescript: <svg viewBox="0 0 128 128" width="32" height="32"><path fill="#3178C6" d="M2.7 64C2.7 30.2 30.2 2.7 64 2.7S125.3 30.2 125.3 64 97.8 125.3 64 125.3 2.7 97.8 2.7 64zm64.4 29.5c16.3 0 25.1-6.8 25.1-18.4 0-11-8.5-15.6-19.8-19.4-9.3-3.1-11.8-5.3-11.8-9 0-3.6 3.1-6.4 8.7-6.4 6 0 10.8 2.5 14.3 7.5l9.2-8.3c-5.1-6.9-13-11-23.4-11-14.8 0-23.9 8.2-23.9 18.2 0 10.5 7.6 15 19.4 19 9.6 3.2 12.3 5.9 12.3 9.7 0 3.8-3.4 6.7-9.3 6.7-7.7 0-13.6-3.8-17.6-9.6L41 81.3c5.5 8 14.9 12.2 26.1 12.2zM33 46.1h20v46.1h12V46.1h20v-11H33v11z"/></svg>,
  python: <svg viewBox="0 0 128 128" width="32" height="32"><path fill="#3776AB" d="M64.6 4.7C31.5 4.7 33.1 19 33.1 19v15h32.1v4.4H28.7C10.5 38.4 9 52.8 9 52.8s-1.8 17.5 16.1 18.2h10v-15s0-16.8 16.8-16.8h29.2s16.1 0 16.1-15.7V22.4s1.1-17.7-32.6-17.7zM45.5 15.6c2.9 0 5.1 2.3 5.1 5.1 0 2.9-2.3 5.1-5.1 5.1-2.9 0-5.1-2.3-5.1-5.1.1-2.9 2.3-5.1 5.1-5.1z"/><path fill="#FFD43B" d="M63.4 123.3c33.1 0 31.5-14.3 31.5-14.3v-15H62.8v-4.4h36.5c18.2 0 19.7-14.4 19.7-14.4s1.8-17.5-16.1-18.2h-10v15s0 16.8-16.8 16.8H46.9s-16.1 0-16.1 15.7v16.1s-1.1 17.7 32.6 17.7zM82.5 112.4c-2.9 0-5.1-2.3-5.1-5.1 0-2.9 2.3-5.1 5.1-5.1 2.9 0 5.1 2.3 5.1 5.1 0 2.9-2.3 5.1-5.1 5.1z"/></svg>,
  supabase: <svg viewBox="0 0 128 128" width="32" height="32"><path fill="#3ECF8E" d="M69.6 126.8c-3.1 1.7-6.9-.5-6.9-4V76.4h42.1c5.5 0 8.5-6.4 5-10.6L44.5 1.5C42.2-1.2 38 1 38 4.7v46.9H13c-5.5 0-8.5 6.4-5 10.6l61.6 64.6z"/></svg>,
  tailwind: <svg viewBox="0 0 128 128" width="32" height="32"><path fill="#06B6D4" d="M31.4 60.1c11.6 0 17.6-5.8 18-17.4-6 5.8-11.8 7.3-17.4 4.4-2.8-1.5-4.8-4-9-8.4C17.3 32.7 10.7 26.6 0 26.6c-11.6 0-17.6 5.8-18 17.4 6-5.8 11.8-7.3 17.4-4.4 2.8 1.5 4.8 4 9 8.4 5.7 6.1 12.3 12.1 23 12.1zm29.8 41.3c11.6 0 17.6-5.8 18-17.4-6 5.8-11.8 7.3-17.4 4.4-2.8-1.5-4.8-4-9-8.4-5.7-6.1-12.3-12.1-23-12.1-11.6 0-17.6 5.8-18 17.4 6-5.8 11.8-7.3 17.4-4.4 2.8 1.5 4.8 4 9 8.4 5.7 6.1 12.3 12.1 23 12.1z" transform="translate(33)"/></svg>,
  firebase: <svg viewBox="0 0 24 24" width="32" height="32"><path fill="#FFCA28" d="M16.14 2.5a.6.6 0 0 0-1.07.03l-4.76 8.92z"/><path fill="#FFA000" d="m10.32 11.45-3.3-6.2A.6.6 0 0 0 5.94 5L2.01 19.38z"/><path fill="#F57C00" d="M16.14 2.5a.6.6 0 0 0-1.07.03l-4.76 8.92 6.57 6.57L21.72 4.1a.6.6 0 0 0-.75-.72z"/><path fill="#FFCA28" d="m2.01 19.38 9.25 5.16a1.18 1.18 0 0 0 1.14 0l9.31-5.16-4.83-15.28z"/></svg>,
  git: <svg viewBox="0 0 128 128" width="32" height="32"><path fill="#F1502F" d="M125.4 54.4 73.6 2.6c-3.5-3.5-9.1-3.5-12.5 0L49 14.7 64.9 30.6c3.2-1 6.8-.1 9.2 2.3 2.5 2.5 3.5 6.2 2.3 9.4L89 54.9c3.2-1 6.8-.1 9.3 2.4 3.7 3.7 3.7 9.8 0 13.5-3.7 3.7-9.8 3.7-13.5 0-2.4-2.4-3.4-5.9-2.4-9.1l-11.4-11.4v21.5c1 3.2 0 6.9-2.4 9.3-3.7 3.7-9.8 3.7-13.5 0-3.7-3.7-3.7-9.8 0-13.5 2.6-2.6 6.3-3.5 9.6-2.3V44.9c-3.2-1.1-6.9-.2-9.5 2.4-3.7 3.7-3.7 9.8 0 13.5 1.5 1.5 3.3 2.4 5.2 2.8L22.2 73.8 2.6 54.2c-3.5-3.5-3.5-9.1 0-12.5l51.8-51.8z"/></svg>,
  sql: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7v10c0 1.66 3.58 3 8 3s8-1.34 8-3V7"/><path d="M12 10c4.42 0 8-1.34 8-3s-3.58-3-8-3-8 1.34-8 3 3.58 3 8 3z"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>,
  nosql: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8v8M16 8v8M8 12h8"/></svg>,
  i18n: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M11 9H9M11 13H9M15 9h-2M15 13h-2M13 11h2"/></svg>,
};

export default function TechStack() {
  const t = useTranslations('stack');

  // Expanded Bento grid layout
  const cells = [
    { id: 'next', name: 'Next.js', icon: icons.nextjs, size: 'large', color: '#fff' },
    { id: 'react', name: 'React', icon: icons.react, size: 'medium', color: '#61dafb' },
    { id: 'ts', name: 'TypeScript', icon: icons.typescript, size: 'small', color: '#3178C6' },
    { id: 'python', name: 'Python', icon: icons.python, size: 'small', color: '#FFD43B' },
    { id: 'firebase', name: 'Firebase', icon: icons.firebase, size: 'medium', color: '#FFCA28' },
    { id: 'sql', name: 'SQL', icon: icons.sql, size: 'small', color: '#4DB6AC' },
    { id: 'nosql', name: 'NoSQL', icon: icons.nosql, size: 'small', color: '#4DB6AC' },
    { id: 'git', name: 'Git', icon: icons.git, size: 'small', color: '#F1502F' },
    { id: 'i18n', name: 'i18n', icon: icons.i18n, size: 'small', color: '#ba68c8' },
    { id: 'supabase', name: 'Supabase', icon: icons.supabase, size: 'medium', color: '#3ECF8E' },
    { id: 'tailwind', name: 'Tailwind CSS', icon: icons.tailwind, size: 'medium', color: '#06B6D4' },
  ];

  return (
    <SectionTransition type="lightToDark">
      <section className={`section-dark ${styles.stackSection}`} id="stack">
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

          <div className={styles.bentoContainer}>
            {/* Orbital background connections */}
            <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 20 20 Q 50 10 80 20 T 80 80 Q 50 90 20 80 T 20 20" className={styles.connectionPath} />
              <path d="M 10 50 Q 50 90 90 50 T 10 50" className={styles.connectionPath} style={{ animationDelay: '-5s' }} />
            </svg>

            <div className={styles.grid}>
              {cells.map((cell, index) => (
                <motion.div
                  key={cell.id}
                  className={`${styles.cell} ${styles[cell.size]}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }}
                  style={{ '--hover-color': cell.color } as React.CSSProperties}
                >
                  <div className={styles.cellContent}>
                    <div className={styles.iconContainer} style={{ color: cell.color }}>
                      {cell.icon}
                    </div>
                    <span className={styles.cellName}>{cell.name}</span>
                  </div>
                  <div className={styles.glowEffect} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}
