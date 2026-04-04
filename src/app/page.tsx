import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TeamSection } from "@/components/sections/TeamSection";
import { OrderedSections } from "@/components/sections/OrderedSections";
import { Footer } from "@/components/sections/Footer";
import { TextTicker } from "@/components/ui/AnimationKit";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-neutral-50 dark:bg-[#080604] text-black dark:text-white relative">
      <Navbar />
      <Hero />
      <TextTicker text="Architecture · Design · Space · Form · Light · Structure" speed={28} />
      <TeamSection />
      <TextTicker text="Interior · Exterior · Concept · Blueprint · Materials · Craft" speed={22} />
      <OrderedSections />
      <Footer />
    </main>
  );
}
