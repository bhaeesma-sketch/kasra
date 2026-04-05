"use client";

import { useLanguage } from "@/context/LanguageContext";
import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMAGES = [
  "/assets/project-1.jpg",
  "/assets/project-2.jpg",
  "/assets/project-3.jpg",
  "/assets/project-4.jpg",
];

// ─── Hero Component ───────────────────────────────────────────────────────────
export function Hero() {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
    
    if (titleRef.current) {
      gsap.to(titleRef.current, { x: x * 20, y: y * 10, rotateY: x * 5, rotateX: -y * 5, duration: 2, ease: "power2.out" });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Entry cinematic sequence
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.to(overlayRef.current, {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1.2,
      ease: "expo.inOut",
    });

    if (titleRef.current) {
      const text = titleRef.current.textContent || "";
      titleRef.current.innerHTML = text.split("").map((c) =>
        c === " " ? " " : `<span class="inline-block opacity-0 translate-y-[105%] filter blur-[10px] skew-y-[10deg]">${c}</span>`
      ).join("");

      tl.to(titleRef.current.querySelectorAll("span"), {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        skewY: 0,
        duration: 1.8,
        ease: "expo.out",
        stagger: 0.045,
      }, "-=0.7");
    }

    tl.fromTo(subtitleRef.current,
      { y: 40, opacity: 0, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out" },
      "-=0.8"
    );

    tl.fromTo(taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.6"
    );

    tl.fromTo(scrollRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.4"
    );

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden transition-colors duration-1000"
      style={{ background: isDark ? "#000" : "var(--bg-main)" }}
    >
      {/* Intro overlay wipe */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-40"
        style={{ background: isDark ? "var(--bg-dark)" : "var(--bg-main)", transformOrigin: "top" }}
      />

      {/* ─── Ultra-Premium Minimalist Background ─── */}
      <div className={`absolute inset-0 z-0 ${isDark ? 'bg-neutral-950' : 'bg-[#FCFAF7]'} overflow-hidden transition-colors duration-1000`}>
        {/* Procedural Architectural Grids */}
        <div className={`absolute inset-0 z-0 pointer-events-none ${isDark ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}>
           {/* Vertical Grid Lines */}
           {[...Array(12)].map((_, i) => (
             <div 
               key={`v-${i}`} 
               className="absolute top-0 bottom-0 w-px bg-current" 
               style={{ left: `${(i + 1) * 8.33}%` }} 
             />
           ))}
           {/* Horizontal Grid Lines */}
           {[...Array(8)].map((_, i) => (
             <div 
               key={`h-${i}`} 
               className="absolute left-0 right-0 h-px bg-current" 
               style={{ top: `${(i + 1) * 12.5}%` }} 
             />
           ))}
        </div>

        {/* Dynamic Light Canvas (Subtle Bloom) */}
        <motion.div 
          animate={{
            x: mousePos.x * 40,
            y: mousePos.y * 40,
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-[1] pointer-events-none blur-[140px]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${isDark ? 'rgba(200, 168, 130, 0.3)' : 'rgba(100, 70, 30, 0.2)'} 0%, transparent 70%)`
          }}
        />

        {/* Floating Light Leaks */}
        <motion.div 
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] z-[1] pointer-events-none opacity-[0.03] dark:opacity-[0.08]"
          style={{
             background: "conic-gradient(from 0deg at 50% 50%, transparent, rgba(200, 168, 130, 0.1), transparent 40%)"
          }}
        />
        
        {/* Luxury Grain Overlay */}
        <div className="absolute inset-0 z-[2] opacity-[0.02] dark:opacity-[0.04] pointer-events-none mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* ─── Navigation Branding (Logo Integration) ─── */}
      <div className="absolute top-12 left-12 z-50 overflow-hidden mix-blend-difference">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "expo.out", delay: 1 }}
        >
          <Link href="/" className="block group">
            <Image 
              src="/assets/new-branding-logo.png" 
              alt="Brand Logo" 
              width={260} 
              height={52} 
              className="w-48 md:w-64 invert grayscale brightness-150 transition-all duration-700 group-hover:scale-105" 
            />
          </Link>
        </motion.div>
      </div>

      {/* ─── Hero Main Content ─── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 lg:px-24">
        
        {/* Floating Architectural Annotation */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 2.5, delay: 2 }}
          className="absolute left-[8.33%] top-[30vh] hidden lg:block"
        >
           <div className="flex flex-col gap-4 border-l border-accent/40 pl-6 py-2">
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase">Ref. System 026</span>
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase">Lat: 25.2048° N</span>
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase">Lon: 55.2708° E</span>
           </div>
        </motion.div>

        <div className="max-w-[1400px] w-full flex flex-col items-center">
          
          {/* Tagline Reveal */}
          <div className="overflow-hidden mb-12">
            <motion.span 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 0.6 }}
              transition={{ duration: 2, ease: "expo.out", delay: 1.2 }}
              className="text-[10px] md:text-[12px] tracking-[1em] uppercase font-light text-black dark:text-white"
            >
              {language === 'en' ? 'Pioneering Human Experience' : 'پیشگام تجربه انسانی'}
            </motion.span>
          </div>

          {/* Main Title - The Masterpiece Typography */}
          <div className="relative group perspective-1000">
             <motion.h1
               initial={{ opacity: 0, y: 100, rotateX: -30 }}
               animate={{ opacity: 1, y: 0, rotateX: 0 }}
               transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1], delay: 1.5 }}
               className="font-serif leading-[0.85] tracking-[-0.04em] uppercase text-center select-none"
               style={{
                 fontSize: "clamp(4.5rem, 16vw, 16rem)",
                 color: isDark ? "#FDFCF9" : "#1A1A1A",
                 textRendering: "optimizeLegibility"
               }}
             >
               {t("hero_title").split(" ").map((word, i) => (
                 <span key={i} className="block lg:inline-block lg:mx-4">
                    {word}
                 </span>
               ))}
             </motion.h1>

             {/* Optical Shadow for Depth */}
             <div className={`absolute inset-0 blur-[80px] opacity-[0.08] pointer-events-none scale-110 translate-y-12 ${isDark ? 'bg-accent' : 'bg-black'}`} />
          </div>

          {/* Luxury Subtitle & Metadata */}
          <div className="mt-20 flex flex-col items-center gap-12 w-full max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 2.5 }}
                className="flex items-center justify-center gap-8 w-full"
              >
                 <div className="h-px flex-1 bg-linear-to-r from-transparent via-accent/30 to-transparent" />
                 <p className="font-serif italic text-lg md:text-2xl text-black/50 dark:text-white/50 tracking-wide whitespace-nowrap">
                    {t("hero_subtitle")}
                 </p>
                 <div className="h-px flex-1 bg-linear-to-r from-accent/30 to-transparent" />
              </motion.div>

              <div className="flex gap-20 md:gap-32 mt-4 relative">
                 {/* Center Line Decoration */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-px bg-accent/20" />
                 
                 <div className="flex flex-col items-center gap-2">
                    <span className="text-[32px] md:text-[44px] font-serif tracking-tighter">12y+</span>
                    <span className="text-[8px] uppercase tracking-[0.5em] opacity-40">Years Exp</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <span className="text-[32px] md:text-[44px] font-serif tracking-tighter">450+</span>
                    <span className="text-[8px] uppercase tracking-[0.5em] opacity-40">Masterpieces</span>
                 </div>
              </div>

              {/* Ultra-Minimal Scroll Indicator */}
              <motion.div
                onClick={() => {
                  const section = document.getElementById("philosophySection");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="cursor-pointer group flex flex-col items-center gap-6 mt-12"
              >
                 <div className="w-[1px] h-20 bg-linear-to-b from-accent to-transparent relative overflow-hidden">
                    <motion.div 
                      animate={{ top: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1/2 bg-white dark:bg-black opacity-40" 
                    />
                 </div>
                 <span className="text-[9px] tracking-[0.8em] uppercase font-bold text-accent">Explore</span>
              </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Technical Metadata ─── */}
      <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-2 opacity-30 mix-blend-difference">
         <span className="text-[7px] font-mono tracking-widest uppercase">Building Architecture / Psychology / Design</span>
         <span className="text-[7px] font-mono tracking-widest uppercase">© Kasra Padyab Vault MMXXVI</span>
      </div>

      {/* ─── Scroll Indicator ─── */}
      <div
        ref={scrollRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer opacity-0 group"
        onClick={() => {
          const section = document.getElementById("philosophySection") || document.getElementById("expertiseSection");
          section?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span
          className={`text-[10px] tracking-[0.6em] uppercase transition-colors ${isDark ? 'text-white/40 group-hover:text-accent' : 'text-black/40 group-hover:text-accent'}`}
        >
          {t("scroll_explore")}
        </span>
        <div
          className={`w-px h-20 relative overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
        >
          <motion.div
            animate={{
              y: ["-100%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-full bg-accent"
          />
        </div>
      </div>

      {/* Side Navigation Markers */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-8 items-center">
        {HERO_IMAGES.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentImageIndex(i)}
            className={`w-1 h-8 transition-all duration-500 ${i === currentImageIndex ? "bg-accent scale-y-150" : isDark ? "bg-white/20 hover:bg-white/40" : "bg-black/10 hover:bg-black/20"}`}
          />
        ))}
      </div>

      <style jsx global>{`
        .font-fa .font-serif {
          font-family: var(--font-arabic) !important;
          font-weight: 700;
        }
        .font-fa .tracking-[-0.04em] {
          letter-spacing: 0 !important;
        }
      `}</style>
    </section>
  );
}
