import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#09090b',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Hero />
      <AppShowcase />
      <Footer />
    </main>
  );
}
