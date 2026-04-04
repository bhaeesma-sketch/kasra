"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Footer() {
  const { t } = useLanguage();
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    // Split text for liquid/wave effect
    const chars = text.innerText.split("");
    text.innerHTML = "";
    chars.forEach((char) => {
      const span = document.createElement("span");
      span.innerText = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.transition = "transform 0.3s ease-out";
      text.appendChild(span);
    });

    const spans = text.childNodes;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = text.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      
      Array.from(spans).forEach((span: Node) => {
        const el = span as HTMLElement;
        const spanRect = el.getBoundingClientRect();
        const spanCenterX = spanRect.left - rect.left + spanRect.width / 2;
        
        // Calculate distance from mouse to letter
        const dist = Math.abs(relativeX - spanCenterX);
        const maxDist = 100; // effect radius
        
        if (dist < maxDist) {
          // Calculate wave intensity based on distance
          const intensity = 1 - Math.pow(dist / maxDist, 2);
          gsap.to(el, {
            y: -15 * intensity,
            scaleY: 1 + (0.5 * intensity),
            color: "#d4af37", // Gold accent
            duration: 0.2,
            ease: "power1.out",
          });
        } else {
          gsap.to(el, {
            y: 0,
            scaleY: 1,
            color: "white",
            duration: 0.5,
            ease: "bounce.out",
          });
        }
      });
    };

    const handleMouseLeave = () => {
      Array.from(spans).forEach((span: Node) => {
        const el = span as Element;
        gsap.to(el, {
          y: 0,
          scaleY: 1,
          color: "white",
          duration: 0.5,
          ease: "bounce.out",
        });
      });
    };

    text.addEventListener("mousemove", handleMouseMove);
    text.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      text.removeEventListener("mousemove", handleMouseMove);
      text.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <footer id="contact" className="w-full bg-[#050505] text-white py-16 md:py-24 px-8 overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 
            ref={textRef}
            className="text-4xl md:text-6xl font-serif uppercase tracking-tighter cursor-pointer mb-8"
            data-cursor="hover"
          >
            {t("get_in_touch")}
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12 mt-8 w-full justify-between border-t border-white/10 pt-8">
            <div className="text-left font-serif">
              <p className="text-white/60 mb-2">Email</p>
              <a href="mailto:contact@kasrapadyab.com" className="text-2xl hover:text-accent transition-colors" data-cursor="hover">contact@kasrapadyab.com</a>
            </div>
            
            <div className="flex gap-8 text-sm uppercase tracking-widest font-sans">
              <a href="#" className="hover:text-accent transition-colors" data-cursor="hover">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors" data-cursor="hover">LinkedIn</a>
              <a href="#" className="hover:text-accent transition-colors" data-cursor="hover">Resume</a>
            </div>

            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="glass px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs"
              data-cursor="hover"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
