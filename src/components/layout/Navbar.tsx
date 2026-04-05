"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";

import Image from "next/image";

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
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 text-black dark:text-white",
        scrolled ? "py-2" : "py-4",
        mobileMenuOpen ? "bg-white dark:bg-neutral-950 h-screen py-4" : ""
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col relative max-w-7xl">
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-[-4px] left-4 md:left-6 right-4 md:right-6 h-[1.5px] bg-black/5 dark:bg-white/5 overflow-hidden rounded-full">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${mounted ? Math.min((typeof window !== 'undefined' ? window.scrollY : 0) / (typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1) * 100, 100) : 0}%` }}
          />
        </div>
        <div className="glass shadow-sm dark:shadow-none px-4 md:px-5 py-2.5 rounded-full flex justify-between items-center bg-white/60 dark:bg-black/60 border border-neutral-200 dark:border-white/10 backdrop-blur-md">
          <a href="/" className="nav-item flex items-center h-8 md:h-10 group shrink-0">
            <Image 
              src="/assets/new-branding-logo.png" 
              alt="KASRAPADYAB" 
              width={180} 
              height={36} 
              className="h-full w-auto object-contain transition-all duration-700 group-hover:scale-105 dark:invert" 
              priority
            />
          </a>
          
          <div className="hidden lg:flex gap-3 xl:gap-5 items-center text-[7.5px] xl:text-[8px] tracking-[0.2em] uppercase font-semibold text-black dark:text-white">
            {navLinks.map((link) => (
              <a key={link.key} href={link.href} className="nav-item hover:text-accent transition-colors whitespace-nowrap">
                {link.key}
              </a>
            ))}
          </div>

          <div className="nav-item flex items-center gap-1.5 text-xs font-semibold shrink-0">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              </button>
            )}
            <div className="flex gap-1 ml-1 scale-75 md:scale-90">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-colors text-[9px]",
                  language === "en" ? "bg-accent text-white" : "hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("fa")}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-colors text-[9px]",
                  language === "fa" ? "bg-accent text-white" : "hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                FA
              </button>
            </div>
            
            <button 
              className="lg:hidden ml-1 w-8 h-8 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
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
      </div>
    </nav>
  );
}
