'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CV.module.css';
import { SITE_URL, EMAIL, PHONE_DISPLAY, LINKEDIN_URL, GITHUB_URL, NEXINDU_URL } from '@/lib/site';

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');
const PROJECTS = [
  { id: 'nexindu', name: 'NexIndu' },
  { id: 'nexkio', name: 'NexKio' },
  { id: 'nexquipu', name: 'NexQuipu' },
] as const;
const JOBS = ['bbraun', 'coiron'] as const;

export default function CVPage() {
  const t = useTranslations('cv');
  const tp = useTranslations('projects');
  const te = useTranslations('experience');
  const locale = useLocale();
  const skills = t.raw('skills.items') as { label: string; text: string }[];

  return (
    <div className={styles.container}>
      <div className={styles.printHeader}>
        <a
          href={`/cv/Miguel_Giles_CV_${locale.toUpperCase()}.pdf`}
          download
          className="btn btn-primary"
        >
          {t('download')}
        </a>
        <Link href={`/${locale}`} className="btn btn-outline-dark">
          {t('back')}
        </Link>
      </div>

      <main className={styles.resumePaper}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.name}>Miguel Giles</h1>
            <p className={styles.role}>{t('role')}</p>
            <p className={styles.contact}>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · {PHONE_DISPLAY} · {t('location')}
            </p>
            <p className={styles.contact}>
              <a href={SITE_URL}>{strip(SITE_URL)}</a> · <a href={LINKEDIN_URL}>{strip(LINKEDIN_URL)}</a> ·{' '}
              <a href={GITHUB_URL}>{strip(GITHUB_URL)}</a>
            </p>
            <p className={styles.available}>{t('available')}</p>
          </div>
          <Image
            src="/images/miguel-profile.png"
            alt="Miguel Giles"
            width={96}
            height={96}
            className={styles.photo}
            priority
          />
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('profile.title')}</h2>
          <p className={styles.text}>{t('profile.text')}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('projectsTitle')}</h2>
          {PROJECTS.map(({ id, name }) => {
            const bullets = tp.raw(`items.${id}.bullets`) as string[];
            return (
              <div key={id} className={styles.item}>
                <h3 className={styles.itemTitle}>
                  {name}
                  <span className={styles.itemMeta}> — {tp(`items.${id}.badge`)}</span>
                  {id === 'nexindu' && (
                    <>
                      {' · '}
                      <a href={NEXINDU_URL} className={styles.itemLink}>{strip(NEXINDU_URL)}</a>
                    </>
                  )}
                </h3>
                <p className={styles.itemLine}>{tp(`items.${id}.line`)}</p>
                <ul className={styles.bullets}>
                  {bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            );
          })}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('experienceTitle')}</h2>
          {JOBS.map((id) => {
            const bullets = te.raw(`items.${id}.bullets`) as string[];
            return (
              <div key={id} className={styles.item}>
                <div className={styles.itemHead}>
                  <h3 className={styles.itemTitle}>
                    {te(`items.${id}.role`)} <span className={styles.itemMeta}>· {te(`items.${id}.company`)}</span>
                  </h3>
                  <span className={styles.period}>{te(`items.${id}.period`)}</span>
                </div>
                <ul className={styles.bullets}>
                  {bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            );
          })}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('skills.title')}</h2>
          <ul className={styles.skills}>
            {skills.map((s) => (
              <li key={s.label}><strong>{s.label}:</strong> {s.text}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('educationTitle')}</h2>
          <p className={styles.text}>
            <strong>{t('education.title')}</strong> — {t('education.school')} ({t('education.year')})
          </p>
          <p className={styles.text}>
            {t('education.selfTaught')} ({t('education.selfTaughtPeriod')})
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('languagesTitle')}</h2>
          <p className={styles.text}>
            {t('languages.spanish')}: {t('languages.spanishLevel')} · {t('languages.english')}: {t('languages.englishLevel')}
          </p>
        </section>
      </main>
    </div>
  );
}
