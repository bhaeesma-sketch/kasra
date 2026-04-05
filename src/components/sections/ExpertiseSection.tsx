"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

export function ExpertiseSection() {
  const { language } = useLanguage();
  const { expertise } = useContent();
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <section 
      id="expertiseSection"
      className="py-32 md:py-48 relative transition-colors duration-700 bg-neutral-100 dark:bg-black/20"
    >
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
        
        {/* Left Side: Cinematic Large Image */}
        <div className="w-full lg:w-1/2 relative aspect-square lg:aspect-4/5 overflow-hidden rounded-sm shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.img
              key={hoveredIndex}
              src={expertise.items[hoveredIndex].img}
              alt="Expertise Montage"
              className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "circOut" }}
            />
          </AnimatePresence>
          
          {/* Decorative frame overlay */}
          <div className="absolute inset-0 border border-white/10 m-8 pointer-events-none" />
          
          {/* Animated light sweep */}
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
          />
        </div>

        {/* Right Side: Sophisticated List */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-16">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-4 mb-4"
             >
               <span className="text-[11px] tracking-[0.5em] uppercase font-light text-accent">
                 {language === 'en' ? 'Core Expertise' : 'تخصص اصلی'}
               </span>
               <div className="flex-1 h-px bg-accent/20" />
             </motion.div>
             
             <h2 className="text-4xl md:text-6xl font-serif uppercase tracking-tight text-black dark:text-white leading-tight">
               {language === 'en' ? expertise.titleEn : expertise.titleFa}
             </h2>
          </div>

          <div className="flex flex-col w-full border-t border-black/5 dark:border-white/5">
            {expertise.items.map((item, idx) => (
              <motion.div 
                key={item.id}
                className="group border-b border-black/5 dark:border-white/5 cursor-pointer relative py-10"
                onMouseEnter={() => setHoveredIndex(idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                data-cursor="hover"
              >
                <div className="relative z-10 flex items-center justify-between transition-all duration-500 group-hover:px-4">
                  <div className="flex items-center gap-8 md:gap-16">
                    <span className="text-[10px] font-mono text-accent/40 group-hover:text-accent transition-colors duration-300">
                      {item.id}
                    </span>
                    <h3 className={`text-2xl md:text-4xl font-serif tracking-wide transition-all duration-300 ${hoveredIndex === idx ? 'text-accent translate-x-4' : 'text-black/40 dark:text-white/30 group-hover:text-black dark:group-hover:text-white'}`}>
                      {language === 'en' ? item.titleEn : item.titleFa}
                    </h3>
                  </div>
                  
                  <motion.div 
                    animate={{ rotate: hoveredIndex === idx ? 45 : 0, scale: hoveredIndex === idx ? 1.2 : 1 }}
                    className={`transition-colors ${hoveredIndex === idx ? 'text-accent' : 'text-transparent'}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </div>

                {/* Background Highlight on Active */}
                {hoveredIndex === idx && (
                  <motion.div 
                    layoutId="expertiseHighlight"
                    className="absolute inset-0 bg-black/5 dark:bg-white/5 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
