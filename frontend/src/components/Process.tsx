import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'

const STEPS = [
  {
    n: '01',
    title: 'Sketch',
    body: 'I start with the feel — dark, slow, a little glow. Then I write down what each section should do.',
  },
  {
    n: '02',
    title: 'Build',
    body: 'React for the page. Three.js for the 3D blob. GSAP for scroll. One file at a time.',
  },
  {
    n: '03',
    title: 'Polish',
    body: 'Hover states, mobile layout, and less motion if you ask for it. Small things that make it feel finished.',
  },
  {
    n: '04',
    title: 'Ship',
    body: 'Vite build, Vercel deploy, live URL. The point is a real site people can open.',
  },
]

const HEAD_A = 'From a blank file'
const HEAD_B = 'to a live 3D page.'

export function Process({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const asideRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const words = headingRef.current?.querySelectorAll('.pw')
      if (words?.length) {
        gsap.fromTo(
          words,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.035,
            ease: 'power4.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
          },
        )
      }

      if (asideRef.current) {
        gsap.fromTo(
          asideRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: asideRef.current, start: 'top 88%' },
          },
        )
      }

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.35,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: lineRef.current, start: 'top 80%' },
          },
        )
      }

      const cards = trackRef.current?.querySelectorAll('.process-card')
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.14,
            ease: 'power4.out',
            scrollTrigger: { trigger: trackRef.current, start: 'top 82%' },
          },
        )
        gsap.fromTo(
          trackRef.current.querySelectorAll('.pt'),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: 'power4.out',
            scrollTrigger: { trigger: trackRef.current, start: 'top 82%' },
          },
        )
        gsap.fromTo(
          trackRef.current.querySelectorAll('.pb'),
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: 'power3.out',
            delay: 0.18,
            scrollTrigger: { trigger: trackRef.current, start: 'top 82%' },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const wrap = (text: string, extra?: string) =>
    text.split(' ').map((w, i) => (
      <span key={`${w}-${i}`} className="-mb-1 inline-block overflow-hidden pb-1">
        <span className={`pw inline-block will-change-transform ${extra ?? ''}`}>{w}&nbsp;</span>
      </span>
    ))

  return (
    <section
      ref={sectionRef}
      id="process"
      data-testid="process-section"
      className="border-t border-white/5 px-6 py-24 md:px-12 md:py-36"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <p className="mono-label mb-6" data-testid="process-label">
            How I work
          </p>
          <h2
            ref={headingRef}
            className="max-w-2xl font-serif text-2xl leading-[1.15] tracking-tight text-paper sm:text-3xl lg:text-4xl"
          >
            {wrap(HEAD_A)}
            {wrap(HEAD_B)}
          </h2>
        </div>
        <p ref={asideRef} className="max-w-xs text-sm leading-relaxed text-white/55">
          One person, one page — idea, code, polish, then deploy.
        </p>
      </div>

      <div ref={trackRef} className="relative">
        <div
          ref={lineRef}
          aria-hidden
          className="pointer-events-none absolute left-[12%] right-[12%] top-[2.35rem] hidden origin-left scale-x-0 lg:block"
        >
          <div className="h-px w-full bg-electric/45" />
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <article
              key={s.n}
              data-testid={`process-step-${i + 1}`}
              className={`process-card group relative bg-depth-1 p-8 transition-colors duration-500 ease-weighted hover:bg-depth-2 ${reduced ? '' : 'opacity-0'}`}
            >
              <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-electric/40 bg-depth-1 font-mono text-[10px] tracking-[0.2em] text-electric">
                {s.n}
              </span>
              <h3 className="mt-8 overflow-hidden font-serif text-xl tracking-tight text-paper sm:text-2xl">
                <span className="pt inline-block will-change-transform transition-colors duration-500 group-hover:text-electric">
                  {s.title}
                </span>
              </h3>
              <p className="pb mt-3 text-sm leading-relaxed text-white/55">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
