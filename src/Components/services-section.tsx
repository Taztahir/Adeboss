import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const INITIAL_SERVICES: Service[] = [
  {
    id: "01",
    title: "Brand Design",
    description:
      "Crafting distinct visual identities that communicate core brand values. From logos and custom typography to color systems and brand guidelines — built to resonate across every medium.",
    tags: ["Visual Identity", "Logo Design", "Color Systems", "Typography"],
  },
  {
    id: "02",
    title: "Graphics Design",
    description:
      "High-impact marketing collateral and print assets that prioritise visual hierarchy and grid precision. Message-driven graphics engineered to convert and captivate.",
    tags: ["Marketing Collateral", "Editorial & Print", "Vector Illustration", "Packaging"],
  },
  {
    id: "03",
    title: "Social Media Poster",
    description:
      "Conversion-focused social media graphics and templates tailored for Instagram, LinkedIn, and X. Scroll-stopping visuals that align perfectly with your campaign aesthetic.",
    tags: ["Feed Creatives", "Story Templates", "Ad Banners", "Typography Layouts"],
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('slug')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setServices(data.map(item => ({
            id: item.slug,
            title: item.title,
            description: item.description,
            tags: item.tags
          })));
        }
      });
  }, []);

  const headingVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 18 },
    },
  };

  return (
    <section
      id="works"
      className="py-24 px-8 sm:px-12 md:px-16 lg:px-24 bg-[var(--hudson-services-bg)] text-[var(--hudson-services-text)] transition-colors duration-300"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="relative mb-20 select-none">
          <span
            className="font-serif font-bold text-white/[0.04] leading-none absolute -left-4 -top-16 pointer-events-none"
            style={{ fontSize: "clamp(6rem, 16vw, 14rem)" }}
            aria-hidden="true"
          >
            02
          </span>

          <motion.h2
            id="services-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={headingVariants}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight relative z-10"
          >
            Services.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 font-sans text-base md:text-lg text-[var(--hudson-services-muted)] max-w-lg"
          >
            What I do to elevate your brand, your print, and your presence online.
          </motion.p>
        </div>

        {/* ── Service Rows ── */}
        <div className="divide-y divide-white/10">
          {services.map((service, i) => (
            <motion.article
              key={service.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={rowVariants}
              transition={{ delay: i * 0.08 }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 py-10 md:py-12 cursor-default"
            >
              {/* Number + Title */}
              <div className="md:col-span-5 flex items-start gap-6">
                <span className="font-mono text-xs font-bold text-[var(--hudson-navbar-accent)] mt-1 shrink-0 tracking-widest">
                  {service.id}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight group-hover:text-[var(--hudson-navbar-accent)] transition-colors duration-300">
                  {service.title}
                </h3>
              </div>

              {/* Description + Tags + CTA */}
              <div className="md:col-span-7 flex flex-col justify-between gap-6">
                <p className="font-sans text-sm sm:text-base leading-relaxed text-[var(--hudson-services-muted)]">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1 border border-white/15 text-white/50 hover:border-white/30 hover:text-white/70 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/works/${service.id}`)}
                    className="inline-flex bg-[var(--hudson-navbar-accent)] hover:opacity-90 w-full sm:w-auto px-6 py-3.5 items-center gap-2 font-sans justify-center text-xs font-bold tracking-[0.2em] uppercase text-white transition-opacity duration-200 group/btn"
                  >
                    View Works
                    <ArrowRight className="w-3.5 h-3.5 transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
