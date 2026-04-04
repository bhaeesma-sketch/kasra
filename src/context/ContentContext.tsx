"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { siteData } from "@/data/siteContent";

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

interface ContentContextType {
  team: TeamMember[];
  categories: Category[];
  updateTeamMemberPhoto: (name: string, newImg: string) => void;
  updateTeamMemberBio: (name: string, bio: string) => void;
  updateSectionItemImage: (categoryId: string, itemIndex: number, newImg: string) => void;
  addSectionItem: (categoryId: string, item: SectionItem) => void;
  deleteSectionItem: (categoryId: string, itemIndex: number) => void;
  resetToDefaults: () => void;
  lastSaved: Date | null;
}

const ContentContext = createContext<ContentContextType | null>(null);

const STORAGE_KEY = "kasra_site_content";

function loadFromStorage(): { team: TeamMember[]; categories: Category[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

import { supabase } from "@/utils/supabase";

function saveToStorage(data: { team: TeamMember[]; categories: Category[] }) {
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

export function ContentProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(() => {
    const stored = loadFromStorage();
    return stored ? stored.team : defaultTeam;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = loadFromStorage();
    return stored ? stored.categories : defaultCategories;
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Mark as hydrated on mount & fetch latest from Supabase
  useEffect(() => {
    let raf: number;
    raf = requestAnimationFrame(() => {
      setHydrated(true);
    });
    
    // Fetch from Supabase
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("team, categories")
          .eq("id", 1)
          .single();
          
        if (data && !error) {
          if (data.team) setTeam(data.team);
          if (data.categories) setCategories(data.categories);
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    };
    
    fetchFromSupabase();
  }, []);

  // Auto-save whenever team or categories change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    const data = { team, categories };
    saveToStorage(data);
    
    // Sync to Supabase
    const syncToSupabase = async () => {
      try {
        await supabase.from("site_settings").upsert({
          id: 1,
          team: data.team,
          categories: data.categories,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error("Supabase sync error:", err);
      }
    };
    syncToSupabase();
    
    // Use setTimeout to move state update out of the render cycle
    const timer = setTimeout(() => setLastSaved(new Date()), 0);
    return () => clearTimeout(timer);
  }, [team, categories, hydrated]);

  const updateTeamMemberPhoto = useCallback((name: string, newImg: string) => {
    setTeam(prev => prev.map(m => m.name === name ? { ...m, img: newImg } : m));
  }, []);

  const updateTeamMemberBio = useCallback((name: string, bio: string) => {
    setTeam(prev => prev.map(m => m.name === name ? { ...m, bio } : m));
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

  const resetToDefaults = useCallback(() => {
    setTeam(defaultTeam);
    setCategories(defaultCategories);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ContentContext.Provider value={{
      team, categories,
      updateTeamMemberPhoto, updateTeamMemberBio,
      updateSectionItemImage, addSectionItem, deleteSectionItem,
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
