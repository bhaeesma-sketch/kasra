import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { OrderedSections } from "@/components/sections/OrderedSections";
import { Footer } from "@/components/sections/Footer";
import { TextTicker } from "@/components/ui/AnimationKit";

export default function Home() {
  return (
    <main className="w-full min-h-screen transition-colors duration-700 overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      <Navbar />
      <Hero />
      <PhilosophySection />
      <TextTicker text="Architecture · Design · Space · Form · Light · Structure" speed={28} />
      <ExpertiseSection />
      <TeamSection />
      <TextTicker text="Interior · Exterior · Concept · Blueprint · Materials · Craft" speed={22} />
      <OrderedSections />
      <Footer />
    </main>
  );
}
