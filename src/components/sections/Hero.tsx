"use client";

import { useLanguage } from "@/context/LanguageContext";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const HERO_IMAGES = [
  "/assets/project-1.jpg",
  "/assets/project-2.jpg",
  "/assets/project-3.jpg",
  "/assets/project-4.jpg",
];

export function Hero() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 2400);

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearInterval(slideTimer);
    };
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  if (!mounted) return <div className="h-screen w-full bg-[#080808]" />;

  return (
    <>
      {/* ─── Luxury Cinematic Preloader ─── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center p-6"
          >
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, ease: "easeOut" }}
             >
                <Image 
                  src="/assets/kasra-luxury-logo.png" 
                  alt="Kasra Padyab Vault" 
                  width={120} 
                  height={120} 
                  className="object-contain mb-12 drop-shadow-2xl opacity-90 mix-blend-screen"
                />
             </motion.div>
             <div className="flex flex-col items-center gap-6">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2, ease: "circIn" }}
                  className="w-64 md:w-96 h-[1px] bg-accent/50 origin-left"
                />
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-[9px] uppercase tracking-[0.4em] text-accent/80 font-mono"
                >
                   Initializing Experience
                </motion.span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="home"
        className="relative w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-[#050505]"
      >
        {/* ─── Architectural Cinematic Slider ─── */}
        <div className="absolute inset-0 z-0">
           <AnimatePresence mode="popLayout">
             <motion.div
               key={currentSlide}
               initial={{ opacity: 0, scale: 1.05 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
               transition={{ duration: 2, ease: "easeOut" }}
               className="absolute inset-0"
             >
               <Image
                 src={HERO_IMAGES[currentSlide]}
                 alt={`Architectural Masterpiece ${currentSlide + 1}`}
                 fill
                 priority
                 className="object-cover"
                 quality={100}
               />
               
               {/* Luxurious Vignette & Fade Gradients */}
               <div className={cn(
                 "absolute inset-0 transition-opacity duration-1000",
                 isDark ? "bg-black/50" : "bg-black/30"
               )} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 mix-blend-multiply" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
             </motion.div>
           </AnimatePresence>

           {/* Fine Texture Grain Overlay for Editorial Feel */}
           <div className="absolute inset-0 z-[2] opacity-[0.04] pointer-events-none mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        </div>

        {/* ─── Premium Logo (Luxury Entrance) ─── */}
        <div className="absolute top-8 left-8 lg:top-12 lg:left-14 z-50 mix-blend-difference">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={!loading ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          >
            <Link href="/" className="block group">
              <Image 
                src="/assets/kasra-luxury-logo.png" 
                alt="Logo" 
                width={100} 
                height={100} 
                priority
                className="w-24 md:w-28 transition-all duration-1000 hover:scale-105 hover:brightness-125 drop-shadow-[0_0_15px_rgba(255,215,0,0.2)] mix-blend-screen" 
              />
            </Link>
          </motion.div>
        </div>

        {/* ─── Main Typography & Content ─── */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end lg:justify-center px-8 lg:px-24 pb-24 lg:pb-0">
          
          <div className="flex flex-col max-w-5xl">
            {/* Tagline Re-imagined */}
            <div className="overflow-hidden mb-6 flex items-center gap-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={!loading ? { width: 40 } : {}}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                className="h-[1px] bg-accent"
              />
              <motion.span 
                initial={{ y: "100%", opacity: 0 }}
                animate={!loading ? { y: 0, opacity: 0.9 } : {}}
                transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
                className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-mono text-white/80"
              >
                {language === 'en' ? 'Refining The Standard' : 'ارتقاء استانداردهای معماری'}
              </motion.span>
            </div>

            {/* Monumental Title */}
            <div className="relative">
              <h1 className="font-serif leading-[0.9] tracking-[-0.03em] uppercase text-white flex flex-col items-start drop-shadow-2xl">
                <div className="overflow-hidden">
                  <motion.span 
                    initial={{ y: "110%", rotateX: -20 }}
                    animate={!loading ? { y: 0, rotateX: 0 } : {}}
                    transition={{ duration: 1.6, ease: [0.19, 1, 0.22, 1], delay: 1.1 }}
                    className="block text-[clamp(4rem,12vw,11rem)]"
                    style={{ textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                  >
                    KASRA
                  </motion.span>
                </div>
                <div className="overflow-hidden flex items-end gap-6 md:gap-12 pl-4 md:pl-24">
                  <motion.span 
                    initial={{ y: "110%", rotateX: -20 }}
                    animate={!loading ? { y: 0, rotateX: 0 } : {}}
                    transition={{ duration: 1.6, ease: [0.19, 1, 0.22, 1], delay: 1.3 }}
                    className="block text-[clamp(4rem,12vw,11rem)] text-transparent"
                    style={{ 
                       WebkitTextStroke: "1px rgba(255,255,255,0.8)",
                       textShadow: "0 10px 40px rgba(0,0,0,0.2)"
                    }}
                  >
                    PADYAB
                  </motion.span>
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={!loading ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.5, delay: 2.2, ease: "easeOut" }}
                    className="hidden md:block w-4 h-4 rounded-full bg-linear-to-tr from-yellow-600 via-yellow-400 to-yellow-100 mb-6 md:mb-12 shadow-[0_0_30px_rgba(255,215,0,0.8)]"
                  />
                </div>
              </h1>
            </div>

            {/* Subtitle & Accent details */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={!loading ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
              className="mt-10 md:mt-16 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 pl-2"
            >
                <p className="font-serif italic text-lg md:text-2xl text-white/70 max-w-lg leading-relaxed">
                  {t("hero_subtitle")}
                </p>
                
                <div className="hidden md:block h-12 w-px bg-white/20" />
                
                <div className="flex gap-12">
                   <div className="flex flex-col gap-1">
                      <span className="text-3xl font-serif text-white">12+</span>
                      <span className="text-[8px] uppercase tracking-[0.3em] text-accent font-mono">Years</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-3xl font-serif text-white">450</span>
                      <span className="text-[8px] uppercase tracking-[0.3em] text-accent font-mono">Projects</span>
                   </div>
                </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Floating Scroll Indicator ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={!loading ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 2.5 }}
          className="absolute bottom-8 right-8 lg:bottom-12 lg:right-14 z-50 flex flex-col items-center gap-6"
        >
          <span className="text-[9px] tracking-[0.5em] uppercase font-mono text-white/50 rotate-90 translate-y-12 mb-8 hidden lg:block">
             Scroll
          </span>
          <div
            onClick={() => {
              const section = document.getElementById("philosophySection");
              section?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/10 transition-colors duration-500 backdrop-blur-md relative group overflow-hidden"
          >
             <motion.div 
               animate={{ y: [0, 6, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="w-[1px] h-4 bg-white group-hover:bg-accent transition-colors"
             />
          </div>
        </motion.div>

        {/* ─── Minimal Slider Controls ─── */}
        <div className="absolute top-1/2 right-6 lg:right-14 -translate-y-1/2 z-50 flex flex-col gap-4">
          {HERO_IMAGES.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="flex items-center gap-4 group"
            >
              <span className={cn(
                "text-[8px] font-mono tracking-[0.2em] transition-all duration-300",
                i === currentSlide ? "opacity-100 text-accent font-bold" : "opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0 text-white"
              )}>
                 0{i + 1}
              </span>
              <div className={cn(
                "h-[1px] transition-all duration-500",
                i === currentSlide ? "w-8 bg-accent" : "w-3 bg-white/30 group-hover:bg-white/60"
              )} />
            </button>
          ))}
        </div>

      </section>
    </>
  );
}
