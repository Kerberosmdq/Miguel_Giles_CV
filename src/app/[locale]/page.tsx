import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { CaseNexindu } from '@/components/sections/CaseNexindu';
import { HowIWork } from '@/components/sections/HowIWork';
import { OtherProjects } from '@/components/sections/OtherProjects';
import { Career } from '@/components/sections/Career';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <CaseNexindu />
        <HowIWork />
        <OtherProjects />
        <Career />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
