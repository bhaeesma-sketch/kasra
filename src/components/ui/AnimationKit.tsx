"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ─── Fade Up with stagger ────────────────────────────────────────────────────
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Reveal line (slides in from left) ──────────────────────────────────────
export function RevealLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`h-px ${className}`}
      initial={{ scaleX: 0, transformOrigin: "left" }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

// ─── Section heading with number badge ───────────────────────────────────────
export function SectionHeading({
  number,
  title,
  className = "",
}: {
  number?: string;
  title: string;
  className?: string;
}) {
  return (
    <FadeUp className={className}>
      <div className="flex items-baseline gap-4 mb-3">
        {number && (
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-accent/70">
            {number}
          </span>
        )}
      </div>
      <h2 className="text-3xl md:text-5xl font-serif text-black dark:text-white uppercase tracking-widest leading-tight">
        {title}
      </h2>
      <RevealLine className="bg-black/10 dark:bg-white/10 mt-6" />
    </FadeUp>
  );
}

// ─── Magnetic button wrapper ─────────────────────────────────────────────────
export function MagneticBtn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Horizontal scroll text ticker ──────────────────────────────────────────
export function TextTicker({ text, speed = 20 }: { text: string; speed?: number }) {
  const items = Array(6).fill(text);
  return (
    <div className="overflow-hidden w-full py-4 border-y border-black/5 dark:border-white/5 select-none">
      <motion.div
        className="flex whitespace-nowrap gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} className="text-sm tracking-[0.3em] uppercase font-light text-black/30 dark:text-white/30 shrink-0">
            {t} <span className="text-accent mx-3">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Image parallax card ─────────────────────────────────────────────────────
export function ParallaxCard({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  const y = useMotionValue(0);
  const yTransform = useTransform(y, [-100, 100], ["10%", "-10%"]);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const onScroll = () => {
      const rect = element.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const offset = (center - (rect.top + rect.height / 2)) / window.innerHeight;
      y.set(offset * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [y]);

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ y: yTransform, scale: 1.15 }}
        suppressHydrationWarning
      />
    </motion.div>
  );
}
