import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { supabase } from "@/lib/supabase";

export default function AboutSection() {
  const [paragraphs, setParagraphs] = useState({
    p1: "I am Adebowale Taofeek A., a creative designer with multiple years of experience in the design and print industry. My expertise across different fields helps me to create designs that are not only aesthetically pleasing but also functional.",
    p2: "Over the years, I've worked with multiple brands and niches spanning across Tech, Beauty, Furniture amongst others. My work process is a combination of deep research and careful thought process which allows me to build a functional design system."
  });

  useEffect(() => {
    supabase
      .from('site_content')
      .select('about_paragraph_1, about_paragraph_2')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setParagraphs({
            p1: data.about_paragraph_1,
            p2: data.about_paragraph_2
          });
        }
      });
  }, []);

  const paragraph1 = paragraphs.p1;
  const paragraph2 = paragraphs.p2;

  return (
    <section
      id="about"
      className="py-24 px-8 sm:px-12 md:px-16 lg:px-24 bg-[var(--hudson-about-bg)] text-[var(--hudson-about-text)] transition-colors duration-300 relative z-10"
      aria-labelledby="about-heading"
      style={{ contentVisibility: "auto" }}
    >
      {/* Container to constrain width for a premium editorial layout */}
      <div className="max-w-7xl mx-auto">
        {/* Header Block with Watermark */}
        <div className="relative mb-16 select-none">
          {/* Watermark "01" */}
          <span
            className="font-serif text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[14rem] font-bold text-neutral-200/50 dark:text-neutral-800/30 leading-none absolute -left-4 -top-16 sm:-top-20 md:-top-24 pointer-events-none"
            aria-hidden="true"
          >
            01
          </span>
          {/* Title */}
          <h2
            id="about-heading"
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight relative z-10 text-[var(--hudson-about-text)]"
          >
            About Me.
          </h2>
        </div>

        {/* Scroll Reveal Text Blocks */}
        <div className="space-y-8 md:space-y-12">
          <ScrollReveal
            baseRotation={1.5}
            blurStrength={3}
            textClassName="text-base sm:text-lg md:text-xl lg:text-[1.35rem] font-normal leading-relaxed text-[var(--hudson-about-muted)] tracking-wide"
            containerClassName="my-0"
          >
            {paragraph1}
          </ScrollReveal>

          <ScrollReveal
            baseRotation={-1.5}
            blurStrength={3}
            textClassName="text-base sm:text-lg md:text-xl lg:text-[1.35rem] font-normal leading-relaxed text-[var(--hudson-about-muted)] tracking-wide"
            containerClassName="my-0"
          >
            {paragraph2}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
