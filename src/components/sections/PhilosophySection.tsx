"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import Image from "next/image";

export function PhilosophySection() {
  const { language } = useLanguage();
  const { philosophy } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section 
      id="philosophySection"
      ref={containerRef} 
      className="relative py-32 md:py-64 overflow-hidden transition-colors duration-700 bg-neutral-50 dark:bg-neutral-950"
    >
      {/* Background purely aesthetic text */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex items-center justify-center">
        <span className="text-[30vw] font-serif uppercase select-none translate-y-12">
          {language === 'en' ? 'Spirit' : 'روح'}
        </span>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Elegant Image */}
          <div className="w-full lg:w-1/2 aspect-4/5 relative overflow-hidden group rounded-sm shadow-2xl">
            <motion.div 
               style={{ scale: imgScale }}
               className="absolute inset-0"
            >
              <Image 
                src="/assets/project-3.jpg" 
                alt="Architecture Philosophy"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </motion.div>
            <div className="absolute inset-0 bg-neutral-900/10 mix-blend-multiply" />
            
            {/* Border frame decoration */}
            <div className="absolute inset-0 border border-white/20 m-6 pointer-events-none" />
          </div>

          {/* Right Side: Content */}
          <motion.div 
            style={{ y: textY }}
            className="w-full lg:w-1/2"
          >
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mb-8 flex items-center gap-4"
            >
              <div className="w-12 h-px bg-accent" />
              <span className="text-[11px] tracking-[0.5em] uppercase font-light text-accent">
                {language === 'en' ? 'Our Philosophy' : 'فلسفه ما'}
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-7xl font-serif text-black dark:text-white uppercase leading-tight md:leading-[1.1] tracking-wide mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              {language === 'en' ? philosophy.titleEn : philosophy.titleFa}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className="relative"
            >
               <p className="text-sm md:text-lg leading-relaxed text-black/70 dark:text-white/70 max-w-xl font-light">
                {language === 'en' ? philosophy.subtitleEn : philosophy.subtitleFa}
              </p>
              
              <div className="mt-12 group cursor-pointer inline-flex items-center gap-4" data-cursor="hover">
                <span className="text-[10px] uppercase tracking-[0.4em] font-medium transition-transform group-hover:translate-x-2 duration-300">
                  {language === 'en' ? 'Read More' : 'بیشتر بخوانید'}
                </span>
                <div className="w-8 h-px bg-black dark:bg-white group-hover:w-16 transition-all duration-300" />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
