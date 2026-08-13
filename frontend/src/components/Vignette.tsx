import { useEffect, useRef } from 'react'

export type VignetteType = 'grid' | 'wave' | 'mesh' | 'nodes' | 'poly'

const ELECTRIC = '61, 92, 255'
const PAPER = '246, 247, 252'
const CRIMSON = '255, 45, 98'

const PHI = (1 + Math.sqrt(5)) / 2
const ICO_VERTS: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
]
const ICO_EDGES: [number, number][] = []
for (let i = 0; i < ICO_VERTS.length; i++) {
  for (let j = i + 1; j < ICO_VERTS.length; j++) {
    const [a, b] = [ICO_VERTS[i], ICO_VERTS[j]]
    const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
    if (Math.abs(d - 2) < 0.01) ICO_EDGES.push([i, j])
  }
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cols = 14
  ctx.lineWidth = 1
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * W
    const wobble = Math.sin(t * 1.2 + i * 0.7) * 10
    ctx.strokeStyle = `rgba(${ELECTRIC}, ${0.12 + 0.1 * Math.abs(Math.sin(t + i))})`
    ctx.beginPath()
    ctx.moveTo(x + wobble, 0)
    ctx.bezierCurveTo(x - wobble, H * 0.33, x + wobble * 1.5, H * 0.66, x - wobble * 0.5, H)
    ctx.stroke()
  }
  for (let j = 0; j <= 4; j++) {
    const y = (j / 4) * H
    ctx.strokeStyle = `rgba(${PAPER}, 0.05)`
    ctx.beginPath()
    ctx.moveTo(0, y + Math.sin(t + j) * 4)
    ctx.lineTo(W, y + Math.cos(t + j) * 4)
    ctx.stroke()
  }
}

function drawWave(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const N = 56
  for (let k = 0; k < 3; k++) {
    const amp = H * 0.16 * (1 - k * 0.22)
    const yBase = H * (0.3 + k * 0.2)
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1)) * W
      const y = yBase + Math.sin(i * 0.32 + t * 2 + k * 1.4) * amp
      const a = 0.18 + 0.5 * Math.abs(Math.sin(i * 0.32 + t * 2 + k))
      ctx.fillStyle = k === 1 ? `rgba(${CRIMSON}, ${a * 0.5})` : `rgba(${ELECTRIC}, ${a})`
      ctx.beginPath()
      ctx.arc(x, y, 1.6, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawMesh(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cx = W / 2
  const cy = H / 2
  const s = Math.min(W, H) * 0.24
  const ry = t * 0.6
  const rx = t * 0.25
  const proj = ICO_VERTS.map(([x, y, z]) => {
    const x1 = x * Math.cos(ry) + z * Math.sin(ry)
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
    const y1 = y * Math.cos(rx) - z1 * Math.sin(rx)
    const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)
    const scale = 3.6 / (z2 + 4.4)
    return { x: cx + x1 * s * scale, y: cy + y1 * s * scale, z: z2 }
  })
  ctx.lineWidth = 1
  for (const [a, b] of ICO_EDGES) {
    const depth = (proj[a].z + proj[b].z) / 2
    const alpha = 0.14 + 0.4 * (1 - (depth + PHI) / (2 * PHI))
    ctx.strokeStyle = `rgba(${ELECTRIC}, ${alpha})`
    ctx.beginPath()
    ctx.moveTo(proj[a].x, proj[a].y)
    ctx.lineTo(proj[b].x, proj[b].y)
    ctx.stroke()
  }
  for (const p of proj) {
    ctx.fillStyle = `rgba(${PAPER}, 0.5)`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawNodes(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, rand: () => number) {
  const nodes: { x: number; y: number }[] = []
  for (let i = 0; i < 14; i++) nodes.push({ x: rand() * W, y: rand() * H })
  ctx.lineWidth = 1
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
      if (d < W * 0.28) {
        ctx.strokeStyle = `rgba(${ELECTRIC}, ${0.22 * (1 - d / (W * 0.28))})`
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }
    }
  }
  nodes.forEach((n, i) => {
    const r = 2 + Math.sin(t * 2.2 + i * 1.3) * 1.4
    ctx.fillStyle = i === 0 ? `rgba(${CRIMSON}, 0.9)` : `rgba(${ELECTRIC}, 0.75)`
    ctx.beginPath()
    ctx.arc(n.x, n.y, Math.max(r, 0.8), 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawPoly(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  const cx = W / 2
  const cy = H / 2
  const rings = [
    { sides: 6, r: 0.3, speed: 0.4, color: ELECTRIC, alpha: 0.55 },
    { sides: 5, r: 0.22, speed: -0.6, color: PAPER, alpha: 0.3 },
    { sides: 4, r: 0.13, speed: 0.9, color: CRIMSON, alpha: 0.5 },
  ]
  ctx.lineWidth = 1
  for (const ring of rings) {
    const R = Math.min(W, H) * ring.r
    ctx.strokeStyle = `rgba(${ring.color}, ${ring.alpha})`
    ctx.beginPath()
    for (let i = 0; i <= ring.sides; i++) {
      const a = (i / ring.sides) * Math.PI * 2 + t * ring.speed
      const x = cx + Math.cos(a) * R
      const y = cy + Math.sin(a) * R
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

export function Vignette({ type, active, reduced }: { type: VignetteType; active: boolean; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = Math.random() * 10
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const rand = mulberry32(42)

    const resize = () => {
      const r = parent.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(r.width * dpr))
      canvas.height = Math.max(1, Math.floor(r.height * dpr))
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)
      if (type === 'grid') drawGrid(ctx, W, H, t)
      else if (type === 'wave') drawWave(ctx, W, H, t)
      else if (type === 'mesh') drawMesh(ctx, W, H, t)
      else if (type === 'nodes') drawNodes(ctx, W, H, t, rand)
      else drawPoly(ctx, W, H, t)
    }

    const loop = () => {
      t += 0.016
      draw()
      raf = requestAnimationFrame(loop)
    }

    draw()
    if (!reduced && active) loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [type, active, reduced])

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
}
