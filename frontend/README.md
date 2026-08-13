# Kurieta — 3D Marketing Homepage

A cinematic, single-scroll homepage for **kurieta.com**. One continuous ribbon: branded pre-loader → WebGL shader hero → manifesto → stacked services → horizontal case gallery → contact → creative footer.

## Stack rationale

| Choice | Why |
| --- | --- |
| React 19 + TypeScript + Vite | Instant HMR, minimal config, tiny build overhead — hours go to 3D craft, not tooling. No SSR need for a one-page marketing site. |
| three.js via @react-three/fiber | Custom GLSL simplex-noise + fresnel iridescence shader on a single low-poly icosahedron. No shadows, `powerPreference: 'high-performance'`, DPR capped at 1.5. |
| GSAP + ScrollTrigger | Scroll choreography: kinetic type reveals, pinned horizontal case gallery, preloader timeline. |
| Lenis | Weighted momentum scroll, synced to GSAP's ticker. Scroll velocity feeds the hero shader (`uVel`). |
| Framer Motion | UI micro-interactions: magnetic cursor/buttons, clip-path preloader exit, footer wordmark stagger. |
| Tailwind + CSS variables | Palette as tokens (`--midnight`, `--electric`, `--crimson`), weighted ease `cubic-bezier(0.7, 0, 0.3, 1)` everywhere. |

## Structure

```
src/
  components/
    Preloader.tsx      SVG stroke-draw wordmark + 000→100 counter, clip-path handoff (≤1.8s)
    Hero.tsx           masked line-by-line headline reveal + lazy 3D scene
    three/BlobScene.tsx  custom GLSL shader blob (React.lazy + Suspense → separate chunk)
    Marquee.tsx        one slow editorial marquee
    Manifesto.tsx      kinetic word reveal + 4 numbered chapters + CSS-3D "K" flourish
    Services.tsx       sticky stacked cards, hover-expand, cursor parallax canvas vignettes
    Vignette.tsx       5 hand-written 2D canvas loops (grid / wave / wireframe mesh / nodes / polyhedron)
    CaseStudies.tsx    GSAP-pinned horizontal gallery (desktop), vertical stack (mobile)
    ProjectArt.tsx     generative canvas artwork per project (zero image weight)
    Contact.tsx        form + magnetic submit + particle-burst success
    Footer.tsx         giant kinetic wordmark, elastic back-to-top
    Cursor.tsx         custom dot + ring cursor (pointer:fine only)
api/
  contact.ts           Vercel Edge Function → Resend (production)
```

## Contact form wiring

- **Preview/dev**: the form POSTs a relative `/api/contact`, served here by a small FastAPI route (Emergent-managed Resend proxy, server-side template, rate-limited).
- **Vercel**: `api/contact.ts` is picked up automatically as an Edge Function at the same `/api/contact` path. Set env vars: `RESEND_API_KEY`, `CONTACT_EMAIL`, `EMAIL_FROM`. No code change needed.

## Performance

- 3D scene is `React.lazy`-loaded — the three.js chunk never blocks first paint; a CSS poster renders in its place.
- Single mesh, no shadows, `antialias: false`, DPR ≤ 1.5, render loop pauses off-screen (`frameloop="never"`).
- All imagery is generative canvas — zero image downloads below the fold.
- `vite-plugin-compression` ships `.gz` assets; three/gsap split into manual chunks.

## Accessibility

- `prefers-reduced-motion`: no Lenis, no scroll-jacking (native scroll), static poster instead of the shader, static vignette frames, reveals render instantly.
- Custom cursor disabled on touch / coarse pointers.
- All interactive elements keyboard-focusable with visible focus states; semantic sections, labels on every field.

## With another week

- Preloader driven by real asset-loading progress instead of a timed counter
- Per-project case-study overlays with deeper process write-ups
- WebGL distortion transition between hero and manifesto (shared framebuffer)
- Lighthouse CI GitHub Action with budget assertions on every PR
