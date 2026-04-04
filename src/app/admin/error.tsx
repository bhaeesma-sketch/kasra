"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Boundary Trapped Error:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", color: "#fff", padding: 24, textAlign: "center" }}>
      <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <AlertCircle size={48} color="#ef4444" />
        <h2 style={{ fontFamily: "serif", fontSize: 24, letterSpacing: 2, textTransform: "uppercase" }}>Something went wrong!</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6 }}>
          An error occurred in the Admin Dashboard. This error has been isolated so the rest of the application will not crash.
        </p>
        <button
          onClick={() => reset()}
          style={{ marginTop: 12, padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <RotateCcw size={14} /> Try Again
        </button>
      </div>
    </div>
  );
}
