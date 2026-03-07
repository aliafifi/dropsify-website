import styles from './Footer.module.css';
import LogoSvg from './LogoSvg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', opacity: 0.5 }}>
        <LogoSvg />
      </div>
      <p className={styles.text}>
        © 2026 Dropsify App Company. Focused on merchant success.
      </p>
    </footer>
  );
}
