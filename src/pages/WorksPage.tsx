"use client";

import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import AdebossJpeg from "@/assets/Adeboss.jpeg";

const serviceLabels: Record<string, string> = {
  "01": "Brand Design",
  "02": "Graphics Design",
  "03": "Social Media Poster",
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ADD YOUR REAL PORTFOLIO IMAGES HERE
 * Import each image at the top and add its variable to the correct array below.
 *
 * Example:
 *   import brandWork1 from "@/assets/works/brand-1.jpg";
 *   import brandWork2 from "@/assets/works/brand-2.jpg";
 *
 *   "01": [brandWork1, brandWork2, ...],
 * ─────────────────────────────────────────────────────────────────────────────
 */
const serviceGallery: Record<string, string[]> = {
  "01": [],
  "02": [],
  "03": [],
};

export default function WorksPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const label = serviceId ? (serviceLabels[serviceId] ?? "Works") : "Works";
  const images = serviceId ? (serviceGallery[serviceId] ?? []) : [];

  return (
    <div className="min-h-screen bg-[var(--hudson-navbar-bg)]">

      {/* ── Fixed top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 bg-[var(--hudson-navbar-bg)]/90 backdrop-blur-md border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[var(--hudson-navbar-fg-muted)] hover:text-[var(--hudson-navbar-fg)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hudson-navbar-accent)]"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="font-sans text-xs font-bold tracking-[0.15em] uppercase">
            Back
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--hudson-navbar-accent)] tracking-widest uppercase">
            Works
          </span>
          <span className="text-white/20 font-mono text-xs">/</span>
          <span className="font-serif text-sm font-bold text-[var(--hudson-navbar-fg)]">
            {label}
          </span>
        </div>

        <a
          href="/#contact"
          className="hidden sm:inline-flex items-center px-4 py-2 border border-white/15 hover:border-[var(--hudson-navbar-accent)] text-[var(--hudson-navbar-fg-muted)] hover:text-white font-sans text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200"
        >
          Hire Me
        </a>
      </header>

      {/* ── Masonry Image Gallery ── */}
      <main
        className="pt-24 px-4 sm:px-6 pb-16"
        aria-label={`${label} portfolio gallery`}
      >
        {images.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 sm:gap-3">
            {images.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                className="break-inside-avoid mb-2 sm:mb-3 overflow-hidden block group"
              >
                <img
                  src={src}
                  alt=""
                  role="presentation"
                  className="w-full block group-hover:scale-[1.015] transition-transform duration-500 ease-out"
                  loading={i < 3 ? "eager" : "lazy"}
                  draggable={false}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <span className="font-mono text-xs text-[var(--hudson-navbar-fg-muted)] tracking-widest">
              No works found for this service.
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
