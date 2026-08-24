import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Vignette, VignetteType } from './Vignette'

interface Service {
  name: string
  tag: string
  description: string
  vignette: VignetteType
}

const SERVICES: Service[] = [
  {
    name: '3D Websites',
    tag: 'Three.js · WebGL · Shaders',
    description:
      'Real 3D in the browser — shapes, light, and shaders that move with the mouse and the scroll.',
    vignette: 'grid',
  },
  {
    name: 'Scroll Motion',
    tag: 'GSAP · Lenis · Story',
    description:
      'Pages that unfold as you scroll. Not random effects — a path from the first screen to the last.',
    vignette: 'wave',
  },
  {
    name: 'Frontend',
    tag: 'React · Vite · TypeScript',
    description:
      'Clean components, fast builds, and a layout that works on phone and desktop.',
    vignette: 'mesh',
  },
  {
    name: 'Canvas Art',
    tag: 'No photos · All code',
    description:
      'Backgrounds and project art drawn in code so the page stays light and original.',
    vignette: 'nodes',
  },
  {
    name: 'Performance',
    tag: 'Lazy 3D · Mobile · Access',
    description:
      'Heavy 3D loads late, pauses off-screen, and calms down if you prefer less motion.',
    vignette: 'poly',
  },
]

function ServiceCard({ service, index, reduced }: { service: Service; index: number; reduced: boolean }) {
  const [hover, setHover] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const vigRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { amount: 0.5 })

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !vigRef.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    vigRef.current.style.transform = `translate(${x * 14}px, ${y * 14}px)`
  }
  const onLeave = () => {
    setHover(false)
    if (vigRef.current) vigRef.current.style.transform = 'translate(0, 0)'
  }

  return (
    <article
      ref={cardRef}
      data-testid={`services-card-${index}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={() => setHover((h) => !h)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-8 transition-colors duration-500 ease-weighted hover:border-electric/40 md:p-12"
      style={{ backgroundColor: index % 2 ? '#121833' : '#0D1330' }}
    >
      <div className="grid items-start gap-8 md:grid-cols-12">
        <div className="md:col-span-1">
          <span className="font-mono text-xs tracking-[0.25em] text-electric">0{index + 1}</span>
        </div>
        <div className="md:col-span-7">
          <p className="mono-label mb-3">{service.tag}</p>
          <h3 className="font-serif text-3xl tracking-tight text-paper transition-colors duration-500 group-hover:text-electric md:text-5xl">
            {service.name}
          </h3>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-weighted [grid-template-rows:1fr] md:[grid-template-rows:0fr] ${
              hover ? 'md:[grid-template-rows:1fr]' : ''
            }`}
          >
            <p className="mt-4 max-w-xl overflow-hidden text-sm leading-relaxed text-white/55 md:mt-0 md:text-base md:group-hover:mt-4">
              {service.description}
            </p>
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="relative h-44 overflow-hidden rounded-xl border border-white/10 bg-depth-1 md:h-52">
            <div
              ref={vigRef}
              className="absolute -inset-4 transition-transform duration-300 ease-weighted will-change-transform"
            >
              <Vignette type={service.vignette} active={hover || inView} reduced={reduced} />
            </div>
          </div>
        </div>
      </div>
      <ArrowUpRight
        aria-hidden
        className="absolute right-8 top-8 h-5 w-5 text-white/30 transition-all duration-500 ease-weighted group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-electric"
      />
    </article>
  )
}

export function Services({ reduced }: { reduced: boolean }) {
  return (
    <section id="services" data-testid="services-section" className="px-6 py-28 md:px-12 md:py-44">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-24">
        <div>
          <p className="mono-label mb-6" data-testid="services-label">
            03 — Services
          </p>
          <h2 className="font-serif text-2xl leading-[1.15] tracking-tight text-paper sm:text-3xl lg:text-4xl">
            What I like to build
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-white/55">
          Five skills behind this page. Hover a card to see it move.
        </p>
      </div>

      <div className="relative">
        {SERVICES.map((s, i) => (
          <div key={s.name} className="sticky mb-6" style={{ top: `calc(5.5rem + ${i * 1.4}rem)`, zIndex: i + 1 }}>
            <ServiceCard service={s} index={i} reduced={reduced} />
          </div>
        ))}
      </div>
    </section>
  )
}
