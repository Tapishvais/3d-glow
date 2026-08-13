import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const scrollState = { velocity: 0 }

let lenis: Lenis | null = null

export function initSmoothScroll(enabled: boolean): Lenis | null {
  if (!enabled || lenis) return lenis
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = Math.max(-30, Math.min(30, l.velocity))
    ScrollTrigger.update()
  })
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

export function scrollTo(
  target: string | number,
  opts?: { duration?: number; easing?: (t: number) => number },
) {
  if (lenis) {
    lenis.scrollTo(target as never, { duration: opts?.duration ?? 1.4, easing: opts?.easing })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export const elasticOut = (t: number): number => {
  if (t === 0 || t === 1) return t
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

export { gsap, ScrollTrigger }
