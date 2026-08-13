import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { initSmoothScroll, startScroll, stopScroll, ScrollTrigger } from './lib/scroll'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Manifesto } from './components/Manifesto'
import { Services } from './components/Services'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

const GRAIN =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>"

export default function App() {
  const reduced = useReducedMotion()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    initSmoothScroll(!reduced)
  }, [reduced])

  useEffect(() => {
    if (!loaded) {
      stopScroll()
      document.body.style.overflow = 'hidden'
    } else {
      startScroll()
      document.body.style.overflow = ''
      const t = setTimeout(() => ScrollTrigger.refresh(), 120)
      return () => clearTimeout(t)
    }
  }, [loaded])

  return (
    <div className="min-h-screen bg-midnight font-sans text-paper antialiased">
      <Cursor />
      <AnimatePresence>{!loaded && <Preloader onComplete={() => setLoaded(true)} />}</AnimatePresence>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] opacity-[0.05]"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />
      <Navbar visible={loaded} />
      <main>
        <Hero started={loaded} reduced={reduced} />
        <Marquee />
        <Manifesto reduced={reduced} />
        <Services reduced={reduced} />
        <CaseStudies reduced={reduced} />
        <Contact reduced={reduced} />
      </main>
      <Footer reduced={reduced} />
      <Toaster theme="dark" position="bottom-center" />
    </div>
  )
}
