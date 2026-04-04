"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/AnimationKit";
import { motion } from "framer-motion";

export function TeamSection() {
  const { t } = useLanguage();
  const { team } = useContent();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  };

  return (
    <section id="design-team" className="py-24 transition-colors" style={{ background: 'var(--bg-main)' }}>
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
          number="01"
          title={t("section_design_team") || "Design Team"}
          className="mb-16"
        />

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="group cursor-pointer"
              data-cursor="hover"
            >
              {/* Image */}
              <div className="w-full aspect-[4/5] overflow-hidden bg-neutral-200 dark:bg-neutral-900 mb-5 relative">
                <motion.img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover will-change-transform"
                  initial={{ scale: 1.08, filter: "grayscale(100%)" }}
                  whileHover={{ scale: 1, filter: "grayscale(0%)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  loading="lazy"
                  suppressHydrationWarning
                />
                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              {/* Name */}
              <h3 className="text-base font-serif text-black dark:text-white tracking-wide group-hover:text-accent transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-[0.3em] mt-1 font-light">
                {member.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
