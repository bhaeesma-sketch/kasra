"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

export function OrderedSections() {
  const { language } = useLanguage();
  const { categories } = useContent();

  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-950 transition-colors pt-12 pb-32">
      {categories.map((section, idx) => (
        <section key={section.id} id={section.id} className="py-24">
          <div className="container mx-auto px-6 md:px-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-4 border-b border-black/10 dark:border-white/10">
               <div>
                  <span className="text-accent text-sm tabular-nums tracking-widest font-serif block mb-4">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif text-black dark:text-white uppercase tracking-widest">
                    {language === "en" ? section.titleEn : section.titleFa}
                  </h2>
               </div>
               <button className="text-xs tracking-[0.2em] uppercase border-b border-black/30 dark:border-white/30 pb-1 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white self-start md:self-end" data-cursor="hover">
                  {language === "en" ? "View Archive" : "مشاهده آرشیو"}
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((item, i) => {
                const imgSrc = item.img.startsWith("http") || item.img.startsWith("/") 
                  ? `${item.img.split("?")[0]}?v=${new Date().getTime()}`
                  : item.img;
                  
                return (
                  <div key={i} className="group cursor-pointer flex flex-col">
                    <div 
                      className={`w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900 mb-6 ${
                        section.items.length === 1 ? 'lg:col-span-3 aspect-21/9' : 
                        'aspect-4/3 w-full'
                      }`}
                    >
                      <img 
                        src={imgSrc} 
                        alt={item.titleEn} 
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover:brightness-100 transition-all duration-500 will-change-transform"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-black dark:text-white group-hover:text-accent transition-colors leading-snug">
                      {language === "en" ? item.titleEn : item.titleFa}
                    </h3>
                    <div className="h-px w-12 bg-black/20 dark:bg-white/20 mt-6 mb-4"></div>
                    <button className="text-left text-xs uppercase tracking-widest text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {language === "en" ? "Explore →" : "← کاوش"}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      ))}
    </div>
  );
}
