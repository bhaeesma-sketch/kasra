"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { key: "Design Team", href: "#design-team" },
    { key: "Classes", href: "#classes" },
    { key: "Interviews", href: "#interviews" },
    { key: "Lectures", href: "#lectures" },
    { key: "Awards", href: "#awards" },
    { key: "Researches", href: "#researches" },
    { key: "Projects", href: "#projects" },
    { key: "Sketches", href: "#sketches" },
    { key: "Join us", href: "#join-us" },
    { key: "Contact us", href: "#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 w-full lg:w-fit z-100 transition-all duration-1000",
        scrolled ? "bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.1)]" : "bg-transparent py-10"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-end">
        
        {/* Desktop Navigation - Clean Editorial Look */}
        <div className="hidden lg:flex items-center gap-12">
          <div className="flex gap-10 items-center text-[8.5px] tracking-[0.4em] uppercase font-bold text-black dark:text-white">
            {navLinks.slice(0, 6).map((link) => (
              <a 
                key={link.key} 
                href={link.href} 
                className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-700 relative group"
              >
                {link.key}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-linear-to-r from-transparent via-amber-500 to-transparent transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </a>
            ))}
          </div>

          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

          {/* Controls */}
          <div className="flex items-center gap-6">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-accent hover:scale-110 transition-transform"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
            
            <div className="flex items-center gap-3 text-[9px] font-bold tracking-widest text-black/40 dark:text-white/40">
              <button
                onClick={() => setLanguage("en")}
                className={cn("transition-all", language === "en" && "text-accent scale-110")}
              >
                EN
              </button>
              <span>/</span>
              <button
                onClick={() => setLanguage("fa")}
                className={cn("transition-all", language === "fa" && "text-accent scale-110")}
              >
                FA
              </button>
            </div>

            <Link 
              href="#contact"
              className="group relative overflow-hidden bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-[8.5px] uppercase tracking-[0.4em] font-bold transition-all duration-700"
            >
               <div className="absolute inset-0 w-full h-full bg-linear-to-r from-amber-600 via-amber-400 to-amber-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out z-0" />
               <span className="relative z-10 group-hover:text-black transition-colors duration-700">
                 {language === 'en' ? 'Get in Touch' : 'ارتباط با ما'}
               </span>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-10 h-10 flex items-center justify-center relative z-110"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="flex flex-col gap-2 items-end">
            <span className={cn("h-px bg-current transition-all duration-300", mobileMenuOpen ? "w-6 rotate-45 translate-y-2.5" : "w-6")} />
            <span className={cn("h-px bg-current transition-all duration-300", mobileMenuOpen ? "opacity-0" : "w-4")} />
            <span className={cn("h-px bg-current transition-all duration-300", mobileMenuOpen ? "w-6 -rotate-45 -translate-y-2.5" : "w-5")} />
          </div>
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white dark:bg-black z-105 flex flex-col p-12 justify-center"
          >
             <div className="flex flex-col gap-10">
                {navLinks.map((link, idx) => (
                  <motion.a 
                    key={link.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-serif uppercase tracking-tight hover:text-accent"
                  >
                    {link.key}
                  </motion.a>
                ))}
             </div>
             
             <div className="mt-20 flex gap-8 text-sm uppercase tracking-[0.4em] text-black/40 dark:text-white/40">
                <button onClick={() => setLanguage("en")} className={cn(language === 'en' && "text-accent")}>English</button>
                <button onClick={() => setLanguage("fa")} className={cn(language === 'fa' && "text-accent")}>Persian</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
