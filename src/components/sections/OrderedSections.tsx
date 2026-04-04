"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { FadeUp, RevealLine, ParallaxCard } from "@/components/ui/AnimationKit";
import { motion } from "framer-motion";

export function OrderedSections() {
  const { language } = useLanguage();
  const { categories } = useContent();

  return (
    <div className="w-full bg-neutral-50 dark:bg-[#080604] transition-colors pt-8 pb-32">
      {categories.map((section, idx) => (
        <section key={section.id} id={section.id} className="py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-12">
            {/* Section header */}
            <FadeUp>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                <div>
                  <span className="text-accent text-xs tabular-nums tracking-[0.4em] font-mono block mb-3">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif text-black dark:text-white uppercase tracking-widest leading-tight">
                    {language === "en" ? section.titleEn : section.titleFa}
                  </h2>
                </div>
                <motion.button
                  className="text-[10px] tracking-[0.3em] uppercase border-b border-black/20 dark:border-white/20 pb-1 text-black/60 dark:text-white/60 self-start md:self-end"
                  whileHover={{ x: 4, borderColor: "rgba(200,130,50,0.8)", color: "rgb(200,130,50)" }}
                  transition={{ duration: 0.25 }}
                  data-cursor="hover"
                >
                  {language === "en" ? "View Archive →" : "← مشاهده آرشیو"}
                </motion.button>
              </div>
              <RevealLine className="bg-black/8 dark:bg-white/8 mb-14" />
            </FadeUp>

            {/* Items grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {section.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="group cursor-pointer flex flex-col"
                  data-cursor="hover"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  {/* Image */}
                  <ParallaxCard
                    src={item.img}
                    alt={item.titleEn}
                    className={`w-full mb-6 ${
                      section.items.length === 1
                        ? "aspect-[21/9]"
                        : "aspect-[4/3]"
                    }`}
                  />

                  {/* Text */}
                  <motion.h3
                    className="text-xl md:text-2xl font-serif text-black dark:text-white leading-snug"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.25 }}
                  >
                    {language === "en" ? item.titleEn : item.titleFa}
                  </motion.h3>
                  <div className="h-px w-0 bg-accent mt-5 mb-4 group-hover:w-12 transition-all duration-500" />
                  <span className="text-[10px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40 group-hover:text-accent transition-colors duration-300">
                    {language === "en" ? "Explore →" : "← کاوش"}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
}
