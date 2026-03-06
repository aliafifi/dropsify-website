import { Shield, BarChart2, PenTool } from 'lucide-react';
import styles from './Hero.module.css';
import LogoSvg from './LogoSvg';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow1}></div>
      <div className={styles.glow2}></div>
      <div className={styles.grid}></div>

      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          6 Shopify Apps Launching 2026
        </div>

        <div className={styles.logoWrapper}>
          <LogoSvg width={80} height={80} className={styles.logo} />
        </div>

        <h1 className={styles.title}>
          Shopify Apps That <br />
          <span className={styles.gradient}>Actually Work</span>
        </h1>

        <p className={styles.subtitle}>
          We build powerful, affordable Shopify apps that solve the problems
          merchants complain about most — at a fraction of enterprise prices.
        </p>

        <div className={styles.actions}>
          <a href="#apps" className={styles.btnPrimary}>
            Explore Our Apps
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a href="#about" className={styles.btnSecondary}>
            About Dropsify
          </a>
        </div>

        <div className={styles.trust}>
          <span>Built for Shopify merchants</span>
          <span>·</span>
          <span>Affordable pricing</span>
          <span>·</span>
          <span>Real problems solved</span>
        </div>

        <div className={styles.floatingCards}>
          <div className={`${styles.fCard} ${styles.fCard1}`}>
            <span className={styles.fIcon}><Shield size={20} /></span>
            <div>
              <p className={styles.fCardTitle}>Bot Attack Blocked</p>
              <p className={styles.fCardSub}>342 attempts stopped</p>
            </div>
          </div>
          <div className={`${styles.fCard} ${styles.fCard2}`}>
            <span className={styles.fIcon}><BarChart2 size={20} /></span>
            <div>
              <p className={styles.fCardTitle}>Revenue Attributed</p>
              <p className={styles.fCardSub}>$12,400 from Facebook Ads</p>
            </div>
          </div>
          <div className={`${styles.fCard} ${styles.fCard3}`}>
            <span className={styles.fIcon}><PenTool size={20} /></span>
            <div>
              <p className={styles.fCardTitle}>Products Rewritten</p>
              <p className={styles.fCardSub}>240 SEO descriptions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
