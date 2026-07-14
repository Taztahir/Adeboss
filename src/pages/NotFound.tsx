import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 15,
      },
    },
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--hudson-navbar-bg)', color: 'var(--hudson-navbar-fg)' }}
    >
      {/* ── Background decoration ── */}
      <span
        className="font-serif font-bold text-white/[0.02] leading-none absolute pointer-events-none select-none"
        style={{ fontSize: 'clamp(12rem, 35vw, 30rem)', top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}
        aria-hidden="true"
      >
        404
      </span>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-8"
        aria-labelledby="err-heading"
      >
        {/* Stark numbers */}
        <motion.div variants={itemVariants} className="space-y-2">
          <p
            className="font-mono text-xs font-bold tracking-[0.3em] uppercase"
            style={{ color: 'var(--hudson-navbar-accent)' }}
          >
            Error Code
          </p>
          <h1
            id="err-heading"
            className="font-serif text-8xl md:text-9xl font-bold tracking-tight"
            style={{ color: 'var(--hudson-navbar-fg)' }}
          >
            404
          </h1>
        </motion.div>

        {/* Informative text */}
        <motion.div variants={itemVariants} className="space-y-4">
          <p className="font-serif text-xl md:text-2xl font-bold tracking-tight">
            Page Not Found.
          </p>
          <p
            className="font-sans text-xs md:text-sm leading-relaxed max-w-xs md:max-w-sm mx-auto"
            style={{ color: 'var(--hudson-navbar-fg-muted)' }}
          >
            The link you followed may be broken, or the page has been moved. Let's get you back on track.
          </p>
        </motion.div>

        {/* CTA Home Button */}
        <motion.div variants={itemVariants} className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-black font-sans text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
        </motion.div>
      </motion.main>

      {/* ── Brand watermark footer ── */}
      <footer className="absolute bottom-8 left-0 right-0 text-center select-none pointer-events-none">
        <p className="font-serif text-xs font-bold tracking-widest opacity-20">
          Adeboss<span style={{ color: 'var(--hudson-navbar-accent)' }}>.</span>
        </p>
      </footer>
    </div>
  )
}
