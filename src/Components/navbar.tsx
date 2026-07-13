"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

const navItems: NavItem[] = [
  { label: "Intro", href: "#intro", sectionId: "intro" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Services", href: "#works", sectionId: "works" },
  { label: "Testimonials", href: "#testimonials", sectionId: "testimonials" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("intro");

  // ── Frosted-glass on scroll ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile drawer when viewport widens ──────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setIsOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Active section tracker via IntersectionObserver ───────────────
  useEffect(() => {
    // The hero section doesn't have an id="intro" by default so we
    // watch it via the <section aria-label="Introduction"> element.
    // We add id="intro" on the hero section via a selector fallback.
    const sectionIds = navItems.map((n) => n.sectionId);

    const observers: IntersectionObserver[] = [];

    const callback: IntersectionObserverCallback = (entries) => {
      // Pick the entry with the largest intersection ratio that is intersecting
      const intersecting = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (intersecting.length > 0) {
        setActiveId(intersecting[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-30% 0px -60% 0px", // trigger when section is in top 40% of viewport
      threshold: [0, 0.1, 0.25, 0.5],
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    observers.push(observer);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20",
        "flex items-center justify-between px-8 md:px-16",
        "text-[var(--hudson-navbar-fg)] transition-all duration-300",
        scrolled
          ? "bg-[var(--hudson-navbar-bg)]/85 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      )}
      role="banner"
    >
      {/* ── Logo ── */}
      <a
        href="#intro"
        className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[var(--hudson-navbar-accent)] hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hudson-navbar-accent)]"
        aria-label="Adeboss — home"
      >
        Adeboss<span className="text-[var(--hudson-navbar-accent)]">.</span>
      </a>

      {/* ── Desktop Nav ── */}
      <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = activeId === item.sectionId;
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "relative py-1 font-sans text-sm font-medium tracking-wide transition-colors duration-200",
                isActive
                  ? "text-[var(--hudson-navbar-fg)]"
                  : "text-[var(--hudson-navbar-fg-muted)] hover:text-[var(--hudson-navbar-fg)]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
              {isActive && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--hudson-navbar-accent)] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* ── Mobile Hamburger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="md:hidden p-2 -mr-2 text-[var(--hudson-navbar-fg-muted)] hover:text-[var(--hudson-navbar-fg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hudson-navbar-accent)]"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-20 left-0 right-0 bg-[var(--hudson-navbar-bg)]/95 backdrop-blur-lg border-b border-white/10 shadow-xl py-6 px-8 md:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeId === item.sectionId;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "font-sans text-base font-medium py-3 px-2 border-b border-white/5 last:border-0 transition-colors flex items-center gap-3",
                      isActive
                        ? "text-[var(--hudson-navbar-fg)]"
                        : "text-[var(--hudson-navbar-fg-muted)] hover:text-[var(--hudson-navbar-fg)]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--hudson-navbar-accent)] shrink-0" />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
