"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: "1",
    name: "Fatima Musa",
    role: "Creative Director, Luxe Studio",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    quote:
      "Adeboss's brand identity work transformed our brand's visual language entirely. Every deliverable was precise, intentional, and beautifully crafted.",
  },
  {
    id: "2",
    name: "Emmanuel Obi",
    role: "Founder, Olive & Oak",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel",
    quote:
      "Our social media engagement tripled after the poster redesign. He has an exceptional eye for hierarchy and colour.",
  },
  {
    id: "3",
    name: "Chisom Adaeze",
    role: "Marketing Lead, BrandForge",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chisom",
    quote:
      "He delivered a complete graphics system under a tight deadline — flawless execution with zero revisions needed.",
  },
  {
    id: "4",
    name: "Lara Adebayo",
    role: "CEO, Mint Creative",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lara",
    quote:
      "The logo and visual identity he designed for us have become our biggest brand asset. Clients compliment it every single day.",
  },
  {
    id: "5",
    name: "Segun Bello",
    role: "Art Director, Pixel House",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Segun",
    quote:
      "Working with Adeboss is effortless. He understands the brief immediately and always delivers work that exceeds expectations.",
  },
];

export default function Testimonial3() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const visibleItems = useMemo(() => {
    const total = testimonials.length;
    return [
      { ...testimonials[(currentIndex - 1 + total) % total], position: "left" as const },
      { ...testimonials[currentIndex], position: "center" as const },
      { ...testimonials[(currentIndex + 1) % total], position: "right" as const },
    ];
  }, [currentIndex]);

  return (
    <section
      id="testimonials"
      className="w-full py-24 bg-[var(--hudson-about-bg)] flex flex-col items-center justify-center overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 space-y-3 px-8"
      >
        <span className="inline-block font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--hudson-hero-left-accent)]">
          Kind Words
        </span>
        <h2
          id="testimonials-heading"
          className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[var(--hudson-about-text)]"
        >
          Client Stories.
        </h2>
      </motion.div>

      {/* Carousel */}
      <div className="relative w-full max-w-6xl px-4 flex items-stretch justify-center">
        <div className="flex flex-row items-stretch justify-center w-full">
          {visibleItems.map((item, index) => {
            const isCenter = item.position === "center";

            return (
              <React.Fragment key={item.id}>
                {/* Hatched gap between cards */}
                {index > 0 && (
                  <div className="hidden md:block w-[12px] relative shrink-0">
                    <div className="absolute inset-0 opacity-20 h-full w-full"
                      style={{
                        backgroundImage: "repeating-linear-gradient(315deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                        backgroundSize: "8px 8px",
                        color: "var(--hudson-about-text)",
                      }}
                    />
                  </div>
                )}

                <motion.article
                  layout={!shouldReduceMotion}
                  key={item.id}
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, type: "spring", stiffness: 80, damping: 18 }}
                  style={{ willChange: "transform, opacity" }}
                  className={cn(
                    "relative flex flex-col justify-between p-8 md:p-10 w-full md:w-[300px] shrink-0 overflow-hidden",
                    isCenter
                      ? "bg-[var(--hudson-navbar-bg)] text-white z-20 border border-[var(--hudson-navbar-accent)]/30"
                      : "hidden md:flex bg-[var(--hudson-about-bg)] border border-[var(--hudson-about-text)]/10 text-[var(--hudson-about-muted)] z-0"
                  )}
                  aria-label={isCenter ? `Featured testimonial from ${item.name}` : undefined}
                >
                  {/* Fade-out overlay for side cards */}
                  {!isCenter && item.position === "left" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--hudson-about-bg)]/90 via-[var(--hudson-about-bg)]/40 to-transparent z-10 pointer-events-none" />
                  )}
                  {!isCenter && item.position === "right" && (
                    <div className="absolute inset-0 bg-gradient-to-l from-[var(--hudson-about-bg)]/90 via-[var(--hudson-about-bg)]/40 to-transparent z-10 pointer-events-none" />
                  )}

                  {/* Quote mark */}
                  <span
                    className={cn(
                      "font-serif text-5xl leading-none mb-4 select-none",
                      isCenter ? "text-[var(--hudson-navbar-accent)]" : "text-[var(--hudson-about-text)]/20"
                    )}
                    aria-hidden="true"
                  >
                    "
                  </span>

                  {/* Quote text */}
                  <p
                    className={cn(
                      "font-sans text-base md:text-lg font-medium leading-relaxed mb-8 flex-grow",
                      !isCenter && "blur-[1px] opacity-60"
                    )}
                  >
                    {item.quote}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-auto border-t pt-6"
                    style={{ borderColor: isCenter ? "rgba(255,255,255,0.1)" : "var(--hudson-about-text)/10" }}
                  >
                    <div className={cn(
                      "w-10 h-10 overflow-hidden shrink-0 border-2",
                      isCenter ? "border-[var(--hudson-navbar-accent)]" : "border-[var(--hudson-about-text)]/20"
                    )}>
                      <img
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        loading="lazy"
                        className="object-cover object-top w-full h-full"
                      />
                    </div>
                    <div className="text-left">
                      <p className={cn("font-sans font-semibold text-sm", isCenter ? "text-white" : "text-[var(--hudson-about-text)]")}>
                        {item.name}
                      </p>
                      <p className={cn("font-sans text-xs mt-0.5", isCenter ? "text-white/50" : "text-[var(--hudson-about-muted)]")}>
                        {item.role}
                      </p>
                    </div>
                  </div>
                </motion.article>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-12">
        <button
          onClick={handlePrev}
          className="group w-10 h-10 flex items-center justify-center border border-[var(--hudson-about-text)]/15 hover:border-[var(--hudson-navbar-accent)] hover:bg-[var(--hudson-navbar-accent)]/5 transition-all duration-200"
          aria-label="Previous testimonial"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--hudson-about-muted)] group-hover:text-[var(--hudson-navbar-accent)] transition-colors" />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === currentIndex
                  ? "w-6 bg-[var(--hudson-navbar-accent)]"
                  : "w-1.5 bg-[var(--hudson-about-text)]/20 hover:bg-[var(--hudson-about-text)]/40"
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="group w-10 h-10 flex items-center justify-center border border-[var(--hudson-about-text)]/15 hover:border-[var(--hudson-navbar-accent)] hover:bg-[var(--hudson-navbar-accent)]/5 transition-all duration-200"
          aria-label="Next testimonial"
        >
          <ArrowRight className="w-4 h-4 text-[var(--hudson-about-muted)] group-hover:text-[var(--hudson-navbar-accent)] transition-colors" />
        </button>
      </div>
    </section>
  );
}
