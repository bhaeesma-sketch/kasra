"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fa";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    hero_title: "Kasra Padyab",
    hero_subtitle: "Architect & Designer",
    scroll_explore: "Scroll to Explore",
    nav_home: "Home",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    section_design_team: "My International Design Team",
    section_interviews: "Interviews in T.V, Newspapers, Radio",
    section_lectures: "Lectures & Workshop",
    section_publications: "Publications",
    section_projects: "Selected Projects",
    section_awards: "News Awards and Honors",
    section_sketching: "My Fast Sketching",
    section_research: "Independent VIP Research",
    section_international_classes: "My international classes",
    section_classes: "Classes",
    section_education: "Education: How is teaching in my classes?",
    section_judgment: "judgment: Correction and judging of my students' works by professors",
    section_site_visit: "Site visit: Check the project site before designing",
    section_birthday: "My Birthday: With students in class",
    get_in_touch: "Get in Touch",
  },
  fa: {
    hero_title: "کسری پادیاب",
    hero_subtitle: "معمار و طراح",
    scroll_explore: "برای اکتشاف به پایین بکشید",
    nav_home: "خانه",
    nav_portfolio: "نمونه کارها",
    nav_contact: "تماس",
    section_design_team: "تیم بین المللی طراحی من",
    section_interviews: "مصاحبه ها: تلویزیون، رادیو، روزنامه",
    section_lectures: "سخنرانی ها و ورکشاپ",
    section_publications: "کتاب ها و مقالات",
    section_projects: "پروژه های منتخب",
    section_awards: "اخبار جوایز و افتخارات",
    section_sketching: "طراحی سریع من",
    section_research: "تحقیق های مستقل و ویژه",
    section_international_classes: "کلاس های بین المللی من",
    section_classes: "کلاس های من",
    section_education: "آموزش در کلاس های من چگونه است؟",
    section_judgment: "تصحیح و داوری آثار دانشجویانم",
    section_site_visit: "بازدید از سایت پروژه",
    section_birthday: "تولد های من در کلاس",
    get_in_touch: "در تماس باشید",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang === "fa") {
      document.body.dir = "rtl";
      document.documentElement.lang = "fa";
      document.documentElement.classList.add("font-fa");
      document.documentElement.classList.remove("font-en");
    } else {
      document.body.dir = "ltr";
      document.documentElement.lang = "en";
      document.documentElement.classList.add("font-en");
      document.documentElement.classList.remove("font-fa");
    }
  };

  useEffect(() => {
    // Set DOM classes correctly on mount without re-setting state (already "en")
    document.body.dir = "ltr";
    document.documentElement.lang = "en";
    document.documentElement.classList.add("font-en");
    document.documentElement.classList.remove("font-fa");
  }, []);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
