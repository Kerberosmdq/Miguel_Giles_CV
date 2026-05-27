import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import TechStack from '@/components/sections/TechStack';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
