import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'

const STATS = [
  { value: 3, suffix: 'D', label: 'Shader in the hero' },
  { value: 0, suffix: '', label: 'Stock photos used' },
  { value: 8, suffix: '', label: 'Animated sections' },
  { value: 1, suffix: '', label: 'Personal project' },
]

export function Stats({ reduced }: { reduced: boolean }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (reduced) return
    const els = refs.current.filter(Boolean) as HTMLSpanElement[]
    const tweens = els.map((el, i) => {
      const obj = { v: 0 }
      return gsap.to(obj, {
        v: STATS[i].value,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v))
        },
      })
    })
    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
    }
  }, [reduced])

  return (
    <section
      data-testid="stats-strip"
      className="border-y border-white/5 bg-depth-1/40 px-6 py-16 md:px-12 md:py-20"
      aria-label="Project statistics"
    >
      <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} data-testid={`stat-${i}`} className="text-center lg:text-left">
            <p className="font-serif text-4xl tracking-tight text-paper md:text-6xl">
              <span ref={(el) => (refs.current[i] = el)}>{reduced ? s.value : 0}</span>
              <span className="text-electric">{s.suffix}</span>
            </p>
            <p className="mono-label mt-3">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
