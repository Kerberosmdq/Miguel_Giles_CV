'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './TechStack.module.css';

export default function TechStack() {
  const t = useTranslations('stack');

  const categories = [
    { key: 'languages', items: ['TypeScript', 'JavaScript', 'Python', 'HTML/CSS'] },
    { key: 'frameworks', items: ['Next.js', 'React', 'Node.js', 'Framer Motion'] },
    { key: 'databases', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase'] },
    { key: 'ai', items: ['OpenAI API', 'LangChain', 'Hugging Face'] },
    { key: 'tools', items: ['Git', 'Docker', 'Figma', 'VS Code'] }
  ];

  return (
    <section id="stack" className={`section-dark ${styles.techStackSection}`}>
      <div className={styles.container}>
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('title')}
        </motion.h2>

        <div className={styles.grid}>
          {categories.map((category, idx) => (
            <motion.div 
              key={category.key}
              className={styles.categoryCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className={styles.categoryTitle}>{t(`categories.${category.key}`)}</h3>
              <div className={styles.badges}>
                {category.items.map((item, itemIdx) => (
                  <motion.span 
                    key={item}
                    className={styles.badge}
                    whileHover={{ scale: 1.05, borderColor: '#00E5FF' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + itemIdx * 0.05 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
