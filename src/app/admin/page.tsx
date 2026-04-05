"use client";

import { useState, useRef, useCallback } from "react";
import {
  Lock, Unlock, Upload, Settings, Users, LayoutTemplate,
  X, Play, ChevronLeft, Video, Check, AlertCircle
} from "lucide-react";
import { useContent, TeamMember } from "@/context/ContentContext";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

const designerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().min(2, "Country/Role must be valid"),
});

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "homepage" | "sections" | "designers" | "config";
type View = "login" | "dashboard" | "designer-detail";

interface UploadedFile {
  name: string;
  size: number;
  url: string; // base64 data URL for persistence
  type: string;
}





// ─── Reusable Media Uploader Component ───────────────────────────────────────
function MediaUploader({ label, onUpload, currentImage, acceptVideo }: {
  label: string;
  onUpload?: (file: UploadedFile) => void;
  currentImage?: string;
  acceptVideo?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedName, setUploadedName] = useState<string>("");

  const handleFile = useCallback((file: File) => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) return;
    
    // If it's a video but we don't accept video, return
    if (isVideo && !acceptVideo) {
      alert("Please upload an image file (JPG, PNG) instead of a video here.");
      return;
    }

    const name = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // If it's a video, skip canvas compression entirely, it will break
      if (isVideo) {
        setPreview(dataUrl);
        setUploadedName(name);
        onUpload?.({ name, size: file.size, url: dataUrl, type: file.type });
        toast.success("Video Upload Success");
        return;
      }

      // Compress via canvas for images
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1920;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/webp", 0.85);
        setPreview(compressed);
        setUploadedName(name);
        onUpload?.({ name, size: file.size, url: compressed, type: "image/webp" });
        toast.success("Image Upload Success");
      };
      img.onerror = () => toast.error("Server Error: Invalid Image Format");
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [onUpload, acceptVideo]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const s: React.CSSProperties = {
    border: `2px dashed ${isDragging ? "#d4af37" : preview ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.15)"}`,
    borderRadius: 12,
    background: isDragging ? "rgba(212,175,55,0.06)" : preview ? "transparent" : "rgba(0,0,0,0.3)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.2s",
    minHeight: 140,
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
        {label}
      </label>
      <div style={s}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" accept={acceptVideo ? "image/*,video/*" : "image/*"} style={{ display: "none" }} onChange={handleChange} />

        {preview ? (
          <div style={{ position: "relative" }}>
            {preview.startsWith("data:video/") || preview.endsWith(".mp4") ? (
              <video src={preview} style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} muted playsInline />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
            )}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
            >
              <Upload size={24} color="#fff" />
              <p style={{ color: "#fff", fontSize: 11, marginTop: 8, letterSpacing: 2 }}>CLICK TO REPLACE</p>
            </div>
            <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <Check size={12} color="#d4af37" />
              <span style={{ color: "#d4af37", fontSize: 10, letterSpacing: 1 }}>{uploadedName || "Image loaded"}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, gap: 10 }}>
            <Upload size={28} color="rgba(255,255,255,0.25)" />
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", textAlign: "center" }}>
              {isDragging ? "Drop image here" : "Click or drag & drop"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>{acceptVideo ? "JPG, PNG, WEBP, MP4 — Max 50MB" : "JPG, PNG, WEBP — Max 50MB — 4K recommended"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ target, onClose, onSaveImage }: {
  target: { title: string; titleFa: string; category: string } | "new";
  onClose: () => void;
  onSaveImage?: (imageUrl: string) => void;
}) {
  const isNew = target === "new";
  const data = isNew ? { title: "", titleFa: "", category: "Classes" } : target;
  const [saved, setSaved] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);

  const handleSave = () => {
    if (pendingImageUrl && onSaveImage) {
      onSaveImage(pendingImageUrl);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, width: "100%", maxWidth: 700, padding: 40, boxShadow: "0 0 80px rgba(0,0,0,0.95)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 style={{ fontFamily: "serif", fontSize: 20, letterSpacing: 4, textTransform: "uppercase" }}>
            {isNew ? "Add New Post" : `Edit: ${data.title}`}
          </h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>English Title</label>
            <input defaultValue={data.title} placeholder="Enter title..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = "#d4af37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8, textAlign: "right" }}>عنوان فارسی</label>
            <input dir="rtl" defaultValue={data.titleFa} placeholder="عنوان را وارد کنید..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = "#d4af37")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Category</label>
          <select defaultValue={data.category} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
            {["Design Team", "Classes", "Interviews", "Lectures", "Awards", "Researches", "Projects", "Sketches"].map(c => <option key={c} style={{ background: "#111" }}>{c}</option>)}
          </select>
        </div>

        <MediaUploader label="Section Image (4K Recommended)" onUpload={f => setPendingImageUrl(f.url)} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={onClose} style={{ padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave}
            style={{ padding: "12px 28px", background: saved ? "#22c55e" : "#d4af37", border: "none", borderRadius: 10, color: "#000", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.3s" }}>
            {saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [view, setView] = useState<View>("login");
  const [passcode, setPasscode] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sections");
  const [selectedDesigner, setSelectedDesigner] = useState<TeamMember | null>(null);
  const [editTarget, setEditTarget] = useState<{ title: string; titleFa: string; category: string } | "new" | null>(null);
  const [doorsOpen, setDoorsOpen] = useState(false);
  // Track which section item is being edited: { categoryId, itemIndex }
  const [editSectionEntry, setEditSectionEntry] = useState<{ categoryId: string; itemIndex: number; title: string; currentImg: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { 
    team, updateTeamMemberPhoto, updateTeamMemberDetails, addTeamMember, deleteTeamMember, 
    updateSectionItemImage, categories, 
    philosophy, updatePhilosophy, expertise, updateExpertise, updateExpertiseItem 
  } = useContent();

  const handleAddDesigner = () => {
    const name = prompt("Enter Designer Name:");
    if (!name) return;
    const country = prompt("Enter Designer Country:");
    if (!country) return;

    const validation = designerSchema.safeParse({ name, country });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    addTeamMember({
      name: validation.data.name,
      country: validation.data.country,
      role: "Designer",
      flag: "🌍",
      bio: "New team member bio...",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      videoThumb: ""
    });
    toast.success("Designer Created! You can now edit their profile.");
  };

  const handleDeleteDesigner = (name: string) => {
    if (confirm(`Are you sure you want to completely delete ${name}?`)) {
      deleteTeamMember(name);
      setView("dashboard");
      toast.success("Delete Confirmed");
    }
  };

  const CORRECT_PIN = "1994";

  const handleKeyClick = (num: string) => {
    if (passcode.length >= 4) return;
    const next = passcode + num;
    setPasscode(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        audioRef.current?.play().catch(() => {});
        setDoorsOpen(true);
        setTimeout(() => setView("dashboard"), 1600);
      } else {
        setShakeError(true);
        setTimeout(() => { setShakeError(false); setPasscode(""); }, 600);
      }
    }
  };

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (view === "login") {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#000" }}>
        <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/286/286-preview.mp3" preload="auto" />

        {/* Left vault door */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "linear-gradient(to right, #080808, #181818)", borderRight: "2px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 32, transition: "transform 1.5s cubic-bezier(0.76,0,0.24,1)", transform: doorsOpen ? "translateX(-100%)" : "translateX(0)", zIndex: 10 }}>
          <div style={{ width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #252525, #0d0d0d)", border: "2px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#0a0a0a", border: "1px solid #1f1f1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#6b0000", boxShadow: "0 0 20px rgba(180,0,0,0.8)" }} />
            </div>
          </div>
        </div>

        {/* Right vault door */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "linear-gradient(to left, #080808, #181818)", borderLeft: "2px solid #2a2a2a", transition: "transform 1.5s cubic-bezier(0.76,0,0.24,1)", transform: doorsOpen ? "translateX(100%)" : "translateX(0)", zIndex: 10 }} />

        {/* Keypad */}
        <div style={{ position: "relative", zIndex: 20, background: "rgba(8,8,8,0.97)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "44px 52px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 0 80px rgba(0,0,0,1)", transform: shakeError ? "translateX(8px)" : "translateX(0)", transition: "transform 0.1s" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Lock color="#d4af37" size={22} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "serif", letterSpacing: "0.4em", textTransform: "uppercase", fontSize: 16, marginBottom: 32 }}>System Access</p>

          {/* PIN dots */}
          <div style={{ display: "flex", gap: 14, marginBottom: 36 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: passcode.length > i ? "#d4af37" : "transparent", border: `1.5px solid ${passcode.length > i ? "#d4af37" : "rgba(255,255,255,0.25)"}`, boxShadow: passcode.length > i ? "0 0 10px #d4af37" : "none", transition: "all 0.15s" }} />
            ))}
          </div>
          {shakeError && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, color: "#ff4444", fontSize: 12 }}>
              <AlertCircle size={14} /> Incorrect PIN
            </div>
          )}

          {/* Numpad */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => handleKeyClick(String(n))}
                style={{ width: 60, height: 60, borderRadius: "50%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 20, fontWeight: 300, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.92)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              >{n}</button>
            ))}
            <button onClick={() => setPasscode("")}
              style={{ width: 60, height: 60, borderRadius: "50%", background: "transparent", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>CLR</button>
            <button onClick={() => handleKeyClick("0")}
              style={{ width: 60, height: 60, borderRadius: "50%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 20, fontWeight: 300, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >0</button>
            <div />
          </div>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", marginTop: 28 }}>Default PIN: 1994</p>
        </div>
      </div>
    );
  }

  // ── Designer Detail ───────────────────────────────────────────────────────
  if (view === "designer-detail" && selectedDesigner) {
    const d = selectedDesigner;
    return (
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff" }}>
        {editTarget !== null && (
          <EditModal target={editTarget} onClose={() => setEditTarget(null)}
            onSaveImage={selectedDesigner ? (url) => {
              updateTeamMemberPhoto(selectedDesigner.name, url);
              setSelectedDesigner(prev => prev ? { ...prev, photo: url } : prev);
            } : undefined}
          />
        )}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
          {/* Control Bar: Back & Delete */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <button onClick={() => setView("dashboard")}
              style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <button onClick={() => handleDeleteDesigner(d.name)}
              style={{ padding: "8px 16px", background: "rgba(239,68,64,0.1)", border: "1px solid rgba(239,68,64,0.2)", borderRadius: 8, color: "#ef4444", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,64,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,64,0.1)")}>
              <X size={12} /> Delete Profile
            </button>
          </div>

          {/* Three-column layout: Flag | Photo | Video */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: 28, marginBottom: 48, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 72, lineHeight: 1 }}>{d.flag}</div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>{d.country}</p>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => setEditTarget({ title: d.name, titleFa: "", category: "Design Team" })}
                  style={{ padding: "10px 16px", background: "#d4af37", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
                  Edit Profile
                </button>
                <button style={{ padding: "10px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Video size={12} /> Upload Video
                </button>
              </div>
            </div>

            {/* Photo with replace button */}
            <div style={{ position: "relative", cursor: "pointer", display: "flex", flexDirection: "column" }}>
              <MediaUploader
                label="Replace Designer Photo"
                currentImage={d.img}
                onUpload={(file) => {
                  updateTeamMemberPhoto(d.name, file.url);
                  setSelectedDesigner(prev => prev ? { ...prev, img: file.url } : prev);
                }}
              />
            </div>

            {/* Column 3: Video and Upload */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Intro Video */}
              <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "3/4", position: "relative", background: "#111", cursor: "pointer" }}>
                {d.videoThumb && d.videoThumb.startsWith("data:video/") ? (
                  <video src={d.videoThumb} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, display: "block" }} autoPlay muted loop playsInline />
                ) : d.videoThumb ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={d.videoThumb} alt="intro" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.65, display: "block" }} />
                ) : null}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.5)" }}>
                    <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Self Introduction</span>
                </div>
                <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.7)", padding: "4px 8px", borderRadius: 4, fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 1, textTransform: "uppercase" }}>Video</div>
              </div>
              
              {/* Upload intro video thumb */}
              <MediaUploader 
                label="Self Intro Video File" 
                acceptVideo={true}
                currentImage={d.videoThumb} 
                onUpload={(f) => {
                  updateTeamMemberDetails(d.name, { videoThumb: f.url });
                  setSelectedDesigner(prev => prev ? { ...prev, videoThumb: f.url } : prev);
                }} 
              />
            </div>
          </div>

          {/* Name + Bio Editor */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 40 }}>
            <h1 style={{ fontFamily: "serif", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>{d.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Biography</p>
            <textarea 
              value={d.bio} 
              onChange={e => {
                const newBio = e.target.value;
                updateTeamMemberDetails(d.name, { bio: newBio });
                setSelectedDesigner(prev => prev ? { ...prev, bio: newBio } : prev);
              }}
              style={{ width: "100%", minHeight: 140, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 16, color: "#fff", fontSize: 14, outline: "none", resize: "vertical", lineHeight: 1.6 }}
            />
          </div>

        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff" }}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#222', color: '#fff', border: '1px solid #333' } }} />
      {/* Section item edit overlay */}
      {editSectionEntry !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, width: "100%", maxWidth: 600, padding: 40, boxShadow: "0 0 80px rgba(0,0,0,0.95)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 style={{ fontFamily: "serif", fontSize: 18, letterSpacing: 4, textTransform: "uppercase" }}>Edit Image: {editSectionEntry.title}</h2>
              <button onClick={() => setEditSectionEntry(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><X size={16} /></button>
            </div>
            <MediaUploader
              label="Replace Section Image (4K Recommended)"
              currentImage={editSectionEntry.currentImg}
              onUpload={(file) => {
                updateSectionItemImage(editSectionEntry.categoryId, editSectionEntry.itemIndex, file.url);
                setEditSectionEntry(null);
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => setEditSectionEntry(null)} style={{ padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12 }}>
              <Unlock color="#d4af37" size={24} /> KASRA VAULT
            </h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", marginTop: 6 }}>Secure Content Management</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ padding: "9px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", textDecoration: "none" }}>
              View Site ↗
            </a>
            <button onClick={() => setView("login")}
              style={{ padding: "9px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, color: "#fff", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
              Lock Vault
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
          {[ { label: "Total Sections", value: categories.reduce((a, c) => a + c.items.length, 0), color: "#d4af37" }, { label: "Designers", value: team.length, color: "#60a5fa" }, { label: "Total Images", value: categories.reduce((a, c) => a + c.items.length, 0), color: "#34d399" }, { label: "Categories", value: categories.length, color: "#f472b6" } ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px" }}>
              <p style={{ fontSize: 28, fontFamily: "serif", color: s.color, fontWeight: 300 }}>{s.value}</p>
              <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Layout */}
        <div style={{ display: "flex", gap: 40 }}>
          {/* Sidebar */}
          <div style={{ width: 190, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {([ 
              { id: "homepage", icon: <LayoutTemplate size={15} />, label: "Homepage" },
              { id: "sections", icon: <LayoutTemplate size={15} />, label: "Projects" }, 
              { id: "designers", icon: <Users size={15} />, label: "Designers" }, 
              { id: "config", icon: <Settings size={15} />, label: "Configuration" } 
            ] as const).map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id as Tab)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: activeTab === item.id ? "rgba(212,175,55,0.1)" : "transparent", border: `1px solid ${activeTab === item.id ? "rgba(212,175,55,0.25)" : "transparent"}`, borderRadius: 10, color: activeTab === item.id ? "#d4af37" : "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── Homepage Tab ── */}
            {activeTab === "homepage" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                {/* Philosophy Section */}
                <section>
                  <h2 style={{ fontFamily: "serif", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24, color: "#d4af37" }}>Philosophy Section</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Title (English)</label>
                        <textarea value={philosophy.titleEn} onChange={e => updatePhilosophy({ titleEn: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, color: "#fff", fontSize: 14, minHeight: 80, outline: "none" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Subtitle (English)</label>
                        <textarea value={philosophy.subtitleEn} onChange={e => updatePhilosophy({ subtitleEn: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, color: "#fff", fontSize: 13, minHeight: 100, outline: "none" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8, textAlign: "right" }}>عنوان اصلی (فارسی)</label>
                        <textarea dir="rtl" value={philosophy.titleFa} onChange={e => updatePhilosophy({ titleFa: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, color: "#fff", fontSize: 14, minHeight: 80, outline: "none" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8, textAlign: "right" }}>متن زیرین (فارسی)</label>
                        <textarea dir="rtl" value={philosophy.subtitleFa} onChange={e => updatePhilosophy({ subtitleFa: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, color: "#fff", fontSize: 13, minHeight: 100, outline: "none" }} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Expertise Section */}
                <section>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "serif", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#d4af37" }}>Expertise Disciplines</h2>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
                      <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Section Header (EN)</label>
                      <input value={expertise.titleEn} onChange={e => updateExpertise({ titleEn: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, color: "#fff", fontSize: 14, outline: "none" }} />
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
                      <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8, textAlign: "right" }}>تیتر (فارسی)</label>
                      <input dir="rtl" value={expertise.titleFa} onChange={e => updateExpertise({ titleFa: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, color: "#fff", fontSize: 14, outline: "none" }} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                    {expertise.items.map((item, idx) => (
                      <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, display: "flex", gap: 20 }}>
                        <div style={{ width: 120, flexShrink: 0 }}>
                           <MediaUploader label={`Image ${item.id}`} currentImage={item.img} onUpload={f => updateExpertiseItem(idx, { img: f.url })} />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>English Title</label>
                            <input value={item.titleEn} onChange={e => updateExpertiseItem(idx, { titleEn: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 10, color: "#fff", fontSize: 13, outline: "none" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4, textAlign: "right" }}>عنوان فارسی</label>
                            <input dir="rtl" value={item.titleFa} onChange={e => updateExpertiseItem(idx, { titleFa: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 10, color: "#fff", fontSize: 13, outline: "none" }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ── Sections Tab ── */}
            {activeTab === "sections" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "serif", fontSize: 20, letterSpacing: 4, textTransform: "uppercase" }}>Manage Sections</h2>
                </div>

                {categories.map((cat) => (
                  <div key={cat.id} style={{ marginBottom: 40 }}>
                    <h3 style={{ fontFamily: "serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: "#d4af37", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{cat.titleEn}</h3>
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              {["Preview", "English Title", "Farsi Title", "Actions"].map(h => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: h === "Actions" ? "right" : "left", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: "normal", whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {cat.items.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                <td style={{ padding: "10px 16px" }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={item.img} alt={item.titleEn} style={{ width: 60, height: 45, objectFit: "cover", borderRadius: 6, display: "block" }} />
                                </td>
                                <td style={{ padding: "10px 16px", fontFamily: "serif", fontSize: 13 }}>{item.titleEn}</td>
                                <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.45)", fontSize: 12 }} dir="rtl">{item.titleFa}</td>
                                <td style={{ padding: "10px 16px", textAlign: "right" }}>
                                  <button
                                    onClick={() => setEditSectionEntry({ categoryId: cat.id, itemIndex: idx, title: item.titleEn, currentImg: item.img })}
                                    style={{ background: "none", border: "none", color: "#d4af37", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}
                                  >Replace Image</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── Designers Tab ── */}
            {activeTab === "designers" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "serif", fontSize: 20, letterSpacing: 4, textTransform: "uppercase" }}>Design Team</h2>
                  <button onClick={handleAddDesigner} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#d4af37", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
                    + Add Designer
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
                  {team.map(d => (
                    <div key={d.name}
                      onClick={() => { setSelectedDesigner(d); setView("designer-detail"); }}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s, transform 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(212,175,55,0.4)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.img} alt={d.name} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "14px 18px" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{d.flag}</div>
                        <h3 style={{ fontFamily: "serif", fontSize: 14, letterSpacing: 1, marginBottom: 2 }}>{d.name}</h3>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>{d.country}</p>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <span style={{ fontSize: 9, color: "#d4af37", letterSpacing: 2, textTransform: "uppercase" }}>View Profile →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Config Tab ── */}
            {activeTab === "config" && (
              <>
                <h2 style={{ fontFamily: "serif", fontSize: 20, letterSpacing: 4, textTransform: "uppercase", marginBottom: 28 }}>Site Configuration</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
                  {[
                    { label: "Site Title (English)", defaultValue: "Kasra Padyab | Architect & Designer" },
                    { label: "Site Title (Farsi)", defaultValue: "کسری پادیاب | معمار و طراح" },
                    { label: "Contact Email", defaultValue: "contact@kasrapadyab.com" },
                    { label: "Admin PIN", defaultValue: "1994", type: "password" },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{f.label}</label>
                      <input type={f.type || "text"} defaultValue={f.defaultValue}
                        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        onFocus={e => (e.target.style.borderColor = "#d4af37")}
                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>
                  ))}

                  {/* Logo upload */}
                  <div style={{ marginTop: 8 }}>
                    <MediaUploader label="Site Logo / Favicon" />
                  </div>

                  <button style={{ alignSelf: "flex-start", padding: "13px 32px", background: "#d4af37", border: "none", borderRadius: 10, color: "#000", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginTop: 8 }}>
                    Save Configuration
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
