import Hero from '@/components/Hero';
import AppsGrid from '@/components/AppsGrid';
import Stats from '@/components/Stats';
import About from '@/components/About';
import Roadmap from '@/components/Roadmap';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <AppsGrid />
      <About />
      <Roadmap />
    </>
  );
}
