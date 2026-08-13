import { FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { Magnetic } from './Magnetic'

const API_BASE = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '')

function SuccessBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = (canvas.width = 320)
    const H = (canvas.height = 200)
    const colors = ['#3D5CFF', '#FF2D62', '#F6F7FC']
    const parts = Array.from({ length: 90 }, () => {
      const a = Math.random() * Math.PI * 2
      const v = 1.5 + Math.random() * 4.5
      return {
        x: W / 2,
        y: H / 2,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 1.5,
        r: 1 + Math.random() * 2.4,
        c: colors[Math.floor(Math.random() * colors.length)],
      }
    })
    let t = 0
    let raf = 0
    const loop = () => {
      t += 0.016
      ctx.clearRect(0, 0, W, H)
      const alpha = Math.max(0, 1 - t / 1.5)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (t < 1.5) raf = requestAnimationFrame(loop)
      else ctx.clearRect(0, 0, W, H)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} className="mx-auto" width={320} height={200} aria-hidden />
}

type Status = 'idle' | 'sending' | 'success'

export function Contact({ reduced }: { reduced: boolean }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
    } catch {
      setStatus('idle')
      toast.error('Could not send your message — email us directly at hello@kurieta.com')
    }
  }

  const fieldClass =
    'w-full border-b border-white/15 bg-transparent py-3 text-base text-paper outline-none transition-[border-color,box-shadow] duration-500 ease-weighted placeholder:text-white/25 focus:border-electric focus:[box-shadow:0_1px_0_0_#3D5CFF]'

  return (
    <section id="contact" data-testid="contact-section" className="px-6 py-28 md:px-12 md:py-44">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="mono-label mb-6" data-testid="contact-label">
            06 — Contact
          </p>
          <h2 className="font-serif text-2xl leading-[1.15] tracking-tight text-paper sm:text-3xl lg:text-5xl">
            Let&rsquo;s build something <em className="italic text-electric">undeniable.</em>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
            Tell us where you&rsquo;re headed. We&rsquo;ll tell you honestly whether we&rsquo;re the right team to get
            you there — and exactly how.
          </p>
          <a
            href="mailto:hello@kurieta.com"
            data-testid="contact-email-link"
            className="nav-link mt-10 inline-block font-mono text-sm tracking-[0.15em] text-paper"
          >
            hello@kurieta.com
          </a>
          <p className="mono-label mt-6">Replies within 24 hours</p>
        </div>

        <div className="relative min-h-[26rem]">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                data-testid="contact-success-message"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
                className="flex h-full flex-col items-center justify-center rounded-2xl border border-electric/30 bg-depth-2 p-12 text-center"
              >
                {!reduced && <SuccessBurst />}
                {reduced && <Check className="mb-6 h-10 w-10 text-electric" aria-hidden />}
                <h3 className="font-serif text-3xl tracking-tight text-paper">Message received.</h3>
                <p className="mono-label mt-4">We reply within 24 hours</p>
                <button
                  data-testid="contact-send-another-button"
                  onClick={() => {
                    setForm({ name: '', email: '', message: '' })
                    setStatus('idle')
                  }}
                  className="mt-10 rounded-full border border-white/15 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 transition-colors duration-500 hover:border-electric hover:text-paper"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                data-testid="contact-form"
                onSubmit={submit}
                initial={false}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
                className="space-y-10"
                noValidate={false}
              >
                <label className="block">
                  <span className="mono-label mb-1 block">Name</span>
                  <input
                    data-testid="contact-input-name"
                    required
                    minLength={1}
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ada Lovelace"
                    className={fieldClass}
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mono-label mb-1 block">Email Address</span>
                  <input
                    data-testid="contact-input-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ada@company.com"
                    className={fieldClass}
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="mono-label mb-1 block">Project Overview</span>
                  <textarea
                    data-testid="contact-textarea-message"
                    required
                    minLength={1}
                    maxLength={5000}
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What are we building, and by when?"
                    className={`${fieldClass} resize-none`}
                  />
                </label>
                <Magnetic strength={0.25} className="inline-block">
                  <button
                    data-testid="contact-submit-button"
                    type="submit"
                    disabled={status === 'sending'}
                    className="rounded-full bg-electric px-10 py-4 font-mono text-xs uppercase tracking-[0.22em] text-paper transition-colors duration-500 ease-weighted hover:bg-paper hover:text-midnight disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </Magnetic>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
