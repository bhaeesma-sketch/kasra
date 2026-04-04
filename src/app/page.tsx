import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TeamSection } from "@/components/sections/TeamSection";
import { OrderedSections } from "@/components/sections/OrderedSections";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white relative transition-colors duration-500">
      <Navbar />
      <Hero />
      <TeamSection />
      <OrderedSections />
      <Footer />
    </main>
  );
}
