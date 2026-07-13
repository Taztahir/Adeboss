"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

// ── Tool data ───────────────────────────────────────────────────────────────
const tools = [
  {
    name: "Figma",
    category: "UI & Brand Design",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
        <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" />
        <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" />
        <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" />
        <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" />
        <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" />
      </svg>
    ),
    accent: "#A259FF",
  },
  {
    name: "Illustrator",
    category: "Vector & Logo Design",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
        <path d="M10 1.5L1.5 22.5h3.9l1.7-4.5h5.7l1.7 4.5h3.9L10 1.5zm-2 13.5l2-6 2 6H8z" />
        <path d="M18 8c-.8 0-1.5.3-2 .8V8.1h-2.5V22.5H16v-5.1c.5.4 1.2.6 2 .6 2.5 0 4-1.8 4-5s-1.5-5-4-5zm-.5 7.9c-.9 0-1.5-.5-1.5-1.5v-2.8c0-1 .6-1.5 1.5-1.5s1.5.8 1.5 2.9-.6 1.9-1.5 1.9z" />
      </svg>
    ),
    accent: "#FF9A00",
  },
  {
    name: "Photoshop",
    category: "Photo & Compositing",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
        <path d="M0 4.8C0 2.15 2.15 0 4.8 0h14.4C21.85 0 24 2.15 24 4.8v14.4C24 21.85 21.85 24 19.2 24H4.8C2.15 24 0 21.85 0 19.2z" />
        <path fill="var(--hudson-hero-left-bg)" d="M5.5 7h3.6c2 0 3.5 1.1 3.5 3.2 0 2.2-1.6 3.3-3.7 3.3H7.5v3.5H5.5V7zm2 4.8H9c1 0 1.6-.5 1.6-1.5 0-1-.6-1.5-1.6-1.5H7.5v3z" />
        <path fill="var(--hudson-hero-left-bg)" d="M14 12.6c0-1.5.4-2.5 1-3.1.7-.7 1.7-1 2.7-1 .4 0 .7 0 1 .1v1.8c-.3-.1-.5-.1-.8-.1-1.1 0-1.9.7-1.9 2.4v.2c.4-.2.9-.3 1.4-.3 1.6 0 2.6 1 2.6 2.7 0 1.7-1.1 2.8-2.9 2.8-1.7 0-3.1-1.2-3.1-3.5v-2zm2 2.3c0 1 .5 1.6 1.3 1.6.8 0 1.2-.5 1.2-1.5 0-.9-.5-1.4-1.3-1.4-.4 0-.8.2-1.2.4v.9z" />
      </svg>
    ),
    accent: "#31A8FF",
  },
  // {
  //   name: "InDesign",
  //   category: "Editorial & Print",
  //   icon: (
  //     <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
  //       <path d="M0 4.8C0 2.15 2.15 0 4.8 0h14.4C21.85 0 24 2.15 24 4.8v14.4C24 21.85 21.85 24 19.2 24H4.8C2.15 24 0 21.85 0 19.2z"/>
  //       <path fill="var(--hudson-hero-left-bg)" d="M7.5 7h2V17H7.5z"/>
  //       <path fill="var(--hudson-hero-left-bg)" d="M11.5 7h3.8c2.3 0 4.2 1.5 4.2 5 0 3.2-1.7 5-4.2 5H11.5V7zm2 8.2h1.4c1.5 0 2.4-.9 2.4-3.2s-.9-3.2-2.4-3.2H13.5v6.4z"/>
  //     </svg>
  //   ),
  //   accent: "#FF3366",
  // },
  // {
  //   name: "After Effects",
  //   category: "Motion & Animation",
  //   icon: (
  //     <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
  //       <path d="M0 4.8C0 2.15 2.15 0 4.8 0h14.4C21.85 0 24 2.15 24 4.8v14.4C24 21.85 21.85 24 19.2 24H4.8C2.15 24 0 21.85 0 19.2z"/>
  //       <path fill="var(--hudson-hero-left-bg)" d="M9.2 7L5.5 17H7.6l.9-2.5h3.9l.9 2.5H15L11.3 7H9.2zm-.2 5.9l1.5-4.3 1.5 4.3H9z"/>
  //       <path fill="var(--hudson-hero-left-bg)" d="M14.9 12.1c0-2.9 1.5-5.1 4.3-5.1.6 0 1.1.1 1.4.2v1.8c-.3-.2-.7-.3-1.1-.3-1.5 0-2.4 1.2-2.4 3.3v.1c.5-.3 1.1-.5 1.7-.5 1.5 0 2.7.9 2.7 2.7 0 1.8-1.2 2.9-2.9 2.9-2 0-3.7-1.4-3.7-5.1zm2.2 1.5c0 .9.5 1.5 1.3 1.5.8 0 1.2-.6 1.2-1.5 0-.8-.5-1.3-1.3-1.3-.5 0-.9.2-1.2.5v.8z"/>
  //     </svg>
  //   ),
  //   accent: "#9999FF",
  // },
  // {
  //   name: "Canva",
  //   category: "Social Media Design",
  //   icon: (
  //     <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
  //       <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a8.4 8.4 0 1 1 0 16.8A8.4 8.4 0 0 1 12 3.6zm-1.2 4.2c-.9 0-1.9.5-2.6 1.4-.7.9-1 2-.8 3.1.2 1 .9 1.8 1.9 2 .5.1.9 0 1.3-.2-.3-.4-.5-.9-.6-1.4-.1-.7.1-1.5.6-2.1.5-.6 1.2-.9 1.9-.9.6 0 1.1.2 1.5.6-.3-1.7-1.5-2.5-3.2-2.5zm4.8 1.2c-.5 0-1 .2-1.4.5.5.5.8 1.2.8 2s-.3 1.5-.8 2c.4.3.9.5 1.4.5 1.3 0 2.4-1.1 2.4-2.5s-1.1-2.5-2.4-2.5z"/>
  //     </svg>
  //   ),
  //   accent: "#00C4CC",
  // },
  // {
  //   name: "Procreate",
  //   category: "Digital Illustration",
  //   icon: (
  //     <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
  //       <circle cx="12" cy="12" r="11"/>
  //       <path fill="var(--hudson-hero-left-bg)" d="M16.5 8.5c-1.5-1.5-3.8-1.7-5.5-.5L7 12l-1.5 4 4-1.5 4-3.9c1.2-1.7 1-4-.5-5.6l.5.5-.5-.5z"/>
  //       <circle fill="var(--hudson-hero-left-bg)" cx="17.5" cy="6.5" r="1.5"/>
  //     </svg>
  //   ),
  //   accent: "#E8A87C",
  // },
  {
    name: "CorelDRAW",
    category: "Vector Graphics",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 2.4c5.3 0 9.6 4.3 9.6 9.6S17.3 21.6 12 21.6 2.4 17.3 2.4 12 6.7 2.4 12 2.4z" />
        <path d="M12 5c-1.9 0-3.6.7-4.9 1.9L9 8.8c.8-.7 1.8-1.2 3-1.2 2.4 0 4.4 2 4.4 4.4S14.4 16.4 12 16.4c-1.2 0-2.2-.5-3-1.2l-1.9 1.9C8.4 18.3 10.1 19 12 19c3.9 0 7-3.1 7-7s-3.1-7-7-7z" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    accent: "#007A33",
  },
];


