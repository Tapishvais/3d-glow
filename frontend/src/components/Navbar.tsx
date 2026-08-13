import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { scrollTo } from '../lib/scroll'
import { Magnetic } from './Magnetic'

const LINKS = [
  { label: 'About', href: '#manifesto', testId: 'navbar-nav-link-manifesto' },
  { label: 'Services', href: '#services', testId: 'navbar-nav-link-services' },
  { label: 'Work', href: '#work', testId: 'navbar-nav-link-cases' },
  { label: 'Contact', href: '#contact', testId: 'navbar-nav-link-contact' },
]

export function Navbar({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
        <Magnetic strength={0.25} className="hidden md:block">
          <button
            data-testid="navbar-cta"
            onClick={() => scrollTo('#contact', { duration: 1.6 })}
            className="rounded-full border border-electric/50 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors duration-500 ease-weighted hover:bg-electric"
          >
            Start a Project
          </button>
        </Magnetic>
        <button
          data-testid="navbar-mobile-menu-button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-paper md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="navbar-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-[120] flex flex-col justify-between bg-depth-1 px-6 pb-10 pt-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl tracking-tight text-paper">
                Kurieta<span className="text-electric">®</span>
              </span>
              <button
                data-testid="navbar-mobile-close-button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-paper"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-7" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  data-testid={`${l.testId}-mobile`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1], delay: 0.15 + i * 0.08 }}
                  onClick={(e) => {
                    setOpen(false)
                    go(l.href)(e)
                  }}
                  className="w-fit font-serif text-5xl tracking-tight text-paper transition-colors duration-300 hover:text-electric"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.button
                data-testid="navbar-mobile-cta"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1], delay: 0.5 }}
                onClick={() => {
                  setOpen(false)
                  scrollTo('#contact', { duration: 1.4 })
                }}
                className="mt-4 w-fit rounded-full bg-electric px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-paper"
              >
                Start a Project
              </motion.button>
            </nav>
            <a
              href="mailto:hello@kurieta.com"
              data-testid="navbar-mobile-email"
              className="font-mono text-sm tracking-[0.15em] text-white/55"
            >
              hello@kurieta.com
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
