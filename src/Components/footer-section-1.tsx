import { useState, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { supabase } from "@/lib/supabase";

const followLinks = [
  { name: "Instagram", href: "https://www.instagram.com/adebowaletaofeekadewale?igsh=MWl0b2RqMDBucmV3dA==" },
  { name: "TikTok", href: "https://www.tiktok.com/@adebowaletaofeek2?_r=1&_t=ZS-936bthgAZoy" },
  { name: "Twitter / X", href: "https://x.com/AdebowaleTaofe5" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/taofeek-adebowale-725151381?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
  { name: "WhatsApp", href: "https://wa.me/08111946901" }
];

export default function Footer1() {
  const shouldReduceMotion = useReducedMotion();
  const [contact, setContact] = useState({
    blurb: "I am always open to discussing new design challenges, branding projects, or print design systems. Let's create something beautiful and functional together.",
    email: "adebowaletaofeek74@gmail.com",
    phone: "+234 811 194 6901",
    cv_url: "#"
  });

  useEffect(() => {
    supabase
      .from('site_content')
      .select('contact_blurb, contact_email, contact_phone, cv_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setContact({
            blurb: data.contact_blurb,
            email: data.contact_email,
            phone: data.contact_phone,
            cv_url: data.cv_url || "#"
          });
        }
      });
  }, []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 18 },
    },
  };

  return (
    <footer
      id="contact"
      className="relative px-8 sm:px-12 md:px-16 lg:px-24 bg-[var(--hudson-navbar-bg)] text-[var(--hudson-navbar-fg)] overflow-hidden"
      aria-label="Contact and footer"
    >
      {/* ── Main contact block ── */}
      <div className="max-w-7xl mx-auto  pt-24 pb-16">

        {/* Section Header */}
        <div className="relative mb-16 select-none">
          {/* Watermark "05" (Intro, About, Works, Tools, Contact is #5) */}
          <span
            className="font-serif font-bold text-white/[0.04] leading-none absolute -left-4 -top-16 pointer-events-none"
            style={{ fontSize: "clamp(6rem, 16vw, 14rem)" }}
            aria-hidden="true"
          >
            05
          </span>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight relative z-10"
          >
            Get In Touch.
          </motion.h2>
        </div>

        {/* ── Grid: left content + right columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">

          {/* Left: blurb + CTAs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="md:col-span-5 flex flex-col gap-8"
          >
            <p className="font-sans text-sm sm:text-base leading-relaxed text-[var(--hudson-navbar-fg-muted)] max-w-sm">
              {contact.blurb}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* MESSAGE ME — filled accent */}
              <a
                href={`mailto:${contact.email}`}
                className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-[var(--hudson-navbar-accent)] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hudson-navbar-accent)]"
              >
                Message Me
              </a>

              {/* GET MY CV — outlined */}
              <a
                href={contact.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-6 py-4 border border-[var(--hudson-navbar-fg)]/30 text-[var(--hudson-navbar-fg)] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:border-[var(--hudson-navbar-fg)]/70 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label="Download CV"
              >
                Get My CV
              </a>
            </div>
          </motion.div>

          {/* Right: Follow Me + Contact Me */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10"
          >
            {/* Follow Me */}
            <div>
              <h3 className="font-sans text-sm font-bold tracking-[0.15em] uppercase text-[var(--hudson-navbar-fg)] mb-5">
                Follow Me
              </h3>
              <nav aria-label="Social links">
                <ul className="flex flex-col gap-3">
                  {followLinks.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm text-[var(--hudson-navbar-fg-muted)] hover:text-[var(--hudson-navbar-fg)] transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Contact Me */}
            <div>
              <h3 className="font-sans text-sm font-bold tracking-[0.15em] uppercase text-[var(--hudson-navbar-fg)] mb-5">
                Contact Me
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-sans text-sm text-[var(--hudson-navbar-fg-muted)] hover:text-[var(--hudson-navbar-fg)] transition-colors duration-200"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-[var(--hudson-navbar-fg-muted)] hover:text-[var(--hudson-navbar-fg)] transition-colors duration-200"
                  >
                    {contact.phone}
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="#intro"
            className="font-serif text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
            aria-label="Adeboss — home"
          >
            Adeboss<span className="text-[var(--hudson-navbar-accent)]">.</span>
          </a>
          <p className="font-sans text-xs text-[var(--hudson-navbar-fg-muted)]">
            © {new Date().getFullYear()} Adeboss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