export default function ToolsSection() {
  const shouldReduceMotion = useReducedMotion();

  const headingVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.07,
        type: "spring" as const,
        stiffness: 70,
        damping: 16,
      },
    }),
  };

  return (
    <section
      id="tools"
      className="py-24 bg-[var(--hudson-hero-left-bg)] text-[var(--hudson-about-text)] transition-colors duration-300 overflow-hidden"
      aria-labelledby="tools-heading"
    >
      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24">
        <div className="relative mb-20 select-none">
          <span
            className="font-serif font-bold leading-none absolute -left-4 -top-16 pointer-events-none text-[var(--hudson-about-text)]/[0.04]"
            style={{ fontSize: "clamp(6rem, 16vw, 14rem)" }}
            aria-hidden="true"
          >
            03
          </span>

          <motion.h2
            id="tools-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={headingVariants}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight relative z-10 text-[var(--hudson-about-text)]"
          >
            Tools of the Trade.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 font-sans text-base md:text-lg text-[var(--hudson-about-muted)] max-w-lg"
          >
            The software and platforms I rely on daily to craft polished, professional-grade design work.
          </motion.p>
        </div>
      </div>


      {/* ── Tool Cards Grid ── */}
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="group relative flex flex-col gap-4 p-6 bg-white border border-[var(--hudson-about-text)]/8 hover:border-[var(--hudson-about-text)]/20 transition-all duration-300 cursor-default"
            >
              {/* Coloured top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{ backgroundColor: tool.accent }}
                aria-hidden="true"
              />

              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200"
                style={{ backgroundColor: `${tool.accent}15`, color: tool.accent }}
              >
                {tool.icon}
              </div>

              {/* Text */}
              <div>
                <p className="font-sans text-sm font-bold text-[var(--hudson-about-text)]">
                  {tool.name}
                </p>
                <p className="font-sans text-xs text-[var(--hudson-about-muted)] mt-0.5 leading-snug">
                  {tool.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
