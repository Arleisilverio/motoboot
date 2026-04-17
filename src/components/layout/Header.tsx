import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Motoboot' }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🏍️</div>
          <span className={styles.logoText}>
            <span className="gradient-text">Moto</span>boot
          </span>
        </div>
        {title !== 'Motoboot' && (
          <h1 className={styles.pageTitle}>{title}</h1>
        )}
      </div>
    </header>
  );
}
