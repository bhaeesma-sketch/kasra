"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useContent, TeamMember } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/AnimationKit";
import { motion, Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function TeamSection() {
  const { t } = useLanguage();
  const { team } = useContent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  };

  return (
    <section id="design-team" className="py-24 transition-colors" style={{ background: 'var(--bg-main)' }}>
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
          number="01"
          title={t("section_design_team") || "Design Team"}
          className="mb-16"
        />

        <motion.div
           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
           variants={containerVariants}
           initial="hidden"
           whileInView={mounted ? "visible" : "hidden"}
           viewport={{ once: true, margin: "-80px" }}
         >
           {team.map((member, idx) => (
             <TeamCard key={idx} member={member} variants={cardVariants} />
           ))}
         </motion.div>
      </div>
    </section>
  );
}

function TeamCard({ member, variants }: { member: TeamMember; variants: Variants }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={variants}
      className="group cursor-pointer relative"
      data-cursor="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
    >
      <div className="w-full aspect-4/5 overflow-hidden bg-neutral-200 dark:bg-neutral-900 mb-5 relative rounded-sm">
        {/* Spotlight Effect (Lighting) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: opacity * 0.6,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(200, 168, 130, 0.25), transparent 80%)`
          }}
        />
        
        <motion.img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover transition-all duration-700 filter grayscale group-hover:grayscale-0 scale-[1.02] group-hover:scale-110"
          loading="lazy"
          suppressHydrationWarning
        />
        
        {/* Global Darkening Overlay for better name readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <h3 className="text-base font-serif text-black dark:text-white tracking-wide group-hover:text-accent transition-colors duration-300">
        {member.name}
      </h3>
      <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-[0.3em] font-light mt-1">
        {member.role}
      </p>
    </motion.div>
  );
}
