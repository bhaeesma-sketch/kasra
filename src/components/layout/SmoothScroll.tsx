"use client";

import { ReactLenis } from "lenis/react";
import { Suspense } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </ReactLenis>
  );
}
