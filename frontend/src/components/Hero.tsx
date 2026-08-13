import { lazy, Suspense, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { gsap, scrollTo } from '../lib/scroll'
import { Magnetic } from './Magnetic'

const BlobScene = lazy(() => import('./three/BlobScene'))

function Poster() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div
        className="absolute right-[10%] top-1/2 h-[46vmin] w-[46vmin] -translate-y-1/2 rounded-full bg-depth-3"
        style={{
          boxShadow:
            '0 0 140px 30px rgba(61,92,255,0.28), inset 0 0 90px rgba(61,92,255,0.4), inset -20px -20px 80px rgba(255,45,98,0.12)',
        }}
      />
    </div>
  )
}

export function Hero({ started, reduced }: { started: boolean; reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef = useRef<(HTMLSpanElement | null)[]>([])
  const metaRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { amount: 0.15 })

  useEffect(() => {
    if (!started) return
    const els = linesRef.current.filter(Boolean) as HTMLSpanElement[]
    if (reduced) {
      gsap.set(els, { y: 0, yPercent: 0 })
      if (metaRef.current) gsap.set(metaRef.current.children, { opacity: 1, y: 0 })
      return
    }
    gsap.set(els, { y: 0, yPercent: 115 })
    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(els, { yPercent: 0, duration: 1.15, stagger: 0.13, ease: 'power4.out' })
    if (metaRef.current) {
      tl.fromTo(
        metaRef.current.children,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.7',
      )
    }
    return () => {
      tl.kill()
    }
  }, [started, reduced])

  const lineStyle = { transform: 'translateY(115%)' }

  return (
    <section
      ref={sectionRef}
      id="top"
      data-testid="hero-section"
      className="relative flex h-[100svh] flex-col overflow-hidden"
    >
      <div className="absolute inset-0">
        {reduced ? (
          <Poster />
        ) : (
          <Suspense fallback={<Poster />}>
            <BlobScene active={inView && started} />
          </Suspense>
        )}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pb-10 pt-28 md:px-12 md:pb-12">
        <div ref={metaRef} className="flex items-start justify-between">
          <p className="mono-label opacity-0">Boutique Digital Agency</p>
          <p className="mono-label hidden opacity-0 md:block">Indianapolis — Worldwide</p>
        </div>

        <div>
          <h1
            data-testid="hero-headline"
            className="max-w-[9.5em] font-serif text-[clamp(2.9rem,7.6vw,6.75rem)] font-normal leading-[1.04] tracking-tight text-paper"
          >
            <span className="block overflow-hidden pb-1">
              <span ref={(el) => (linesRef.current[0] = el)} className="block will-change-transform" style={lineStyle}>
                Strategy.
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span ref={(el) => (linesRef.current[1] = el)} className="block will-change-transform" style={lineStyle}>
                Creativity.
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span ref={(el) => (linesRef.current[2] = el)} className="block will-change-transform" style={lineStyle}>
                Technology.
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span ref={(el) => (linesRef.current[3] = el)} className="block will-change-transform" style={lineStyle}>
                In service of <em className="italic text-crimson">outcomes.</em>
              </span>
            </span>
          </h1>
        </div>

        <div className="flex items-end justify-between gap-8">
          <div className="pointer-events-auto">
            <Magnetic strength={0.3}>
              <button
                data-testid="hero-primary-cta"
                onClick={() => scrollTo('#contact', { duration: 1.8 })}
                className="group flex items-center gap-4 rounded-full border border-electric/60 px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-paper transition-colors duration-500 ease-weighted hover:bg-electric"
              >
                Initiate Collaboration
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-electric transition-colors duration-500 group-hover:bg-paper" />
              </button>
            </Magnetic>
          </div>
          <div data-testid="hero-scroll-cue" className="flex items-center gap-4 pb-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-electric"
              style={{ animation: 'pulse-dot 2.6s ease-in-out infinite' }}
            />
            <span className="mono-label">Scroll</span>
            <span className="hidden h-px w-20 bg-white/15 md:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
