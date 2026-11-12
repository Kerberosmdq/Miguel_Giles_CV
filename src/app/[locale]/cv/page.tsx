import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import styles from './CV.module.css';
import btn from '@/components/ui/Button.module.css';
import { otherProjects, mainProjects } from '@/data/projects';
import { SITE_URL, EMAIL, PHONE_DISPLAY, LINKEDIN_URL, GITHUB_URL, NEXINDU_URL } from '@/lib/site';

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

type Job = { period: string; role: string; org: string; text: string };

export default async function CVPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('cv');
  const tn = await getTranslations('nexindu');
  const to = await getTranslations('others');
  const tc = await getTranslations('career');
  const te = await getTranslations('education');
  const skills = t.raw('skills.items') as { label: string; text: string }[];
  const approach = tn.raw('approach') as { k: string; v: string }[];
  const jobs = (tc.raw('items') as Job[]).filter((j) => j.text && j.org !== 'UTN FRD + Instituto Linux');
  const meta = te.raw('featured.meta') as string[];

  return (
    <div className={styles.container}>
      <div className={styles.printHeader}>
        <a
          href={`/cv/Miguel_Giles_CV_${locale.toUpperCase()}.pdf`}
          download
          className={`${btn.btn} ${btn.primary}`}
        >
          {t('download')}
        </a>
        <Link href={`/${locale}`} className={`${btn.btn} ${btn.secondary}`}>
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
          <h2 className={styles.sectionTitle}>{t('nexinduTitle')}</h2>
          <div className={styles.item}>
            <h3 className={styles.itemTitle}>{tn('title')}</h3>
            <p className={styles.itemLine}>
              {t('nexinduMeta')}
              <a href={NEXINDU_URL} className={styles.itemLink}>{strip(NEXINDU_URL)}</a>
            </p>
            <ul className={styles.bullets}>
              {approach.map((a) => (
                <li key={a.k}><strong>{a.k}:</strong> {a.v}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('othersTitle')}</h2>
          {mainProjects.map((p) => (
            <div key={p.id} className={styles.item}>
              <h3 className={styles.itemTitle}>
                {p.name}
                <span className={styles.itemMeta}> — {to(`${p.id}.badge`)}</span>
              </h3>
              <p className={styles.itemLine}>{to(`${p.id}.line`)}</p>
            </div>
          ))}
          {otherProjects.map((p) => (
            <div key={p.id} className={styles.item}>
              <h3 className={styles.itemTitle}>
                {p.name}
                <span className={styles.itemMeta}> · <a href={p.url} className={styles.itemLink}>{strip(p.url)}</a></span>
              </h3>
              <p className={styles.itemLine}>{to(p.id)}</p>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('experienceTitle')}</h2>
          {[...jobs].reverse().map((j) => (
            <div key={j.period + j.role} className={styles.item}>
              <div className={styles.itemHead}>
                <h3 className={styles.itemTitle}>
                  {j.role}
                  {j.org && <span className={styles.itemMeta}> · {j.org}</span>}
                </h3>
                <span className={styles.period}>{j.period}</span>
              </div>
              <p className={styles.itemLine}>{j.text}</p>
            </div>
          ))}
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
            <strong>{te('featured.title')}</strong> — {te('featured.org')} · {meta.join(' · ')}
          </p>
          <p className={styles.text}>
            <strong>{te('tech.title')}</strong> — {te('tech.org')} · {te('tech.year')}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('languagesTitle')}</h2>
          <p className={styles.text}>{te('languages')}</p>
        </section>
      </main>
    </div>
  );
}
