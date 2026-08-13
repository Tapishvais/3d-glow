import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'Embed',
    body: 'We start inside your business — goals, constraints, customers. No briefs thrown over a wall.',
  },
  {
    n: '02',
    title: 'Define',
    body: 'Strategy first: positioning, roadmap, and the measurable outcome every decision answers to.',
  },
  {
    n: '03',
    title: 'Design & Build',
    body: 'Senior designers and engineers in the same room, shipping in tight weekly cycles with your team.',
  },
  {
    n: '04',
    title: 'Scale',
    body: 'Launch is the midpoint, not the finish. We measure, iterate, and compound what works.',
  },
]

export function Process({ reduced }: { reduced: boolean }) {
  return (
    <section
      id="process"
      data-testid="process-section"
      className="border-t border-white/5 px-6 py-24 md:px-12 md:py-36"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <p className="mono-label mb-6" data-testid="process-label">
            How we work
          </p>
          <h2 className="max-w-2xl font-serif text-2xl leading-[1.15] tracking-tight text-paper sm:text-3xl lg:text-4xl">
            An extension of your team, <em className="italic text-electric">not</em> an outside agency.
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-white/55">
          One integrated team, from the first workshop to launch — and long after.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            data-testid={`process-step-${i + 1}`}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1], delay: i * 0.08 }}
            className="group bg-depth-1 p-8 transition-colors duration-500 ease-weighted hover:bg-depth-2"
          >
            <span className="font-mono text-xs tracking-[0.25em] text-electric">{s.n}</span>
            <h3 className="mt-8 font-serif text-xl tracking-tight text-paper transition-colors duration-500 group-hover:text-electric sm:text-2xl">
              {s.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
