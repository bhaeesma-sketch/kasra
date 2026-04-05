"use client";

import { useLanguage } from "@/context/LanguageContext";
import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useTheme } from "next-themes";
import Image from "next/image";
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

      {/* ─── Cinematic Background Slider ─── */}
      <div className="absolute inset-0 z-0 flex flex-col lg:flex-row h-full">
        {/* Left Panel: Dynamic Background */}
        <div className="w-full lg:w-3/5 h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ scale: 1.3, x: -50, opacity: 0 }}
              animate={{ 
                scale: 1, 
                x: mousePos.x * -30, 
                y: mousePos.y * -20,
                opacity: 1 
              }}
              exit={{ scale: 0.9, x: 50, opacity: 0, filter: "blur(40px)" }}
              transition={{ duration: 3.5, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={HERO_IMAGES[currentImageIndex]}
                alt="Architectural Vision"
                fill
                priority
                className="object-cover"
              />
              <div className={`absolute inset-0 ${isDark ? 'bg-black/30' : 'bg-white/10'}`} />
            </motion.div>
          </AnimatePresence>
          
          {/* Animated Noise & Grain for Texture */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        </div>

        {/* Right Panel: Clean Space */}
        <div className={`hidden lg:block lg:w-2/5 h-full ${isDark ? 'bg-neutral-950' : 'bg-[#FDFCF9]'} border-l border-black/5 dark:border-white/5 transition-colors duration-1000`} />
      </div>

      {/* ─── Logo Centric Intro (Luxury Reveal) ─── */}
      <div className="absolute top-12 left-12 z-50 overflow-hidden">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 2, ease: "expo.out", delay: 1 }}
        >
          <Image 
            src="/assets/new-branding-logo.png" 
            alt="Logo" 
            width={220} 
            height={44} 
            className="w-40 md:w-56 dark:invert brightness-110" 
          />
        </motion.div>
      </div>

      {/* ─── Hero Main Content ─── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end lg:justify-center px-12 pb-24 lg:pb-0">
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-end lg:items-center">
          
          {/* Main Title - Spanning the split */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "expo.out", delay: 1.2 }}
                  className="text-accent text-[9px] md:text-[11px] tracking-[0.6em] uppercase font-light block ml-1"
                >
                  {language === 'en' ? 'Pioneering Human Experience' : 'پیشگام تجربه انسانی'}
                </motion.span>
             </div>

             <div className="relative">
                <h1
                  ref={titleRef}
                  className="font-serif leading-[0.85] tracking-[-0.05em] uppercase pointer-events-none"
                  style={{
                    fontSize: "clamp(5rem, 18vw, 15rem)",
                    color: isDark ? "#FFF" : "#0A0A0A",
                    marginLeft: "-0.05em" // Optical adjustment
                  }}
                >
                  {t("hero_title")}
                </h1>
                
                {/* Secondary Masked Title (Luxury Polish) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none blur-[60px] translate-y-12">
                   <span className="font-serif uppercase text-[15vw] select-none text-accent">
                      {t("hero_title")}
                   </span>
                </div>
             </div>
          </div>

          {/* Side Info Panel (Luxury Metadata) */}
          <div className="lg:col-span-4 flex flex-col gap-12 lg:pl-12">
             <motion.div 
               style={{ y: mousePos.y * -30 }}
               className="flex flex-col gap-8"
             >
                <div className="overflow-hidden">
                  <p
                    ref={subtitleRef}
                    className="text-sm md:text-xl font-light leading-relaxed max-w-sm"
                    style={{ color: isDark ? "#BBB" : "#444" }}
                  >
                    {t("hero_subtitle")}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                   <div className="h-px w-24 bg-accent/40" />
                   <div className="flex gap-12">
                      <div className="flex flex-col gap-2">
                        <span className="text-[20px] font-serif">12y+</span>
                        <span className="text-[8px] uppercase tracking-[0.4em] opacity-40">Expertise</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[20px] font-serif">450+</span>
                        <span className="text-[8px] uppercase tracking-[0.4em] opacity-40">Masterpieces</span>
                      </div>
                   </div>
                </div>

                <div
                  ref={scrollRef}
                  className="inline-flex items-center gap-6 cursor-pointer group w-fit mt-4"
                  onClick={() => {
                    const section = document.getElementById("philosophySection");
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-cursor="hover"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center border border-accent/20 rounded-full transition-all duration-700 group-hover:scale-110 group-hover:border-accent">
                    <motion.div 
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-px h-3 bg-accent"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.5em] group-hover:text-accent transition-colors duration-500">
                    {t("scroll_explore")}
                  </span>
                </div>
             </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Navigation Progress (Subtle luxury) ─── */}
      <div className="absolute bottom-12 right-12 z-50 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-accent">{`0${currentImageIndex + 1}`}</span>
          <div className="w-12 h-px bg-accent/20">
             <motion.div 
               animate={{ width: `${((currentImageIndex + 1) / HERO_IMAGES.length) * 100}%` }}
               className="h-full bg-accent" 
             />
          </div>
          <span className="text-[9px] font-mono opacity-30">{`0${HERO_IMAGES.length}`}</span>
        </div>
        
        <div className="flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${i === currentImageIndex ? "bg-accent scale-150" : "bg-black/10 dark:bg-white/10"}`}
            />
          ))}
        </div>
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
