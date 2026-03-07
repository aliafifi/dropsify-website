import styles from './AppShowcase.module.css';

const apps = [
  {
    id: 'cart-recovery',
    title: 'CartRecovery AI',
    category: 'Conversion',
    description: 'Ultra-smart abandonment app using conversational AI to analyze drop-offs and generate hyper-personalized SMS or WhatsApp recovery messages.',
    status: 'In Development',
    statusClass: 'inDevelopment',
    price: 'Usage-based',
    themeColor: '#10b981',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    id: 'omnisync',
    title: 'OmniSync Pro',
    category: 'Operations',
    description: 'An invisible inventory brain matching stock perfectly across TikTok Shop, Instagram, and Shopify in real-time to prevent overselling.',
    status: 'Planned',
    statusClass: 'planned',
    price: '$19/mo',
    themeColor: '#6366f1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    id: 'magicbundle',
    title: 'MagicBundle',
    category: 'Merchandising',
    description: 'Dynamic, on-page AI tool that analyzes cart contents and native-injects beautiful "Frequently Bought Together" bundles instantly boosting AOV.',
    status: 'Planned',
    statusClass: 'planned',
    price: '$29/mo',
    themeColor: '#f43f5e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  }
];

export default function AppShowcase() {
  return (
    <section id="apps" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>2026 App Pipeline</h2>
          <p className={styles.headerSubtitle}>
            We are building three highly specialized apps for the modern Shopify ecosystem.
          </p>
        </div>
        
        <div className={styles.grid}>
          {apps.map((app) => (
            <div 
              key={app.id} 
              className={styles.card}
              style={{ '--theme-color': app.themeColor } as React.CSSProperties}
            >
              <div className={`${styles.statusIndicator} ${styles[app.statusClass] || ''}`}>
                <span className={styles.dot}></span>
                {app.status}
              </div>
              
              <div className={styles.iconWrapper}>
                {app.icon}
              </div>
              
              <div className={styles.appCategory}>{app.category}</div>
              <h3 className={styles.appTitle}>{app.title}</h3>
              <p className={styles.appDescription}>{app.description}</p>
              
              <div className={styles.pricing}>
                <span className={styles.priceLabel}>Target Pricing</span>
                <span className={styles.priceValue}>{app.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
