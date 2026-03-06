'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';
import LogoSvg from './LogoSvg';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <LogoSvg width={32} height={32} />
          <span className={styles.brandName}>Dropsify</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          <Link href="/#apps" className={styles.link}>Apps</Link>
          <Link href="/#about" className={styles.link}>About</Link>
          <Link href="/#roadmap" className={styles.link}>Roadmap</Link>
          <Link href="/#contact" className={styles.link}>Contact</Link>
          <a
            href="https://apps.shopify.com/partners/dropsify"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            View on App Store
          </a>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.bar1Open : styles.bar}></span>
          <span className={menuOpen ? styles.bar2Open : styles.bar}></span>
          <span className={menuOpen ? styles.bar3Open : styles.bar}></span>
        </button>
      </div>
    </nav>
  );
}
