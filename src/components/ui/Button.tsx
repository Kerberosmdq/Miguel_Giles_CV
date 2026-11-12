import styles from './Button.module.css';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className, ...rest }: Props) {
  return (
    <a className={`${styles.btn} ${styles[variant]} ${className ?? ''}`} {...rest} />
  );
}
