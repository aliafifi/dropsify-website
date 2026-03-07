import styles from './Hero.module.css';
import LogoSvg from './LogoSvg';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundGlow} />
      <div className={styles.content}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <LogoSvg />
        </div>
        <h1 className={styles.title}>
          Hyper-focused apps.<br />Massive merchant logic.
        </h1>
        <p className={styles.subtitle}>
          In 2026, merchants don't need another generic app. They need invisible, flawless architecture. Discover CartRecovery AI, OmniSync Pro, and MagicBundle.
        </p>
        <div className={styles.ctaGrid}>
          <a href="#apps" className={styles.primaryBtn}>
            Explore Our 2026 Pipeline
          </a>
        </div>
      </div>
    </section>
  );
}
