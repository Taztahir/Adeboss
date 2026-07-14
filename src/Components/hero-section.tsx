import { useState, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import designerPortrait from "@/assets/Adeboss.jpeg";
import { supabase } from "@/lib/supabase";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [content, setContent] = useState({
    hero_greeting: "Hello",
    hero_name: "I'm Adebowale\nTaofeek A.",
    hero_tagline: "a creative designer"
  });

  useEffect(() => {
    supabase
      .from('site_content')
      .select('hero_greeting, hero_name, hero_tagline')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setContent({
            hero_greeting: data.hero_greeting,
            hero_name: data.hero_name,
            hero_tagline: data.hero_tagline
          });
        }
      });
  }, []);

  const slideUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: (shouldReduceMotion ? "tween" : "spring") as "tween" | "spring",
        duration: shouldReduceMotion ? 0.4 : 0.8,
        stiffness: 70,
        damping: 14,
      },
    },
  };


  const socials = [
    {
      name: "Twitter",
      href: "https://x.com/AdebowaleTaofe5",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/adebowaletaofeekadewale?igsh=MWl0b2RqMDBucmV3dA==",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@adebowaletaofeek2?_r=1&_t=ZS-936bthgAZoy",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.1.97-.24 1.94-.48 2.9-1.2 4.79-5.91 8.01-10.82 7.37-4.14-.54-7.53-3.77-8.11-7.91-.72-5.16 2.87-9.98 8.03-10.7 1.25-.17 2.52-.09 3.77-.14-.02 1.51-.02 3.02-.02 4.54-1.15.13-2.34.45-3.23 1.21-.97.83-1.42 2.13-1.22 3.39.23 1.45 1.42 2.65 2.88 2.84 1.49.2 3.03-.54 3.7-1.89.47-.94.52-2.02.49-3.05.02-3.41-.01-6.82.01-10.23z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/taofeek-adebowale-725151381?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/08111946901",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.004 2C6.48 2 2.004 6.477 2.004 12c0 1.767.46 3.427 1.267 4.887L2.004 22l5.273-1.383A9.957 9.957 0 0 0 12.004 22c5.522 0 10-4.477 10-10s-4.478-10-10-10zm5.835 14.267c-.244.688-1.217 1.249-1.684 1.309-.434.056-.983.1-2.91-.659-2.463-.97-4.045-3.473-4.167-3.637-.123-.163-.99-1.319-.99-2.518 0-1.199.63-1.787.852-2.03.223-.243.488-.305.651-.305.163 0 .326.002.468.008.148.007.348-.056.545.419.198.48.677 1.644.737 1.767.06.122.102.264.02.427-.08.162-.122.264-.244.407-.122.142-.257.319-.366.427-.122.122-.25.257-.108.502.143.243.636 1.049 1.365 1.696.938.837 1.728 1.096 1.972 1.218.244.122.386.102.529-.06.143-.163.61-.712.772-.956.163-.244.325-.203.548-.122.223.081 1.423.67 1.666.793.244.122.406.183.468.285.061.102.061.59-.183 1.277z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="intro"
      className="relative grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full overflow-hidden"
      aria-label="Introduction"
    >
      {/* ── LEFT COLUMN ── */}
      <div className="relative bg-[var(--hudson-hero-left-bg)] flex flex-col justify-center px-8 pt-28 pb-16 sm:px-12 md:px-16 lg:px-20 lg:pt-40 transition-colors duration-300">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="space-y-8 max-w-lg"
        >
          {/* Accent label */}
          <motion.span
            variants={slideUp}
            className="inline-block text-[var(--hudson-hero-left-accent)] font-sans text-xs font-bold tracking-[0.2em] uppercase"
          >
            {content.hero_greeting}
          </motion.span>

          {/* Heading */}
          <motion.h1
            variants={slideUp}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-[var(--hudson-hero-left-text)] leading-[1.08]"
          >
            {content.hero_name.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < content.hero_name.split('\n').length - 1 && <br />}
              </span>
            ))}
            <br />
            {content.hero_tagline}<span className="text-[var(--hudson-hero-left-accent)]">.</span>
          </motion.h1>

          {/* CTA buttons */}
          <motion.div variants={slideUp} className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--hudson-hero-left-text)] text-[var(--hudson-hero-left-bg)] font-sans text-xs font-bold tracking-[0.15em] uppercase hover:opacity-80 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              More About Me
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--hudson-hero-left-text)]/40 text-[var(--hudson-hero-left-text)] font-sans text-xs font-bold tracking-[0.15em] uppercase hover:border-[var(--hudson-hero-left-text)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Get In Touch
            </a>
          </motion.div>
        </motion.div>


      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="relative h-[420px] lg:h-auto bg-neutral-900 overflow-hidden">
        {/* Portrait */}
        <motion.img
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" as const }}
          src={designerPortrait}
          alt="Portrait of Adebowale Taofeek A., Creative Designer"
          className="absolute inset-0 w-full h-full grayscale object-cover object-center brightness-[0.82] contrast-[1.05]"
          loading="eager"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Social icons — vertical, right edge */}
        <nav
          aria-label="Social links"
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-10"
        >
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.href}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.2 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/70 hover:text-white transition-colors duration-200"
              aria-label={social.name}
            >
              {social.icon}
            </motion.a>
          ))}
        </nav>

        {/* Scroll indicator — bottom right circle */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 right-6 md:right-10 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors duration-200 z-10"
          aria-label="Scroll down"
        >
          {/* Down arrow */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
