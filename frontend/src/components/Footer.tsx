import { motion } from 'framer-motion'
import { ArrowUp, Github, Globe } from 'lucide-react'
import { elasticOut, scrollTo } from '../lib/scroll'

const NAV = [
  { label: 'About', href: '#manifesto', testId: 'footer-nav-link-manifesto' },
  { label: 'Services', href: '#services', testId: 'footer-nav-link-services' },
  { label: 'Work', href: '#work', testId: 'footer-nav-link-cases' },
  { label: 'Contact', href: '#contact', testId: 'footer-nav-link-contact' },
]

const SOCIALS = [
  { label: 'GitHub', icon: Github, href: 'https://github.com/Tapishvais', testId: 'footer-social-github' },
  { label: 'Live site', icon: Globe, href: 'https://3d-glow.vercel.app', testId: 'footer-social-website' },
]

export function Footer({ reduced }: { reduced: boolean }) {
  const letters = '3D GLOW'.split('')

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollTo(href, { duration: 1.4 })
  }

  return (
    <footer data-testid="site-footer" className="border-t border-white/5 bg-depth-1 px-6 pb-10 pt-24 md:px-12">
      <div className="overflow-hidden">
        <motion.h2
          data-testid="footer-wordmark"
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="select-none whitespace-nowrap font-serif text-[clamp(3rem,14vw,12rem)] leading-none tracking-tight text-paper"
          aria-label="3D Glow"
        >
          {letters.map((l, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2">
              <motion.span
                variants={{
                  hidden: { y: '110%' },
                  show: { y: 0, transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1], delay: i * 0.05 } },
                }}
                className="inline-block cursor-default transition-colors duration-300 hover:text-electric"
              >
                {l === ' ' ? '\u00a0' : l}
              </motion.span>
            </span>
          ))}
        </motion.h2>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-12 border-t border-white/5 pt-12 md:flex-row md:items-start">
        <nav className="flex flex-col gap-4" aria-label="Footer">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={l.testId}
              onClick={go(l.href)}
              className="nav-link w-fit font-mono text-[11px] uppercase tracking-[0.25em] text-white/55 transition-colors duration-300 hover:text-paper"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <p className="mono-label">Find me</p>
          <a
            href="https://github.com/Tapishvais"
            target="_blank"
            rel="noreferrer"
            data-testid="footer-email-link"
            className="nav-link w-fit font-mono text-sm tracking-[0.15em] text-paper"
          >
            github.com/Tapishvais
          </a>
          <div className="mt-2 flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-testid={s.testId}
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-500 ease-weighted hover:border-electric hover:bg-electric hover:text-paper"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <button
          data-testid="footer-back-to-top-button"
          onClick={() => scrollTo(0, { duration: 2, easing: elasticOut })}
          aria-label="Back to top"
          className="group flex h-14 w-14 items-center justify-center self-start rounded-full border border-electric/50 text-paper transition-colors duration-500 ease-weighted hover:bg-electric md:self-auto"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-500 ease-elastic group-hover:-translate-y-1" />
        </button>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/5 pt-8 md:flex-row md:items-center">
        <p className="mono-label" data-testid="footer-copyright">
          © 2026 3D Glow — Personal project · sample work only
        </p>
        <p className="mono-label">3D · Motion · Web</p>
      </div>
    </footer>
  )
}
