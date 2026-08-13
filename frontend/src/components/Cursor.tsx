import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const dotX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 })
  const dotY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 })
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.7 })
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.7 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    document.documentElement.classList.add('custom-cursor')
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHovering(!!t?.closest('a, button, input, textarea, [data-magnetic]'))
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        data-testid="custom-cursor-dot"
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[210] h-2 w-2 rounded-full bg-electric"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[209] h-9 w-9 rounded-full border border-electric/50"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hovering ? 1.9 : 1, opacity: hovering ? 0.9 : 0.45 }}
        transition={{ duration: 0.35, ease: [0.7, 0, 0.3, 1] }}
      />
    </>
  )
}
