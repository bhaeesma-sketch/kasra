"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

// ─── Lightweight Architectural 3D Element ────────────────────────────────────
// Uses MeshStandardMaterial (GPU-cheap). No transmission, no offscreen pass.
function ArchGrid() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Track pointer inside canvas
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Slow base auto-rotation
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.04;
    // Smooth magnetic mouse tilt
    groupRef.current.rotation.x += (mouse.current.y * 0.3 - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.z += (-mouse.current.x * 0.15 - groupRef.current.rotation.z) * 0.03;
  });

  // Build an architectural wireframe: a dodecahedron (12-faced, very architectural)
  // plus a few orbiting thin rings — looks like a structural diagram / blueprint
  const dodecGeo = new THREE.DodecahedronGeometry(2.2, 0);
  const edgesGeo = new THREE.EdgesGeometry(dodecGeo);

  const ringGeo1 = new THREE.TorusGeometry(3.2, 0.012, 4, 64);
  const ringGeo2 = new THREE.TorusGeometry(2.6, 0.008, 4, 64);
  const ringGeo3 = new THREE.TorusGeometry(3.8, 0.006, 4, 64);

  return (
    <group ref={groupRef}>
      {/* Core wireframe dodecahedron */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#c8a882" transparent opacity={0.6} />
      </lineSegments>

      {/* Glowing solid inner core — very cheap MeshStandardMaterial */}
      <mesh>
        <dodecahedronGeometry args={[2.15, 0]} />
        <meshStandardMaterial
          color="#1a1008"
          emissive="#3d1f06"
          emissiveIntensity={0.8}
          roughness={0.7}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Orbiting architectural rings */}
      <mesh geometry={ringGeo1} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#a0784a" transparent opacity={0.35} />
      </mesh>
      <mesh geometry={ringGeo2} rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <meshBasicMaterial color="#c8a882" transparent opacity={0.25} />
      </mesh>
      <mesh geometry={ringGeo3} rotation={[Math.PI / 3, Math.PI / 8, 0]}>
        <meshBasicMaterial color="#8a6030" transparent opacity={0.18} />
      </mesh>

      {/* Particle dots at vertices */}
      {dodecGeo.getAttribute("position") && (() => {
        const positions = dodecGeo.getAttribute("position") as THREE.BufferAttribute;
        const pts: [number, number, number][] = [];
        const seen = new Set<string>();
        for (let i = 0; i < positions.count; i++) {
          const x = parseFloat(positions.getX(i).toFixed(2));
          const y = parseFloat(positions.getY(i).toFixed(2));
          const z = parseFloat(positions.getZ(i).toFixed(2));
          const key = `${x},${y},${z}`;
          if (!seen.has(key)) { seen.add(key); pts.push([x, y, z]); }
        }
        return pts.map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshBasicMaterial color="#f0c070" />
          </mesh>
        ));
      })()}
    </group>
  );
}

