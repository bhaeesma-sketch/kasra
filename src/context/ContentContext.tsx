"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { siteData } from "@/data/siteContent";
import { supabase } from "@/utils/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TeamMember {
  name: string;
  role: string;
  img: string;
  country?: string;
  flag?: string;
  bio?: string;
  videoThumb?: string;
}

export interface SectionItem {
  titleEn: string;
  titleFa: string;
  img: string;
}

export interface Category {
  id: string;
  titleEn: string;
  titleFa: string;
  items: SectionItem[];
}

export interface PhilosophyContent {
  titleEn: string;
  titleFa: string;
  subtitleEn: string;
  subtitleFa: string;
}

export interface ExpertiseItem {
  id: string;
  titleEn: string;
  titleFa: string;
  img: string;
}

export interface ExpertiseContent {
  titleEn: string;
  titleFa: string;
  items: ExpertiseItem[];
}

interface ContentContextType {
  team: TeamMember[];
  categories: Category[];
  philosophy: PhilosophyContent;
  expertise: ExpertiseContent;
  updateTeamMemberPhoto: (name: string, newImg: string) => void;
  updateTeamMemberDetails: (name: string, details: Partial<TeamMember>) => void;
  addTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (name: string) => void;
  updateSectionItemImage: (categoryId: string, itemIndex: number, newImg: string) => void;
  addSectionItem: (categoryId: string, item: SectionItem) => void;
  deleteSectionItem: (categoryId: string, itemIndex: number) => void;
  updatePhilosophy: (updates: Partial<PhilosophyContent>) => void;
  updateExpertise: (updates: Partial<ExpertiseContent>) => void;
  updateExpertiseItem: (index: number, updates: Partial<ExpertiseItem>) => void;
  resetToDefaults: () => void;
  lastSaved: Date | null;
}

const ContentContext = createContext<ContentContextType | null>(null);

const STORAGE_KEY = "kasra_site_content";

function loadFromStorage(): { team: TeamMember[]; categories: Category[]; philosophy?: PhilosophyContent; expertise?: ExpertiseContent } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: { team: TeamMember[]; categories: Category[]; philosophy: PhilosophyContent; expertise: ExpertiseContent }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage quota exceeded — silently ignore
  }
}

const defaultTeam: TeamMember[] = siteData.team.map(m => ({
  ...m,
  country: "",
  flag: "🏳️",
  bio: "",
  videoThumb: "",
}));

const defaultCategories: Category[] = siteData.categories as Category[];

const defaultPhilosophy: PhilosophyContent = {
  titleEn: "Architecture is the silent language of space, light, and form.",
  titleFa: "معماری زبان خاموش فضا، نور و فرم است.",
  subtitleEn: "We craft environments that resonate with the human spirit, blending structural precision with emotional depth.",
  subtitleFa: "ما محیط‌هایی می‌سازیم که با روح انسان طنین‌انداز می‌شوند و دقت ساختاری را با عمق احساسی در هم می‌آمیزند."
};

const defaultExpertise: ExpertiseContent = {
  titleEn: "Disciplines",
  titleFa: "رشته ها",
  items: [
    { id: "01", titleEn: "Masterplanning", titleFa: "طرح جامع", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" },
    { id: "02", titleEn: "Interior Architecture", titleFa: "معماری داخلی", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" },
    { id: "03", titleEn: "Conceptual Design", titleFa: "طراحی مفهومی", img: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=1200" },
    { id: "04", titleEn: "Landscape Integration", titleFa: "تلفیق منظر", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200" }
  ]
};

export function ContentProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [philosophy, setPhilosophy] = useState<PhilosophyContent>(defaultPhilosophy);
  const [expertise, setExpertise] = useState<ExpertiseContent>(defaultExpertise);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Mark as hydrated on mount & fetch latest from Supabase
  useEffect(() => {
    const initStorage = async () => {
      const stored = loadFromStorage();
      if (stored) {
        setTeam(stored.team);
        setCategories(stored.categories);
        if (stored.philosophy) setPhilosophy(stored.philosophy);
        if (stored.expertise) setExpertise(stored.expertise);
      }
      setHydrated(true);
    };
    initStorage();
    
    // Fetch from Supabase
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("team, categories, philosophy, expertise")
          .eq("id", 1)
          .single();
          
        if (data && !error) {
          if (data.team) setTeam(data.team);
          if (data.categories) setCategories(data.categories);
          if (data.philosophy) setPhilosophy(data.philosophy);
          if (data.expertise) setExpertise(data.expertise);
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    };
    fetchFromSupabase();

    // Listen for cross-tab changes in local storage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.team) setTeam(parsed.team);
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.philosophy) setPhilosophy(parsed.philosophy);
          if (parsed.expertise) setExpertise(parsed.expertise);
        } catch { }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Auto-save whenever team or categories change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    const data = { team, categories, philosophy, expertise };
    saveToStorage(data);
    
    // Sync to Supabase
    const syncToSupabase = async () => {
      try {
        await supabase.from("site_settings").upsert({
          id: 1,
          team: data.team,
          categories: data.categories,
          philosophy: data.philosophy,
          expertise: data.expertise,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error("Supabase sync error:", err);
      }
    };
    syncToSupabase();
    
    const timer = setTimeout(() => setLastSaved(new Date()), 100);
    return () => clearTimeout(timer);
  }, [team, categories, philosophy, expertise, hydrated]);

  const updateTeamMemberPhoto = useCallback((name: string, newImg: string) => {
    setTeam(prev => prev.map(m => m.name === name ? { ...m, img: newImg } : m));
  }, []);

  const updateTeamMemberDetails = useCallback((name: string, details: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.name === name ? { ...m, ...details } : m));
  }, []);

  const addTeamMember = useCallback((member: TeamMember) => {
    setTeam(prev => [...prev, member]);
  }, []);

  const deleteTeamMember = useCallback((name: string) => {
    setTeam(prev => prev.filter(m => m.name !== name));
  }, []);

  const updateSectionItemImage = useCallback((categoryId: string, itemIndex: number, newImg: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.map((item, i) => i === itemIndex ? { ...item, img: newImg } : item) }
        : cat
    ));
  }, []);

  const addSectionItem = useCallback((categoryId: string, item: SectionItem) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, items: [...cat.items, item] } : cat
    ));
  }, []);

  const deleteSectionItem = useCallback((categoryId: string, itemIndex: number) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter((_, i) => i !== itemIndex) }
        : cat
    ));
  }, []);

  const updatePhilosophy = useCallback((updates: Partial<PhilosophyContent>) => {
    setPhilosophy(prev => ({ ...prev, ...updates }));
  }, []);

  const updateExpertise = useCallback((updates: Partial<ExpertiseContent>) => {
    setExpertise(prev => ({ ...prev, ...updates }));
  }, []);

  const updateExpertiseItem = useCallback((index: number, updates: Partial<ExpertiseItem>) => {
    setExpertise(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, ...updates } : item)
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setTeam(defaultTeam);
    setCategories(defaultCategories);
    setPhilosophy(defaultPhilosophy);
    setExpertise(defaultExpertise);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ContentContext.Provider value={{
      team, categories, philosophy, expertise,
      updateTeamMemberPhoto, updateTeamMemberDetails, addTeamMember, deleteTeamMember,
      updateSectionItemImage, addSectionItem, deleteSectionItem,
      updatePhilosophy, updateExpertise, updateExpertiseItem,
      resetToDefaults, lastSaved
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
