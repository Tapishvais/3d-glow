import { useEffect, useRef } from 'react'

interface ProjectArtProps {
  colors: [string, string, string]
  seed: number
  variant: 'orb' | 'chart' | 'editorial' | 'pulse'
  reduced: boolean
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function ProjectArt({ colors, seed, variant, reduced }: ProjectArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const visibleRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = seed * 3.7
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const r = parent.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(r.width * dpr))
      canvas.height = Math.max(1, Math.floor(r.height * dpr))
    }
    resize()
    window.addEventListener('resize', resize)

    const rgb = colors.map(hexToRgb)
    const rand = mulberry32(seed * 997)

    const candles = Array.from({ length: 26 }, () => {
      const o = rand()
      const c = Math.min(1, Math.max(0, o + (rand() - 0.5) * 0.5))
      return {
        o,
        c,
        h: Math.min(1.1, Math.max(o, c) + rand() * 0.15),
        l: Math.max(-0.1, Math.min(o, c) - rand() * 0.15),
        up: c >= o,
      }
    })
    const blocks = Array.from({ length: 7 }, () => ({
      x: rand(),
      y: rand(),
      w: 0.08 + rand() * 0.22,
      h: 0.02 + rand() * 0.05,
    }))
    const ecgY = (x: number) => {
      const f = (x * 3) % 1
      return (
        Math.sin(x * 40) * 0.012 +
        Math.exp(-Math.pow(f - 0.1, 2) / 0.0004) * 0.3 -
        Math.exp(-Math.pow(f - 0.17, 2) / 0.0012) * 0.13 +
        Math.exp(-Math.pow(f - 0.45, 2) / 0.02) * 0.05
      )
    }

    const renderOrb = (W: number, H: number) => {
      const cx = W * 0.6
      const cy = H * 0.42
      const R = Math.min(W, H) * 0.24
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      g.addColorStop(0, 'rgba(224,230,255,0.85)')
      g.addColorStop(0.4, 'rgba(61,92,255,0.4)')
      g.addColorStop(1, 'rgba(61,92,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
      ctx.lineWidth = 1
      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = `rgba(150,168,255,${0.4 - k * 0.11})`
        ctx.beginPath()
        ctx.ellipse(cx, cy, R * (1.15 + k * 0.3), R * (0.5 + k * 0.16), t * (0.12 + k * 0.05) + k, 0, Math.PI * 2)
        ctx.stroke()
      }
      for (let k = 0; k < 8; k++) {
        const a = t * 0.45 + (k * Math.PI * 2) / 8
        const rr = R * (1.1 + (k % 3) * 0.3)
        ctx.fillStyle = k === 0 ? 'rgba(255,45,98,0.95)' : 'rgba(190,202,255,0.85)'
        ctx.beginPath()
        ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.5, k === 0 ? 3 : 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const renderChart = (W: number, H: number) => {
      const n = candles.length
      const cw = (W * 0.78) / n
      const x0 = W * 0.11
      const yMid = H * 0.56
      const amp = H * 0.3
      candles.forEach((c, i) => {
        const x = x0 + i * cw + cw * 0.5
        const col = c.up ? 'rgba(96,124,255,0.85)' : 'rgba(255,45,98,0.65)'
        ctx.strokeStyle = col
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, yMid - c.h * amp)
        ctx.lineTo(x, yMid - c.l * amp)
        ctx.stroke()
        const top = yMid - Math.max(c.o, c.c) * amp
        const bot = yMid - Math.min(c.o, c.c) * amp
        ctx.fillStyle = col
        ctx.fillRect(x - cw * 0.26, top, cw * 0.52, Math.max(2, bot - top))
      })
      ctx.strokeStyle = 'rgba(226,232,255,0.75)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      candles.forEach((c, i) => {
        const x = x0 + i * cw + cw * 0.5
        const y = yMid - c.c * amp + Math.sin(t * 1.3 + i * 0.6) * 5
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      const idx = Math.floor(((t * 0.12) % 1) * n)
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.beginPath()
      ctx.arc(
        x0 + idx * cw + cw * 0.5,
        yMid - candles[idx].c * amp + Math.sin(t * 1.3 + idx * 0.6) * 5 - 12,
        3,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }

    const renderEditorial = (W: number, H: number) => {
      const drift = Math.sin(t * 0.4) * 6
      ctx.strokeStyle = 'rgba(200,210,255,0.22)'
      ctx.lineWidth = 1
      for (let i = 1; i < 6; i++) {
        ctx.beginPath()
        ctx.moveTo((W * i) / 6 + drift, H * 0.12)
        ctx.lineTo((W * i) / 6 + drift, H * 0.88)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(W * 0.08, H * 0.32 + drift * 0.5)
      ctx.lineTo(W * 0.92, H * 0.32 + drift * 0.5)
      ctx.stroke()
      blocks.forEach((b, i) => {
        ctx.fillStyle = i === 2 ? 'rgba(255,45,98,0.5)' : 'rgba(185,198,255,0.4)'
        ctx.fillRect(W * (0.08 + b.x * 0.6) + drift, H * (0.14 + b.y * 0.62), W * b.w, H * b.h)
      })
      ctx.strokeStyle = 'rgba(150,168,255,0.45)'
      ctx.beginPath()
      ctx.arc(W * 0.22 + drift, H * 0.72, Math.min(W, H) * 0.16, 0, Math.PI * 2)
      ctx.stroke()
    }

    const renderPulse = (W: number, H: number) => {
      const yMid = H * 0.48
      const cx = W * 0.76
      const cy = H * 0.62
      const step = Math.min(W, H) * 0.13
      for (let k = 1; k <= 3; k++) {
        const rr = ((t * 20) % step) + step * k
        ctx.strokeStyle = `rgba(255,45,98,${Math.max(0, 0.5 - rr / (step * 4))})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx.stroke()
      }
      const off = (t * 0.14) % 1
      ctx.strokeStyle = 'rgba(226,232,255,0.85)'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      for (let px = 0; px <= W; px += 2) {
        const y = yMid - ecgY((px / W + off) % 1) * H
        if (px === 0) ctx.moveTo(px, y)
        else ctx.lineTo(px, y)
      }
      ctx.stroke()
      ctx.fillStyle = 'rgba(255,45,98,0.9)'
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.fillStyle = colors[2]
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < 3; i++) {
        const px = W * (0.5 + 0.32 * Math.sin(t * 0.4 + i * 2.1 + seed))
        const py = H * (0.5 + 0.3 * Math.cos(t * 0.32 + i * 1.7 + seed * 2))
        const r = Math.min(W, H) * (0.42 + 0.1 * Math.sin(t * 0.25 + i))
        const g = ctx.createRadialGradient(px, py, 0, px, py, r)
        const [cr, cg, cb] = rgb[i % 2]
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${i === 0 ? 0.4 : 0.24})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }
      ctx.globalCompositeOperation = 'source-over'
      if (variant === 'orb') renderOrb(W, H)
      else if (variant === 'chart') renderChart(W, H)
      else if (variant === 'editorial') renderEditorial(W, H)
      else renderPulse(W, H)
    }

    const loop = () => {
      t += 0.016
      draw()
      raf = requestAnimationFrame(loop)
    }

    draw()

    if (!reduced) {
      const io = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry.isIntersecting
          cancelAnimationFrame(raf)
          if (entry.isIntersecting) loop()
        },
        { threshold: 0.05 },
      )
      io.observe(canvas)
      return () => {
        io.disconnect()
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
      }
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [colors, seed, variant, reduced])

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
}
