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
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ 
              opacity: 1, 
              scale: 1.05,
              x: mousePos.x * -10,
              y: mousePos.y * -10
            }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ 
              opacity: { duration: 2.5, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" },
              x: { duration: 2, ease: "easeOut" },
              y: { duration: 2, ease: "easeOut" }
            }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGES[currentImageIndex]}
              alt="Architectural Masterpiece"
              fill
              priority
              className="object-cover opacity-40 dark:opacity-40 grayscale-40"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Modern Layered Gradients */}
        <div className={`absolute inset-0 z-[1] ${isDark ? 'bg-linear-to-b from-black/80 via-transparent to-black/80' : 'bg-linear-to-b from-white/60 via-transparent to-white/60'}`} />
        <div className={`absolute inset-0 z-[1] ${isDark ? 'bg-linear-to-r from-black/60 via-transparent to-black/60' : 'bg-linear-to-r from-white/60 via-transparent to-white/60'}`} />
        
        {/* Moving Light Effect */}
        <motion.div 
          animate={{
            x: mousePos.x * 50,
            y: mousePos.y * 50,
          }}
          className="absolute inset-0 z-[2] opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 10}% ${50 + mousePos.y * 10}%, ${isDark ? 'rgba(200, 168, 130, 0.15)' : 'rgba(100, 70, 30, 0.15)'} 0%, transparent 60%)`
          }}
        />
      </div>

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px"
        }}
      />

      {/* ─── Architectural Grid Decoration ─── */}
      <div className={`absolute inset-0 z-[3] pointer-events-none overflow-hidden ${isDark ? 'opacity-10' : 'opacity-[0.08]'}`}>
        <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? 'bg-white' : 'bg-black'} transform translate-y-[20vh]`} />
        <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? 'bg-white' : 'bg-black'} transform translate-y-[80vh]`} />
        <div className={`absolute top-0 left-0 w-[1px] h-full ${isDark ? 'bg-white' : 'bg-black'} transform translate-x-[20vw]`} />
        <div className={`absolute top-0 left-0 w-[1px] h-full ${isDark ? 'bg-white' : 'bg-black'} transform translate-x-[80vw]`} />
        
        <div className={`absolute top-[20vh] left-[20vw] text-[10px] tracking-widest font-light p-4 uppercase ${isDark ? 'text-white' : 'text-black'}`}>
          Kasra Vault 2026 / System.01
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 text-center flex flex-col items-center select-none" style={{ perspective: "1500px" }}>
        <div className="mb-6 opacity-60">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
            className="h-px bg-accent mx-auto" 
          />
        </div>

        <h1
          ref={titleRef}
          className="font-serif leading-none tracking-[-0.04em] uppercase"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 10rem)",
            color: isDark ? "#f5ede0" : "#1a0f05",
            textShadow: isDark 
              ? "0 10px 40px rgba(0,0,0,0.4)" 
              : "0 10px 30px rgba(100, 60, 20, 0.08)",
          }}
        >
          {t("hero_title")}
        </h1>

        <p
          ref={subtitleRef}
          className="font-light uppercase tracking-[0.8em] mt-8 flex items-center gap-4"
          style={{
            fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)",
            color: isDark ? "rgba(245, 237, 224, 0.8)" : "rgba(26, 15, 5, 0.7)",
          }}
        >
          <span className={`w-8 h-[1px] ${isDark ? 'bg-accent/40' : 'bg-black/10'}`} />
          {t("hero_subtitle")}
          <span className={`w-8 h-[1px] ${isDark ? 'bg-accent/40' : 'bg-black/10'}`} />
        </p>

        <div ref={taglineRef} className="mt-12 flex flex-col items-center gap-6 opacity-0 text-black dark:text-white">
          <span
            className={`text-[11px] tracking-[0.4em] uppercase font-light ${isDark ? 'text-accent/90' : 'text-accent'}`}
          >
            Design. Psychology. Innovation.
          </span>
          
          <div className="flex gap-12 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-[20px] font-serif">12+</span>
              <span className="text-[8px] uppercase tracking-widest opacity-40">Years Exp</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[20px] font-serif">450+</span>
              <span className="text-[8px] uppercase tracking-widest opacity-40">Projects</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[20px] font-serif">25k</span>
              <span className="text-[8px] uppercase tracking-widest opacity-40">Students</span>
            </div>
          </div>
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
