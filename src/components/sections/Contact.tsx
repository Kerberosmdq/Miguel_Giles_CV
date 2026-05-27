'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useTransition, useState, useRef } from 'react';
import { sendContactEmail } from '@/actions/contact';
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';
import styles from './Contact.module.css';

export default function Contact() {
  const t = useTranslations('contact');
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit: NonNullable<React.ComponentProps<'form'>['onSubmit']> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await sendContactEmail(formData);
      setStatus(result.success ? 'success' : 'error');
      if (result.success) formRef.current?.reset();
    });
  };

  return (
    <section id="contact" className={styles.sectionLight}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </motion.div>

        <div className={styles.content}>
          <motion.form
            ref={formRef}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>{t('nameLabel')}</label>
              <input type="text" id="name" name="name" className={styles.input} placeholder={t('namePlaceholder')} required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>{t('emailLabel')}</label>
              <input type="email" id="email" name="email" className={styles.input} placeholder={t('emailPlaceholder')} required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>{t('messageLabel')}</label>
              <textarea id="message" name="message" className={styles.textarea} placeholder={t('messagePlaceholder')} required rows={5} />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isPending || status === 'success'}>
              {isPending ? t('formSending') : t('sendButton')}
            </button>

            {status === 'success' && (
              <p className={`${styles.statusMessage} ${styles.successMessage}`}>
                {t('formSuccess')}
              </p>
            )}
            {status === 'error' && (
              <p className={`${styles.statusMessage} ${styles.errorMessage}`}>
                {t('formError')}
              </p>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.links}
          >
            <h3>{t('connectTitle')}</h3>

            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/miguel-giles/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.linkedinLink}`}
              >
                <FaLinkedin size={20} aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href="https://github.com/kerberosmdq"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.githubLink}`}
              >
                <FaGithub size={20} aria-hidden="true" />
                GitHub
              </a>
              <a
                href="https://wa.me/5492234556968"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.whatsappLink}`}
              >
                <FaWhatsapp size={20} aria-hidden="true" />
                {t('whatsapp')}
              </a>
            </div>

            <p>{t('connectText')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