// ─── Floating particle field ──────────────────────────────────────────────────
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8a882" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ─── Hero Component ───────────────────────────────────────────────────────────
export function Hero() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    if (titleRef.current) {
      gsap.to(titleRef.current, { x: x * 0.3, y: y * 0.2, duration: 1.5, ease: "power2.out" });
    }
    if (subtitleRef.current) {
      gsap.to(subtitleRef.current, { x: x * 0.1, y: y * 0.08, duration: 2, ease: "power2.out" });
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setCanvasReady(true);
      
      // Entry cinematic sequence
      const tl = gsap.timeline({ delay: 0.1 });
      
      // Overlay wipe
      tl.to(overlayRef.current, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        ease: "expo.inOut",
      });

      // Title chars stagger
      if (titleRef.current) {
        const text = titleRef.current.textContent || "";
        titleRef.current.innerHTML = text.split("").map((c) =>
          c === " " ? " " : `<span class="inline-block will-change-transform">${c}</span>`
        ).join("");
        tl.fromTo(
          titleRef.current.querySelectorAll("span"),
          { y: 120, opacity: 0, rotateX: -90 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: "expo.out", stagger: 0.035 },
          "-=0.6"
        );
      }

      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" },
        "-=0.4"
      );

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );

      tl.fromTo(
        scrollRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
    });

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const isDark = resolvedTheme === "dark";

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ background: isDark ? "#080604" : "#f5f0eb" }}
    >
      {/* Intro overlay wipe */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-30"
        style={{ background: isDark ? "#080604" : "#f5f0eb", transformOrigin: "top" }}
      />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px"
        }}
      />

      {/* 3D Canvas — architectural wireframe, GPU-efficient */}
      <div className="absolute inset-0 z-0">
        {canvasReady && (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={Math.min(window.devicePixelRatio, 1.5)} // cap DPR for performance
          >
            <ambientLight intensity={isDark ? 0.4 : 0.9} color={isDark ? "#c8a882" : "#fff8f0"} />
            <directionalLight position={[5, 8, 5]} intensity={isDark ? 1.2 : 1.8} color="#ffeecc" />
            <pointLight position={[-5, -5, 3]} intensity={isDark ? 0.6 : 0.3} color="#8060a0" />
            <ArchGrid />
            <ParticleField />
          </Canvas>
        )}
      </div>

      {/* ─── Horizontal rule decorations ────────────────────────────── */}
      <div className="absolute top-[22%] left-0 right-0 z-10 flex items-center gap-6 px-12 pointer-events-none opacity-30">
        <div className="flex-1 h-px" style={{ background: isDark ? "rgba(200,168,130,0.4)" : "rgba(100,70,30,0.3)" }} />
        <span className="text-[9px] tracking-[0.5em] uppercase font-light" style={{ color: isDark ? "#c8a882" : "#8a6030" }}>
          Architecture & Design
        </span>
        <div className="flex-1 h-px" style={{ background: isDark ? "rgba(200,168,130,0.4)" : "rgba(100,70,30,0.3)" }} />
      </div>

      {/* ─── Main typography ────────────────────────────────────────── */}
      <div className="relative z-10 text-center flex flex-col items-center select-none" style={{ perspective: "1200px" }}>
        <div className="overflow-hidden pb-2">
          <h1
            ref={titleRef}
            className="font-serif leading-none tracking-[-0.03em] uppercase"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              color: isDark ? "#f5ede0" : "#1a0f05",
              textShadow: isDark
                ? "0 0 80px rgba(200,130,50,0.15)"
                : "0 4px 40px rgba(100,60,10,0.12)",
            }}
          >
            {t("hero_title")}
          </h1>
        </div>

        <p
          ref={subtitleRef}
          className="font-light uppercase tracking-[0.5em] mt-4"
          style={{
            fontSize: "clamp(0.65rem, 1.5vw, 0.9rem)",
            color: isDark ? "rgba(200,168,130,0.7)" : "rgba(100,70,30,0.65)",
            letterSpacing: "0.5em",
          }}
        >
          {t("hero_subtitle")}
        </p>

        <div ref={taglineRef} className="mt-10 flex items-center gap-5 opacity-0">
          <div className="w-8 h-px" style={{ background: isDark ? "rgba(200,168,130,0.5)" : "rgba(120,80,30,0.4)" }} />
          <span
            className="text-[10px] tracking-[0.35em] uppercase font-light"
            style={{ color: isDark ? "rgba(200,168,130,0.6)" : "rgba(100,70,30,0.55)" }}
          >
            Architectural Psychology
          </span>
          <div className="w-8 h-px" style={{ background: isDark ? "rgba(200,168,130,0.5)" : "rgba(120,80,30,0.4)" }} />
        </div>
      </div>

      {/* ─── Scroll indicator ───────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer opacity-0"
        data-cursor="hover"
        onClick={() => document.getElementById("design-team")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span
          className="text-[9px] tracking-[0.5em] uppercase"
          style={{ color: isDark ? "rgba(200,168,130,0.45)" : "rgba(100,70,30,0.45)" }}
        >
          {t("scroll_explore")}
        </span>
        <div
          className="w-px h-14 relative overflow-hidden"
          style={{ background: isDark ? "rgba(200,168,130,0.12)" : "rgba(100,70,30,0.12)" }}
        >
          <div
            className="absolute inset-0 w-full"
            style={{
              background: isDark ? "#c8a882" : "#8a6030",
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
