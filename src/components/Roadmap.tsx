import { Layers, ShieldCheck, BarChart3, Video, RefreshCcw, Factory, Scale, Bot, RefreshCw } from 'lucide-react';
import styles from './Roadmap.module.css';

const phases = [
  {
    phase: 'Phase 1',
    period: 'Month 1–3',
    color: '#4F8EF7',
    status: 'active',
    apps: [
      { name: 'CopyFlow AI', icon: <Layers size={20} />, price: '$19.99/mo', est: 'Q2 2026' },
      { name: 'EasyComply', icon: <Scale size={20} />, price: '$9.99/mo', est: 'Q2 2026' },
      { name: 'WinBack', icon: <RefreshCcw size={20} />, price: '$14.99/mo', est: 'Q2 2026' },
    ],
  },
  {
    phase: 'Phase 2',
    period: 'Month 3–6',
    color: '#7C5CFC',
    status: 'upcoming',
    apps: [
      { name: 'TikContent Studio', icon: <Video size={20} />, price: '$24.99/mo', est: 'Q3 2026' },
      { name: 'ShieldCheck', icon: <ShieldCheck size={20} />, price: '$14.99/mo', est: 'Q3 2026' },
      { name: 'StoreBot AI', icon: <Bot size={20} />, price: '$19.99/mo', est: 'Q3 2026' },
    ],
  },
  {
    phase: 'Phase 3',
    period: 'Month 6–12',
    color: '#22D3EE',
    status: 'future',
    apps: [
      { name: 'ClearView Analytics', icon: <BarChart3 size={20} />, price: '$29/mo', est: 'Q4 2026' },
      { name: 'WholeSale Hub', icon: <Factory size={20} />, price: '$29/mo', est: 'Q4 2026' },
      { name: 'SyncFlow', icon: <RefreshCw size={20} />, price: '$19–49/mo', est: 'Q4 2026' },
    ],
  },
];

export default function Roadmap() {
  return (
    <section className={styles.section} id="roadmap">
      <div className={styles.glow}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className="section-label">Roadmap</span>
          <h2 className={`section-title ${styles.title}`}>
            9 Apps. <span>One Year.</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0', textAlign: 'center' }}>
            A clear, phased plan to build 9 highly-requested Shopify apps in 12 months.
          </p>
        </div>

        <div className={styles.phases}>
          {phases.map((p, i) => (
            <div key={p.phase} className={styles.phaseCard} style={{ '--phase-color': p.color } as React.CSSProperties}>
              <div className={styles.phaseHeader}>
                <div className={styles.phaseLeft}>
                  <div className={styles.phaseBadge} style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}>
                    {p.phase}
                  </div>
                  <div>
                    <p className={styles.phasePeriod}>{p.period}</p>
                    <p className={styles.phaseStatus}>{p.status === 'active' ? '🟢 Starting Now' : p.status === 'upcoming' ? '🔵 Planned' : '⚪ Future'}</p>
                  </div>
                </div>
              </div>

              <div className={styles.appList}>
                {p.apps.map((app) => (
                  <div key={app.name} className={styles.appItem}>
                    <span className={styles.appItemIcon}>{app.icon}</span>
                    <span className={styles.appItemName}>{app.name}</span>
                    <span className={styles.appItemEst}>{app.est}</span>
                    <span className={styles.appItemPrice}>{app.price}</span>
                  </div>
                ))}
              </div>

              {i < phases.length - 1 && (
                <div className={styles.connector}>
                  <div className={styles.connectorLine}></div>
                  <span className={styles.connectorArrow}>↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
