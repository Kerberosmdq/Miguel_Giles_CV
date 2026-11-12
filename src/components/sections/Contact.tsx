'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { sendContactEmail } from '@/actions/contact';
import { LINKEDIN_URL, GITHUB_URL, WHATSAPP_URL, EMAIL, PHONE_DISPLAY } from '@/lib/site';
import shared from './Section.module.css';
import styles from './Contact.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // sin permiso de portapapeles: el email sigue visible y seleccionable
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    const result = await sendContactEmail(new FormData(form));
    if (result.success) {
      form.reset();
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  const message =
    status === 'sending' ? t('formSending') : status === 'success' ? t('formSuccess') : status === 'error' ? t('formError') : '';

  return (
    <section id="contacto" className={shared.section} aria-labelledby="contacto-title">
      <div className="container">
        <SectionLabel>{t('label')}</SectionLabel>
        <div className={styles.grid}>
          <div>
            <div className={styles.who}>
              <Image
                src="/images/miguel-profile.png"
                alt={t('photoAlt')}
                width={72}
                height={72}
                className={styles.photo}
              />
              <h2 id="contacto-title">{t('title')}</h2>
            </div>
            <p className={shared.intro}>{t('lead')}</p>

            <ul className={`mono ${styles.list}`} aria-label={t('listLabel')}>
              <li className={styles.emailRow}>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <button
                  type="button"
                  className={styles.copy}
                  onClick={copyEmail}
                  aria-label={t('copyLabel')}
                >
                  {copied ? t('emailCopied') : t('copyEmail')}
                </button>
              </li>
              <li><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a></li>
              <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WhatsApp</a></li>
              <li>
                <a href={`tel:${PHONE_DISPLAY.replace(/[^+\d]/g, '')}`} aria-label={`${t('phoneLabel')} ${PHONE_DISPLAY}`}>
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">{t('nameLabel')}</label>
              <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">{t('emailLabel')}</label>
              <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
            </div>
            <div className={styles.field}>
              <label htmlFor="message">{t('messageLabel')}</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                maxLength={2000}
                aria-describedby="message-hint"
              />
              <span id="message-hint" className="mono">{t('messageHint')}</span>
            </div>
            <button type="submit" className={styles.submit} disabled={status === 'sending'} aria-busy={status === 'sending'}>
              {t('sendButton')}
            </button>
            <p className={`${styles.status} ${status === 'error' ? styles.error : ''}`} aria-live="polite">
              {message}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
