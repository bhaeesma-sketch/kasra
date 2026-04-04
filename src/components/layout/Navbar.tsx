"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";

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
        scrolled ? "py-4" : "py-8",
        mobileMenuOpen ? "bg-white dark:bg-neutral-950 h-screen py-4" : ""
      )}
    >
      <div className="container mx-auto px-4 md:px-12 h-full flex flex-col relative">
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-4 md:left-12 right-4 md:right-12 h-px bg-black/5 dark:bg-white/5 overflow-hidden rounded-full">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${mounted ? Math.min((typeof window !== 'undefined' ? window.scrollY : 0) / (typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1) * 100, 100) : 0}%` }}
          />
        </div>
        <div className="glass shadow-sm dark:shadow-none px-4 md:px-6 py-4 rounded-full flex justify-between items-center bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-white/10 backdrop-blur-md">
          <div className="nav-item text-lg md:text-xl font-bold tracking-[0.2em] uppercase font-serif">
            <span className="text-accent">KASRA</span><span className="text-black dark:text-white ml-2">PADYAB</span>
          </div>
          
          <div className="hidden lg:flex gap-5 xl:gap-8 items-center text-[9px] tracking-[0.4em] uppercase font-medium text-black/60 dark:text-white/60">
            {navLinks.map((link) => (
              <a key={link.key} href={link.href} className="nav-item hover:opacity-70 transition-opacity whitespace-nowrap">
                {link.key}
              </a>
            ))}
          </div>

          <div className="nav-item flex items-center gap-2 text-xs font-semibold">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "hidden md:flex w-8 h-8 rounded-full items-center justify-center transition-colors",
                language === "en" ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("fa")}
              className={cn(
                "hidden md:flex w-8 h-8 rounded-full items-center justify-center transition-colors",
                language === "fa" ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              FA
            </button>
            
            <button 
              className="lg:hidden ml-2 w-8 h-8 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
