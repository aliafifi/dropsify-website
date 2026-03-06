/* eslint-disable @next/next/no-img-element */
import { apps } from '@/data/apps';
import styles from './AppsGrid.module.css';

export default function AppsGrid() {
  return (
    <section className={styles.section} id="apps">
      <div className={styles.glow}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className="section-label">Our Apps</span>
          <h2 className={`section-title ${styles.title}`}>
            6 Apps. One Mission: <span>Fix Shopify.</span>
          </h2>
          <p className="section-subtitle" style={{margin: '16px auto 0', textAlign: 'center'}}>
            Each app targets a specific, verified pain point that merchants complain about daily —
            priced to be accessible to everyone, not just enterprise.
          </p>
        </div>

        <div className={styles.grid}>
          {apps.map((app) => (
            <div key={app.id} className={styles.card} style={{ '--accent': app.color, '--accent-light': app.colorLight } as React.CSSProperties}>
              <div className={styles.cardTop}>
                <div className={styles.iconWrap} style={{ background: app.colorLight }}>
                  {app.image ? (
                    <img src={app.image} alt={`${app.name} icon`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                  ) : (
                    <span className={styles.icon}>{app.icon}</span>
                  )}
                </div>
                <span className={styles.status}>
                  {app.status === 'coming-soon' ? '🔜 Coming Soon' : '🚀 Live'}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.appName}>{app.name}</h3>
                <p className={styles.appTagline}>{app.tagline}</p>
                <p className={styles.appDesc}>{app.description}</p>
              </div>

              <div className={styles.features}>
                {app.features.slice(0, 3).map((f) => (
                  <div key={f} className={styles.feature}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </div>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.tags}>
                  {app.tags.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
                {app.status === 'live' ? (
                  <a href={app.link || '#'} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#000', padding: '6px 14px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>Install App</a>
                ) : (
                  <span className={styles.price}>{app.price}</span>
                )}
              </div>

              <div className={styles.glow2} style={{ background: `radial-gradient(circle, ${app.colorLight}, transparent 70%)` }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
