import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { scrollTo } from '../lib/scroll'
import { Magnetic } from './Magnetic'

const LINKS = [
  { label: 'Manifesto', href: '#manifesto', testId: 'navbar-nav-link-manifesto' },
  { label: 'Services', href: '#services', testId: 'navbar-nav-link-services' },
  { label: 'Work', href: '#work', testId: 'navbar-nav-link-cases' },
  { label: 'Contact', href: '#contact', testId: 'navbar-nav-link-contact' },
]

export function Navbar({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollTo(href === '#top' ? 0 : href, { duration: 1.4 })
  }

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.7, 0, 0.3, 1], delay: 0.35 }}
      className={`fixed inset-x-0 top-0 z-[90] transition-[background-color,border-color] duration-500 ${
        scrolled ? 'border-b border-white/5 bg-midnight/70 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-5 md:px-12" aria-label="Primary">
        <a
          href="#top"
          data-testid="navbar-brand-logo"
          onClick={go('#top')}
          className="font-serif text-xl tracking-tight text-paper"
        >
          Kurieta<span className="text-electric">®</span>
        </a>
        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={l.testId}
              onClick={go(l.href)}
              className="nav-link font-mono text-[11px] uppercase tracking-[0.25em] text-white/55 transition-colors duration-300 hover:text-paper"
            >
              {l.label}
            </a>
          ))}
        </div>
        <Magnetic strength={0.25}>
          <button
            data-testid="navbar-cta"
            onClick={() => scrollTo('#contact', { duration: 1.6 })}
            className="rounded-full border border-electric/50 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors duration-500 ease-weighted hover:bg-electric"
          >
            Start a Project
          </button>
        </Magnetic>
      </nav>
    </motion.header>
  )
}
