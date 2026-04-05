"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        "fixed top-0 left-0 w-full z-50 transition-all duration-700 text-black dark:text-white border-b border-black/5 dark:border-white/5",
        scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl py-4" : "bg-transparent py-8",
        mobileMenuOpen ? "bg-white dark:bg-neutral-950 h-screen" : ""
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between max-w-[1600px]">
        {/* Logo Section */}
        <Link href="/" className="flex items-center group relative z-50">
          <div className="overflow-hidden h-8 md:h-9">
            <Image 
              src="/assets/new-branding-logo.png" 
              alt="KASRAPADYAB" 
              width={180} 
              height={36} 
              className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-110 dark:invert" 
              priority
            />
          </div>
          <div className="absolute -bottom-2 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-12">
          <div className="flex gap-6 xl:gap-10 items-center text-[8px] xl:text-[9px] tracking-[0.3em] uppercase font-semibold">
            {navLinks.map((link) => (
              <a 
                key={link.key} 
                href={link.href} 
                className="relative py-2 hover:text-accent transition-colors duration-300 group"
              >
                {link.key}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-2" />

          {/* Controls */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-accent"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "text-[9px] tracking-widest transition-all duration-300",
                  language === "en" ? "text-accent font-bold scale-110" : "opacity-40 hover:opacity-100"
                )}
              >
                EN
              </button>
              <span className="text-[8px] opacity-20">/</span>
              <button
                onClick={() => setLanguage("fa")}
                className={cn(
                  "text-[9px] tracking-widest transition-all duration-300",
                  language === "fa" ? "text-accent font-bold scale-110" : "opacity-40 hover:opacity-100"
                )}
              >
                FA
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center group"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="flex flex-col gap-1.5 items-end">
            <span className={cn("h-px bg-current transition-all duration-300", mobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6")} />
            <span className={cn("h-px bg-current transition-all duration-300", mobileMenuOpen ? "opacity-0" : "w-4")} />
            <span className={cn("h-px bg-current transition-all duration-300", mobileMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5")} />
          </div>
        </button>
      </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="flex-1 flex flex-col justify-center items-center gap-6 mt-8">
            {navLinks.map((link) => (
              <a 
                key={link.key} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold tracking-widest uppercase hover:text-red-600 transition-colors"
              >
                {link.key}
              </a>
            ))}
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setLanguage("en"); setMobileMenuOpen(false); }}
                className={cn(
                  "px-6 py-2 rounded-full font-bold",
                  language === "en" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-neutral-200 dark:border-neutral-800"
                )}
              >
                English
              </button>
              <button
                onClick={() => { setLanguage("fa"); setMobileMenuOpen(false); }}
                className={cn(
                  "px-6 py-2 rounded-full font-bold",
                  language === "fa" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-neutral-200 dark:border-neutral-800"
                )}
              >
                فارسی
              </button>
            </div>
          </div>
        )}
    </nav>
  );
}
