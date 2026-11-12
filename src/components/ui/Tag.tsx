import styles from './Tag.module.css';

export function Tag({ children }: { children: React.ReactNode }) {
  return <li className={styles.tag}>{children}</li>;
}

export function TagList({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul className={styles.list} aria-label={label}>
      {items.map((i) => (
        <Tag key={i}>{i}</Tag>
      ))}
    </ul>
  );
}
