import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/scroll'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const counterRef = useRef<HTMLSpanElement>(null)
  const exitingRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obj = { v: 0 }
    const tl = gsap.timeline()
    tl.to(obj, {
      v: 100,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(obj.v)).padStart(3, '0')
        }
      },
    })
    tl.add(() => {
      exitingRef.current = true
      if (rootRef.current) {
        gsap.to(rootRef.current, {
          clipPath: 'inset(50% 0% 50% 0%)',
          duration: 0.65,
          ease: 'power4.inOut',
          onComplete,
        })
      } else {
        onComplete()
      }
    }, '+=0.2')
    return () => {
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      ref={rootRef}
      data-testid="preloader-container"
      className="fixed inset-0 z-[150] flex items-center justify-center bg-depth-1"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      role="status"
      aria-label="Loading Kurieta"
    >
      <div className="absolute left-6 top-6 md:left-12 md:top-10">
        <span className="mono-label">Kurieta® — Digital Agency</span>
      </div>
      <div className="absolute right-6 top-6 md:right-12 md:top-10">
        <span className="mono-label">©2026</span>
      </div>

      <svg
        data-testid="preloader-wordmark"
        viewBox="0 0 640 130"
        className="w-[min(72vw,560px)]"
        aria-label="Kurieta"
        role="img"
      >
        <text x="50%" y="74%" textAnchor="middle" fontSize="98" className="preloader-text">
          KURIETA
        </text>
      </svg>

      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12">
        <span className="mono-label">Loading experience</span>
      </div>
      <div className="absolute bottom-4 right-6 md:bottom-8 md:right-12">
        <span
          ref={counterRef}
          data-testid="preloader-counter"
          className="font-mono text-6xl font-medium tracking-tight text-paper md:text-8xl"
        >
          000
        </span>
      </div>
    </motion.div>
  )
}
