"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

export function TeamSection() {
  const { t } = useLanguage();
  const { team } = useContent();

  return (
    <section id="design-team" className="py-20 bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-serif text-black dark:text-white mb-16 pb-4 border-b border-black/10 dark:border-white/10 uppercase tracking-widest">
          {t("section_design_team") || "Design Team"}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {team.map((member, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="w-full aspect-4/5 overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 rounded-sm mb-4">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 will-change-transform"
                  loading="lazy"
                  suppressHydrationWarning
                />
              </div>
              <h3 className="text-lg font-serif text-black dark:text-white tracking-wider">{member.name}</h3>
              <p className="text-xs text-black/50 dark:text-white/50 uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

