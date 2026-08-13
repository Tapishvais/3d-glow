import { motion } from 'framer-motion'
import { ArrowUp, Globe, Linkedin, Mail, Phone } from 'lucide-react'
import { elasticOut, scrollTo } from '../lib/scroll'

const NAV = [
  { label: 'About', href: '#manifesto', testId: 'footer-nav-link-manifesto' },
  { label: 'Services', href: '#services', testId: 'footer-nav-link-services' },
  { label: 'Work', href: '#work', testId: 'footer-nav-link-cases' },
  { label: 'Contact', href: '#contact', testId: 'footer-nav-link-contact' },
]

const SOCIALS = [
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/kurieta', testId: 'footer-social-linkedin' },
  { label: 'Email', icon: Mail, href: 'mailto:info@kurieta.com', testId: 'footer-social-email' },
  { label: 'Phone', icon: Phone, href: 'tel:+18778557799', testId: 'footer-social-phone' },
  { label: 'Website', icon: Globe, href: 'https://kurieta.com', testId: 'footer-social-website' },
]

export function Footer({ reduced }: { reduced: boolean }) {
  const letters = 'KURIETA'.split('')

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
          className="select-none whitespace-nowrap font-serif text-[clamp(4rem,16.5vw,15rem)] leading-none tracking-tight text-paper"
          aria-label="Kurieta"
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
                {l}
              </motion.span>
            </span>
          ))}
          <span className="inline-block align-top font-mono text-[clamp(0.8rem,2vw,1.5rem)] text-electric">®</span>
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
          <p className="mono-label">Start a conversation</p>
          <a
            href="mailto:hello@kurieta.com"
            data-testid="footer-email-link"
            className="nav-link w-fit font-mono text-sm tracking-[0.15em] text-paper"
          >
            hello@kurieta.com
          </a>
          <a
            href="mailto:info@kurieta.com"
            data-testid="footer-info-email-link"
            className="nav-link w-fit font-mono text-sm tracking-[0.15em] text-white/55 transition-colors duration-300 hover:text-paper"
          >
            info@kurieta.com
          </a>
          <div className="mt-2 flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
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
          © 2026 Kurieta — All case studies are sample concepts
        </p>
        <p className="mono-label">Strategy · Creativity · Technology</p>
      </div>
    </footer>
  )
}
