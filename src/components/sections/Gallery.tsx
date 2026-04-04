"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { cn } from "@/utils/cn";

export function Gallery() {
  const { language } = useLanguage();
  const { categories: contentCategories } = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const cards = gsap.utils.toArray(".gallery-card");
    
    cards.forEach((card: unknown) => {
      const el = card as HTMLElement;
      gsap.fromTo(el,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Parallax image
      const innerImage = el.querySelector(".card-image-inner");
      if (innerImage) {
        gsap.fromTo(innerImage,
          { y: "-10%" },
          {
            y: "10%",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }
    });

  }, []);

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const overlay = card.querySelector(".card-overlay");
    if (!overlay) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;
    
    gsap.to(card.querySelector(".card-inner-transform"), {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.5
    });
    
    gsap.to(overlay, {
      opacity: 1,
      y: 0,
      duration: 0.3
    });
  };
  
  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const overlay = card.querySelector(".card-overlay");
    
    gsap.to(card.querySelector(".card-inner-transform"), {
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
      duration: 0.5
    });
    
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        y: 20,
        duration: 0.3
      });
    }
  };

  const layoutProps = [
    { size: "large", type: "portrait" },
    { size: "medium", type: "landscape" },
    { size: "small", type: "square" },
    { size: "medium", type: "portrait" },
    { size: "large", type: "landscape" },
    { size: "small", type: "square" },
    { size: "medium", type: "portrait" },
    { size: "large", type: "landscape" },
    { size: "medium", type: "square" },
    { size: "small", type: "portrait" },
    { size: "medium", type: "landscape" },
    { size: "large", type: "portrait" },
    { size: "small", type: "square" },
    { size: "medium", type: "landscape" },
  ];

  const displayCategories = contentCategories.map((syncCat, idx) => {
    const firstItem = syncCat.items[0];
    const props = layoutProps[idx % layoutProps.length];
    return {
      titleEn: syncCat.titleEn,
      titleFa: syncCat.titleFa,
      img: firstItem ? firstItem.img : "/assets/project-1.jpg",
      size: props.size,
      type: props.type,
      id: syncCat.id
    };
  });

  return (
    <section id="portfolio" ref={sectionRef} className="relative w-full py-16 overflow-hidden transition-colors duration-500" style={{ background: 'var(--bg-main)' }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 masonry-grid items-start">
          {displayCategories.map((cat, i) => (
            <div 
              key={i} 
              className={cn(
                "gallery-card w-full relative group cursor-pointer",
                cat.size === "large" ? "lg:col-span-2" : "",
                cat.type === "portrait" ? "aspect-3/4" : cat.type === "landscape" ? "aspect-video" : "aspect-square",
                i % 2 !== 0 ? "md:mt-12" : ""
              )}
              onMouseMove={handleCardHover}
              onMouseLeave={handleCardLeave}
              onClick={() => {
                 const el = document.getElementById(cat.id);
                 if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              data-cursor="hover"
            >
              <div className="card-inner-transform w-full h-full relative perspective-1000">
                <div className="w-full h-full relative overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-900 border border-black/5 dark:border-white/10">
                  <div className="absolute inset-[-15%] w-[130%] h-[130%]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      suppressHydrationWarning
                      src={cat.img} 
                      alt={cat.titleEn} 
                      className="card-image-inner w-full h-full object-cover filter saturate-50 dark:saturate-0 brightness-90 dark:brightness-75 transition-all duration-700 group-hover:saturate-100 group-hover:brightness-100 dark:group-hover:brightness-100 scale-100 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Overlay background */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Glassmorphic Popup overlay */}
                  <div className="card-overlay absolute bottom-4 inset-x-4 glass dark:glass-dark border border-white/20 p-4 opacity-0 translate-y-4 transition-all duration-300 pointer-events-none rounded-lg text-black dark:text-white flex flex-col justify-end">
                    <span className="text-accent text-xs tabular-nums tracking-widest font-serif mb-1 block">{`0${i + 1}`}</span>
                    <h3 className="text-lg md:text-xl font-serif text-white leading-tight">{language === "en" ? cat.titleEn : cat.titleFa}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
