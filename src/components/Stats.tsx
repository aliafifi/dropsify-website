import { Rocket, Wallet, Store, Server } from 'lucide-react';
import styles from './Stats.module.css';

const stats = [
  { value: '9', label: 'Apps in Development', icon: <Rocket size={24} /> },
  { value: '$208', label: 'Monthly Running Cost', icon: <Wallet size={24} /> },
  { value: '8,000+', label: 'Target Merchants', icon: <Store size={24} /> },
  { value: '99.9%', label: 'Uptime Reliability', icon: <Server size={24} /> },
];

export default function Stats() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {stats.map((s) => (
          <div key={s.label} className={styles.card}>
            <span className={styles.icon}>{s.icon}</span>
            <span className={styles.value}>{s.value}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
