"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // We check if it's a touch device to avoid rendering the cursor
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      cursor.style.display = "none";
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1, // very fast follow
        ease: "power2.out",
      });
    };

    const linkHoverParams = { scale: 3, duration: 0.3, ease: "power2.out" };
    const linkLeaveParams = { scale: 1, duration: 0.3, ease: "power2.out" };

    const onMouseEnterLink = () => gsap.to(cursor, linkHoverParams);
    const onMouseLeaveLink = () => gsap.to(cursor, linkLeaveParams);

    const onMouseDown = () => gsap.to(cursor, { scale: 0.8, duration: 0.1 });
    const onMouseUp = () => gsap.to(cursor, { scale: 1, duration: 0.1 });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Add listeners to all interactive elements
    const addListeners = () => {
      const interactives = document.querySelectorAll("a, button, input, textarea, [data-cursor='hover']");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterLink);
        el.addEventListener("mouseleave", onMouseLeaveLink);
      });
    };

    addListeners();

    // Re-bind listeners when new elements might be added (naive approach with mutation observer)
    const observer = new MutationObserver(() => {
      addListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999]"
      style={{
        transform: "translate(-50%, -50%)",
        mixBlendMode: "difference",
      }}
    />
  );
}
