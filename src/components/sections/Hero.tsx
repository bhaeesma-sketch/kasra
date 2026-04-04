"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";

function WarmGlassSculpture({ theme }: { theme: string | undefined }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      
      // Magnetic mouse reaction
      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;
      
      gsap.to(meshRef.current.position, {
        x: mouseX * 0.8,
        y: mouseY * 0.8,
        duration: 3,
        ease: "power2.out",
      });
      
      gsap.to(meshRef.current.rotation, {
        z: mouseX * 0.4,
        duration: 2,
        ease: "power2.out",
      });
    }

    if (lightRef.current) {
      // Pulsing calmly
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 1.5) * 1.5;
    }
  });

  const isLight = theme === 'light';

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        {/* Smooth, high-poly shape for polished stone/glass look */}
        <icosahedronGeometry args={[2.8, 12]} />
        <MeshTransmissionMaterial 
          backside
          backsideThickness={2}
          thickness={3}
          roughness={0.15}
          transmission={1}
          ior={1.4}
          chromaticAberration={0.05}
          anisotropy={0.3}
          resolution={1024}
          color={isLight ? "#e0b28e" : "#ffccaa"} // Warm stone/glass tint
          attenuationDistance={3}
          attenuationColor={isLight ? "#ffffff" : "#000000"}
        />
      </mesh>
      {/* Emanating inner light */}
      <pointLight ref={lightRef} position={[0, 0, 0]} color={isLight ? "#ffddcc" : "#ffb888"} distance={15} decay={2} />
    </Float>
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
        { y: 150, opacity: 0, scale: 0.9, filter: "blur(10px)" },
        { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "expo.out", delay: 0.2 }
      ).fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0, filter: "blur(5px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" },
        "-=1.5"
      );
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-neutral-100 dark:bg-[#0a0a0a]">
      {/* 3D Background Sculpture */}
      <div className="absolute inset-0 z-0 select-none">
        {canvasReady && (
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={resolvedTheme === 'light' ? 0.8 : 0.3} />
            <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" />
            <Environment preset="city" />
            <WarmGlassSculpture theme={resolvedTheme} />
          </Canvas>
        )}
      </div>

      {/* Typography layer overlapping sculpture */}
      <div className="relative z-10 text-center flex flex-col items-center pointer-events-none">
        <div className="overflow-visible pb-4 px-4">
          <h1 
            ref={titleRef} 
            className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter uppercase text-black dark:text-white drop-shadow-2xl mix-blend-overlay dark:mix-blend-normal"
            style={{ textShadow: resolvedTheme === 'dark' ? '0 10px 40px rgba(0,0,0,0.8)' : '0 10px 40px rgba(255,255,255,0.8)' }}
          >
            {t("hero_title")}
          </h1>
        </div>
        <div className="overflow-visible">
          <p 
            ref={subtitleRef} 
            className="text-sm md:text-xl font-light tracking-[0.4em] uppercase text-black/70 dark:text-white/70 mt-4 backdrop-blur-sm px-6 py-2 rounded-full border border-black/5 dark:border-white/10"
          >
            {t("hero_subtitle")}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer text-black/60 dark:text-white/60 pointer-events-auto hover:text-black dark:hover:text-white transition-colors" data-cursor="hover" onClick={() => document.getElementById('design-team')?.scrollIntoView({behavior: 'smooth'})}>
        <span className="text-[10px] uppercase tracking-widest font-serif">
          {t("scroll_explore")}
        </span>
        <div className="w-[1px] h-16 bg-black/10 dark:bg-white/10 relative overflow-hidden">
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
