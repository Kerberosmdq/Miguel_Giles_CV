import styles from './Flow.module.css';

export type FlowStep = {
  title: string;
  desc?: string;
  /** key = borde de acento (entrada/salida); ok = verificado */
  tone?: 'key' | 'ok';
};

type Props = {
  steps: FlowStep[];
  label?: string;
  /** compact: una sola línea de texto mono (hero) */
  compact?: boolean;
  numbered?: boolean;
  /** vertical también en escritorio */
  vertical?: boolean;
};

export function Flow({ steps, label, compact, numbered, vertical }: Props) {
  const cls = [
    styles.flow,
    compact ? styles.compact : '',
    vertical ? styles.vertical : '',
  ].join(' ');
  return (
    <ol className={cls} aria-label={label}>
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={`${styles.node} ${s.tone === 'key' ? styles.key : ''} ${s.tone === 'ok' ? styles.ok : ''}`}
        >
          {numbered && <span className={styles.num}>{i + 1}</span>}
          <span className={styles.title}>{s.title}</span>
          {s.desc && <span className={styles.desc}>{s.desc}</span>}
        </li>
      ))}
    </ol>
  );
}
