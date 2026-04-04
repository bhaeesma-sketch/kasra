"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";

import * as THREE from "three";

import { useTheme } from "next-themes";
import { useState } from "react";

function AbstractShape({ theme }: { theme: string | undefined }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      
      // Slight reaction to mouse
      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;
      gsap.to(meshRef.current.rotation, {
        z: mouseX * 0.2,
        duration: 2,
        ease: "power2.out",
      });
      gsap.to(meshRef.current.position, {
        x: mouseX * 0.5,
        y: mouseY * 0.5,
        duration: 3,
        ease: "power2.out",
      });
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.5, 1]} />
      <meshBasicMaterial color={theme === 'light' ? "#000000" : "#ffffff"} wireframe transparent opacity={0.15} />
    </mesh>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    // Defer 3D canvas and GSAP until after hydration
    const raf = requestAnimationFrame(() => {
      setCanvasReady(true);
      const tl = gsap.timeline();
      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
      ).fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=1"
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {canvasReady && (
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <AbstractShape theme={resolvedTheme} />
          </Canvas>
        )}
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="overflow-hidden pb-4">
          <h1 
            ref={titleRef} 
            className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter uppercase text-black dark:text-white"
          >
            {t("hero_title")}
          </h1>
        </div>
        <div className="overflow-hidden">
          <p 
            ref={subtitleRef} 
            className="text-base md:text-xl font-light tracking-[0.3em] uppercase text-black/50 dark:text-white/50 mt-4"
          >
            {t("hero_subtitle")}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer text-black/40 dark:text-white/40" data-cursor="hover">
        <span className="text-[10px] uppercase tracking-widest">
          {t("scroll_explore")}
        </span>
        <div className="w-[1px] h-12 bg-black/20 dark:bg-white/20 relative overflow-hidden">
          <div className="w-full h-full bg-black dark:bg-white absolute top-0 left-0 animate-scroll-down" />
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-down {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-down {
          animation: scroll-down 2s infinite cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      `}</style>
    </section>
  );
}
