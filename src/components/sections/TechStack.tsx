'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionTransition } from '../ui/SectionTransition';
import styles from './TechStack.module.css';

// Using actual SVGs for key technologies (inline for performance and reliability)
const icons = {
  nextjs: <svg viewBox="0 0 128 128" width="18" height="18"><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h9.6l50.5 64.6c13.5-10.4 22.2-26.6 22.2-44.4 0-35.3-28.7-64-64-64zm29.8 89.2L51.3 49.5h6.8v37.4l35.7 2.3z"/></svg>,
  react: <svg viewBox="-11.5 -10.23174 23 20.46348" width="18" height="18"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>,
  typescript: <svg viewBox="0 0 128 128" width="18" height="18"><path fill="#3178C6" d="M2.7 64C2.7 30.2 30.2 2.7 64 2.7S125.3 30.2 125.3 64 97.8 125.3 64 125.3 2.7 97.8 2.7 64zm64.4 29.5c16.3 0 25.1-6.8 25.1-18.4 0-11-8.5-15.6-19.8-19.4-9.3-3.1-11.8-5.3-11.8-9 0-3.6 3.1-6.4 8.7-6.4 6 0 10.8 2.5 14.3 7.5l9.2-8.3c-5.1-6.9-13-11-23.4-11-14.8 0-23.9 8.2-23.9 18.2 0 10.5 7.6 15 19.4 19 9.6 3.2 12.3 5.9 12.3 9.7 0 3.8-3.4 6.7-9.3 6.7-7.7 0-13.6-3.8-17.6-9.6L41 81.3c5.5 8 14.9 12.2 26.1 12.2zM33 46.1h20v46.1h12V46.1h20v-11H33v11z"/></svg>,
  supabase: <svg viewBox="0 0 128 128" width="18" height="18"><path fill="#3ECF8E" d="M69.6 126.8c-3.1 1.7-6.9-.5-6.9-4V76.4h42.1c5.5 0 8.5-6.4 5-10.6L44.5 1.5C42.2-1.2 38 1 38 4.7v46.9H13c-5.5 0-8.5 6.4-5 10.6l61.6 64.6z"/></svg>,
  tailwind: <svg viewBox="0 0 128 128" width="18" height="18"><path fill="#06B6D4" d="M31.4 60.1c11.6 0 17.6-5.8 18-17.4-6 5.8-11.8 7.3-17.4 4.4-2.8-1.5-4.8-4-9-8.4C17.3 32.7 10.7 26.6 0 26.6c-11.6 0-17.6 5.8-18 17.4 6-5.8 11.8-7.3 17.4-4.4 2.8 1.5 4.8 4 9 8.4 5.7 6.1 12.3 12.1 23 12.1zm29.8 41.3c11.6 0 17.6-5.8 18-17.4-6 5.8-11.8 7.3-17.4 4.4-2.8-1.5-4.8-4-9-8.4-5.7-6.1-12.3-12.1-23-12.1-11.6 0-17.6 5.8-18 17.4 6-5.8 11.8-7.3 17.4-4.4 2.8 1.5 4.8 4 9 8.4 5.7 6.1 12.3 12.1 23 12.1z" transform="translate(33)"/></svg>,
  git: <svg viewBox="0 0 128 128" width="18" height="18"><path fill="#F1502F" d="M125.4 54.4 73.6 2.6c-3.5-3.5-9.1-3.5-12.5 0L49 14.7 64.9 30.6c3.2-1 6.8-.1 9.2 2.3 2.5 2.5 3.5 6.2 2.3 9.4L89 54.9c3.2-1 6.8-.1 9.3 2.4 3.7 3.7 3.7 9.8 0 13.5-3.7 3.7-9.8 3.7-13.5 0-2.4-2.4-3.4-5.9-2.4-9.1l-11.4-11.4v21.5c1 3.2 0 6.9-2.4 9.3-3.7 3.7-9.8 3.7-13.5 0-3.7-3.7-3.7-9.8 0-13.5 2.6-2.6 6.3-3.5 9.6-2.3V44.9c-3.2-1.1-6.9-.2-9.5 2.4-3.7 3.7-3.7 9.8 0 13.5 1.5 1.5 3.3 2.4 5.2 2.8L22.2 73.8 2.6 54.2c-3.5-3.5-3.5-9.1 0-12.5l51.8-51.8z"/></svg>,
};

type Chip = { name: string; icon?: keyof typeof icons };

const cards: { id: 'frontend' | 'backend' | 'quality' | 'ai'; chips: Chip[] }[] = [
  {
    id: 'frontend',
    chips: [
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'React', icon: 'react' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'Framer Motion' },
    ],
  },
  {
    id: 'backend',
    chips: [
      { name: 'Supabase', icon: 'supabase' },
      { name: 'PostgreSQL' },
      { name: 'Auth' },
      { name: 'Realtime' },
      { name: 'Zod' },
      { name: 'React Hook Form' },
      { name: 'Resend' },
    ],
  },
  {
    id: 'quality',
    chips: [
      { name: 'Playwright' },
      { name: 'Vitest' },
      { name: 'GitHub Actions' },
      { name: 'CodeQL' },
      { name: 'OWASP ZAP' },
      { name: 'Vercel' },
      { name: 'Git', icon: 'git' },
    ],
  },
  {
    id: 'ai',
    chips: [
      { name: 'Gemini API' },
      { name: 'RAG' },
      { name: 'Embeddings' },
    ],
  },
];

export default function TechStack() {
  const t = useTranslations('stack');
  const industryItems = t.raw('industryItems') as string[];
  const all = [
    ...cards.map((c) => ({ id: c.id, chips: c.chips })),
    { id: 'industry' as const, chips: industryItems.map((name) => ({ name }) as Chip) },
  ];

  return (
    <SectionTransition type="lightToDark">
      <section className={`section-dark ${styles.stackSection}`} id="stack">
        <div className="container">
          <div className={styles.header}>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>

          <div className={styles.grid}>
            {all.map((card, index) => (
              <motion.div
                key={card.id}
                className={styles.card}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
              >
                <h3 className={styles.cardTitle}>{t(`cards.${card.id}`)}</h3>
                <ul className={styles.chips}>
                  {card.chips.map((chip) => (
                    <li key={chip.name} className={styles.chip}>
                      {chip.icon && <span className={styles.chipIcon} aria-hidden="true">{icons[chip.icon]}</span>}
                      {chip.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}
