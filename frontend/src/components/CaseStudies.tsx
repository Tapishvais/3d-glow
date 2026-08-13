import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { gsap, scrollTo } from '../lib/scroll'
import { Magnetic } from './Magnetic'
import { ProjectArt } from './ProjectArt'

interface Project {
  title: string
  subtitle: string
  category: string
  year: string
  colors: [string, string, string]
  variant: 'orb' | 'chart' | 'editorial' | 'pulse'
}

const PROJECTS: Project[] = [
  {
    title: 'Aura AI',
    subtitle: 'Next-Gen Intelligence Portal',
    category: 'Brand Strategy · Web Platform',
    year: '2026',
    variant: 'orb',
    colors: ['#3D5CFF', '#8FA2FF', '#0A0E1F'],
  },
  {
    title: 'Kinetik',
    subtitle: 'High-Velocity Trading Interface',
    category: 'Web Development · Fintech',
    year: '2026',
    variant: 'chart',
    colors: ['#3D5CFF', '#FF2D62', '#060814'],
  },
  {
    title: 'Nova Studio',
    subtitle: 'Spatial Design Collective',
    category: 'Editorial Brand Identity',
    year: '2025',
    variant: 'editorial',
    colors: ['#8FA2FF', '#3D5CFF', '#121833'],
  },
  {
    title: 'Lumen Health',
    subtitle: 'Biometric Diagnostics UI',
    category: 'Automation · Web App',
    year: '2025',
    variant: 'pulse',
    colors: ['#FF2D62', '#3D5CFF', '#0A0E1F'],
  },
]

export function CaseStudies({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 250, damping: 25, mass: 0.5 })
  const py = useSpring(my, { stiffness: 250, damping: 25, mass: 0.5 })

  useEffect(() => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return
      const amount = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, {
        x: () => -amount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(track, { x: 0 })
      }
    })
    return () => mm.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="work"
      data-testid="case-studies-section"
      className="relative overflow-hidden lg:h-screen"
      onMouseMove={(e) => {
        mx.set(e.clientX + 28)
        my.set(e.clientY - 12)
      }}
    >
      <motion.div
        data-testid="case-cursor-preview"
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block"
        style={{ x: px, y: py }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
        transition={{ duration: 0.35, ease: [0.7, 0, 0.3, 1] }}
      >
        <span className="mono-label rounded-full border border-electric/40 bg-depth-1/80 px-4 py-2 text-paper backdrop-blur">
          {hovered}
        </span>
      </motion.div>

      <div
        ref={trackRef}
        className="flex flex-col gap-20 px-6 py-24 will-change-transform md:px-12 lg:h-screen lg:w-max lg:flex-row lg:items-center lg:gap-16 lg:py-0"
      >
        <div className="shrink-0 lg:w-[38vw]">
          <p className="mono-label mb-6" data-testid="case-studies-label">
            04 — Selected Work
          </p>
          <h2 className="font-serif text-2xl leading-[1.15] tracking-tight text-paper sm:text-3xl lg:text-4xl">
            Concept case studies,
            <br />
            crafted end to end.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
            Every project shown is a <span className="text-paper">sample concept</span> — designed and built in-house
            to demonstrate craft. No client claims, no borrowed logos.
          </p>
          <p className="mono-label mt-10 hidden lg:block">Scroll →</p>
        </div>

        {PROJECTS.map((p, i) => (
          <article
            key={p.title}
            data-testid={`case-study-card-${i}`}
            onMouseEnter={() => setHovered(`${String(i + 1).padStart(2, '0')} — ${p.title}`)}
            onMouseLeave={() => setHovered(null)}
            className="group w-full shrink-0 lg:w-[58vw] lg:max-w-[840px]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-depth-1">
              <div className="absolute inset-0 transition-transform duration-700 ease-weighted group-hover:scale-[1.05]">
                <ProjectArt colors={p.colors} seed={i + 1} variant={p.variant} reduced={reduced} />
              </div>
              <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
              <span
                data-testid={`case-study-badge-${i}`}
                className="absolute left-5 top-5 rounded-full border border-white/15 bg-depth-1/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 backdrop-blur"
              >
                Sample Work
              </span>
              <span aria-hidden className="absolute bottom-3 right-6 select-none font-serif text-7xl text-white/10">
                0{i + 1}
              </span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-6">
              <div>
                <p className="mono-label mb-2">
                  {p.category} — {p.year}
                </p>
                <h3 className="font-serif text-2xl tracking-tight text-paper md:text-4xl">
                  {p.title} <span className="text-white/35">— {p.subtitle}</span>
                </h3>
              </div>
              <Magnetic strength={0.3} className="shrink-0">
                <button
                  data-testid={`case-study-view-${i}`}
                  onClick={() => scrollTo('#contact', { duration: 1.6 })}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors duration-500 ease-weighted hover:border-electric hover:bg-electric"
                >
                  View Concept
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
