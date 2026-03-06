import Link from 'next/link';
import { Mail, Heart } from 'lucide-react';
import styles from './Footer.module.css';
import LogoSvg from './LogoSvg';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.glow1}></div>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <LogoSvg width={28} height={28} />
            <span className={styles.brandName}>Dropsify</span>
          </div>
          <p className={styles.tagline}>
            Building the apps Shopify forgot to make.
          </p>
          <div className={styles.socials}>
            <a href="mailto:hello@dropsify.shop" className={styles.socialLink} aria-label="Email">
              <Mail size={16} /> hello@dropsify.shop
            </a>
          </div>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <h4>Apps</h4>
            <Link href="/#apps">CopyFlow AI</Link>
            <Link href="/#apps">ShieldCheck</Link>
            <Link href="/#apps">ClearView Analytics</Link>
            <Link href="/#apps">TikContent Studio</Link>
            <Link href="/#apps">WinBack</Link>
            <Link href="/#apps">WholeSale Hub</Link>
          </div>
          <div className={styles.col}>
            <h4>Company</h4>
            <Link href="/#about">About Us</Link>
            <Link href="/#roadmap">Roadmap</Link>
            <Link href="/#apps">All Apps</Link>
            <a href="https://apps.shopify.com" target="_blank" rel="noopener noreferrer">App Store</a>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Dropsify. All rights reserved.</p>
        <p className={styles.builtWith}>Built with <Heart size={14} className={styles.heart} /> for Shopify merchants worldwide.</p>
      </div>
    </footer>
  );
}
