import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/scroll'

const CHAPTERS = [
  {
    n: '01',
    title: 'Radical Outcome Focus',
    body: 'Every pixel, line of code, and campaign is accountable to a measurable business result. Aesthetics are the vehicle; outcomes are the destination.',
  },
  {
    n: '02',
    title: 'Precision over Noise',
    body: 'We subtract until only the essential remains. Clarity converts where decoration distracts.',
  },
  {
    n: '03',
    title: 'Architectural Rigor',
    body: 'Sub-second loads, semantic markup, resilient systems. The craft beneath the surface is what compounds.',
  },
  {
    n: '04',
    title: 'Human-Centric Futures',
    body: 'Technology should feel inevitable and humane. We build for the person on the other side of the screen.',
  },
]

const KINETIC =
  'Kurieta is a boutique consulting, branding, marketing, and technology partner — working as an extension of your team to deliver results that matter.'

function KineticText({ text, reduced }: { text: string; reduced: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (reduced || !ref.current) return
    const words = ref.current.querySelectorAll('.kw')
    const tween = gsap.fromTo(
      words,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.022,
        ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced])
  return (
    <p
      ref={ref}
      data-testid="manifesto-kinetic-text"
      className="font-serif text-2xl leading-[1.35] tracking-tight text-paper sm:text-3xl lg:text-4xl"
    >
      {text.split(' ').map((w, i) => (
        <span key={i} className="-mb-1 inline-block overflow-hidden pb-1">
          <span className="kw inline-block will-change-transform">{w}&nbsp;</span>
        </span>
      ))}
    </p>
  )
}

export function Manifesto({ reduced }: { reduced: boolean }) {
  return (
    <section id="manifesto" data-testid="manifesto-section" className="relative px-6 py-28 md:px-12 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute right-4 top-24 hidden select-none lg:block"
        style={{ perspective: '800px' }}
      >
        <span
          className="k-spin block font-serif text-[11rem] leading-none text-depth-3"
          style={{ transformStyle: 'preserve-3d', textShadow: '0 0 90px rgba(61,92,255,0.22)' }}
        >
          K
        </span>
      </div>

      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="mono-label mb-6" data-testid="manifesto-label">
              02 — About / Manifesto
            </p>
            <h2 className="font-serif text-2xl leading-[1.15] tracking-tight text-paper sm:text-3xl lg:text-4xl">
              The principles
              <br />
              we build on.
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              Not an outside agency — an extension of your team. Four commitments, held without exception, on
              every engagement we accept.
            </p>
            <div className="mt-10 space-y-2">
              <p className="mono-label">Est. 2015 — Indianapolis</p>
              <p className="mono-label">US · India · Canada · UK</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <KineticText text={KINETIC} reduced={reduced} />
          <div className="mt-20">
            {CHAPTERS.map((c, i) => (
              <motion.div
                key={c.n}
                data-testid={`manifesto-chapter-${i + 1}`}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1], delay: 0.05 * i }}
                className="group flex gap-8 border-t border-white/10 py-9 md:gap-14"
              >
                <span className="pt-1 font-mono text-xs tracking-[0.25em] text-electric">{c.n}</span>
                <div>
                  <h3 className="font-serif text-xl leading-snug text-paper transition-colors duration-500 group-hover:text-electric sm:text-2xl">
                    {c.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
