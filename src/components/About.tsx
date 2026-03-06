import { Target, DollarSign, Zap, Lock } from 'lucide-react';
import styles from './About.module.css';

const values = [
  {
    icon: <Target size={24} />,
    title: 'Problem-First',
    desc: 'Every app we build starts from a real, verified pain point — not a feature idea.',
  },
  {
    icon: <DollarSign size={24} />,
    title: 'Radically Affordable',
    desc: 'Enterprise-quality features at prices any merchant can afford. No % cuts, no surprises.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Fast & Reliable',
    desc: 'Apps that actually work. Real-time data, zero sync delays, and 99.9% uptime.',
  },
  {
    icon: <Lock size={24} />,
    title: 'Merchant-First',
    desc: 'We never sell your data. Your store info stays yours — always.',
  },
];

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.glow}></div>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <span className="section-label">About Dropsify</span>
            <h2 className="section-title">
              Built by a merchant,<br /><span>for merchants</span>
            </h2>
            <p className={styles.body}>
              We got tired of paying $99–$999/month for apps that barely worked,
              watching Shopify lock basic features behind $2,000/mo Plus plans,
              and seeing merchants lose battles against chargebacks and bots with no help.
            </p>
            <p className={styles.body}>
              So we built a company to fix it. One problem at a time. Starting with
              the apps merchants complain about most — and pricing them for real businesses,
              not just enterprise.
            </p>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaVal}>9</span>
                <span className={styles.metaLabel}>Apps Planned</span>
              </div>
              <div className={styles.metaDivider}></div>
              <div className={styles.metaItem}>
                <span className={styles.metaVal}>$0–$30</span>
                <span className={styles.metaLabel}>Monthly Running Cost</span>
              </div>
              <div className={styles.metaDivider}></div>
              <div className={styles.metaItem}>
                <span className={styles.metaVal}>2026</span>
                <span className={styles.metaLabel}>Launch Year</span>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {values.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <div>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
