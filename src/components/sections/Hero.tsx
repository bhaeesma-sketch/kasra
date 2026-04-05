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

      {/* Cinematic Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.25, filter: "brightness(0.5) contrast(1.2)" }}
            animate={{ 
              opacity: 1, 
              scale: 1.1,
              filter: "brightness(0.7) contrast(1.1)",
              x: mousePos.x * -15,
              y: mousePos.y * -15
            }}
            exit={{ opacity: 0, scale: 1, filter: "blur(40px) brightness(0.2)" }}
            transition={{ 
              opacity: { duration: 3, ease: "easeInOut" },
              scale: { duration: 6, ease: "circOut" },
              x: { duration: 2.5, ease: "easeOut" },
              y: { duration: 2.5, ease: "easeOut" }
            }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGES[currentImageIndex]}
              alt="Architectural Luxury"
              fill
              priority
              className="object-cover grayscale-25"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Luxury Vignette & Depth */}
        <div className={`absolute inset-0 z-[1] ${isDark ? 'bg-radial-to-c from-transparent via-black/20 to-black/90' : 'bg-radial-to-c from-transparent via-white/10 to-white/70'}`} />
        <div className={`absolute inset-0 z-[1] ${isDark ? 'bg-linear-to-b from-black/60 via-transparent to-black/80' : 'bg-linear-to-b from-white/30 via-transparent to-white/50'}`} />
        
        {/* Animated Light Leak / Shine */}
        <motion.div 
          animate={{
            x: [mousePos.x * 100, mousePos.x * -100],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[60vw] h-full z-[2] pointer-events-none skew-x-[-35deg]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${isDark ? 'rgba(200, 168, 130, 0.08)' : 'rgba(100, 70, 30, 0.05)'} 50%, transparent 100%)`
          }}
        />
      </div>

      {/* ─── Architectural Grid Decoration ─── */}
      <div className={`absolute inset-0 z-[3] pointer-events-none overflow-hidden ${isDark ? 'opacity-20' : 'opacity-[0.12]'}`}>
        <div className={`absolute top-0 left-0 w-full h-[0.5px] ${isDark ? 'bg-accent/40' : 'bg-accent/60'} transform translate-y-[15vh]`} />
        <div className={`absolute bottom-0 left-0 w-full h-[0.5px] ${isDark ? 'bg-accent/40' : 'bg-accent/60'} transform -translate-y-[15vh]`} />
        <div className={`absolute left-0 top-0 w-[0.5px] h-full ${isDark ? 'bg-accent/40' : 'bg-accent/60'} transform translate-x-[12vw]`} />
        <div className={`absolute right-0 top-0 w-[0.5px] h-full ${isDark ? 'bg-accent/40' : 'bg-accent/60'} transform -translate-x-[12vw]`} />
        
        <div className={`absolute top-[15vh] left-[12vw] text-[9px] tracking-[0.8em] font-light p-6 uppercase ${isDark ? 'text-accent/60' : 'text-accent/80'}`}>
          Collection . 026 / Architecture & Design
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 text-center flex flex-col items-center select-none" style={{ perspective: "2000px" }}>
        <motion.div 
          initial={{ opacity: 0, letterSpacing: "1.5em", y: -20 }}
          animate={{ opacity: 0.6, letterSpacing: "0.8em", y: 0 }}
          transition={{ duration: 2, ease: "expo.out", delay: 1.5 }}
          className="text-[10px] uppercase font-light text-black dark:text-white mb-12"
        >
          {language === 'en' ? 'Pioneering Future Spaces' : 'پیشگام فضاهای آینده'}
        </motion.div>

        <h1
          ref={titleRef}
          className="font-serif leading-[0.9] tracking-[-0.05em] uppercase"
          style={{
            fontSize: "clamp(4rem, 15vw, 13rem)",
            color: isDark ? "#fdfcf9" : "#1a120b",
          }}
        >
          {t("hero_title")}
        </h1>

        <div className="mt-8 flex items-center justify-center gap-6 overflow-hidden">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "expo.inOut", delay: 2 }}
            className="w-16 h-[0.5px] bg-accent/40 origin-left" 
          />
          <p
            ref={subtitleRef}
            className="font-serif italic tracking-widest text-black/60 dark:text-white/60"
            style={{ fontSize: "clamp(0.8rem, 2vw, 1.2rem)" }}
          >
            {t("hero_subtitle")}
          </p>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "expo.inOut", delay: 2 }}
            className="w-16 h-[0.5px] bg-accent/40 origin-right" 
          />
        </div>

        <div ref={taglineRef} className="mt-20 flex flex-col items-center gap-10 opacity-0">
          <div className="flex gap-16 md:gap-24 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />
            
            <div className="flex flex-col items-center group cursor-pointer" data-cursor="hover">
              <span className="text-[28px] font-serif transition-colors group-hover:text-accent duration-500">12</span>
              <span className="text-[8px] uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-all duration-500">Years Exp</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer" data-cursor="hover">
              <span className="text-[28px] font-serif transition-colors group-hover:text-accent duration-500">450</span>
              <span className="text-[8px] uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-all duration-500">Projects</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer" data-cursor="hover">
              <span className="text-[28px] font-serif transition-colors group-hover:text-accent duration-500">25</span>
              <span className="text-[8px] uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-all duration-500">Awards</span>
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] tracking-[0.6em] uppercase text-accent font-medium mt-4"
          >
            Design . Psychology . Innovation
          </motion.div>
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
