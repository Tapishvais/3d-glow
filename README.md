# Kurieta — 3D-Animated Homepage

A cinematic, single-scroll homepage for **kurieta.com**, built from a blank canvas for the Kurieta Full-Stack Developer assignment. One continuous ribbon: branded pre-loader → WebGL shader hero → kinetic manifesto → stacked services → horizontal case gallery → contact → creative footer.

**Live stack:** React 19 · TypeScript · Vite · three.js (@react-three/fiber, custom GLSL) · GSAP + ScrollTrigger · Framer Motion · Lenis · Tailwind CSS

## Repository layout

```
frontend/        ← the site (Vercel project root — deploy this directory)
  api/contact.ts ← Vercel Edge Function: contact form → Resend (production)
  src/           ← components, shaders, canvas art, scroll choreography
backend/         ← preview-environment only: mirrors /api/contact so the form
                   is testable outside Vercel. Not part of the production deploy.
```

See **`frontend/README.md`** for the full write-up: stack rationale, performance budget results, 3D approach, accessibility notes, and what I'd improve with more time.

## Quick start

```bash
cd frontend
yarn install        # .yarnrc pins --ignore-engines (a drei dep declares node>=22)
yarn start          # dev server on :3000
yarn build          # production build → dist/ (gzipped via vite-plugin-compression)
```

## Deploy (Vercel)

1. Import this repo in Vercel, set **Root Directory** to `frontend`
2. Env vars: `RESEND_API_KEY`, `CONTACT_EMAIL`, `EMAIL_FROM`
3. `api/contact.ts` is picked up automatically at `/api/contact` — the frontend already posts there

## Performance snapshot (production build)

- Initial JS: **165 KB gzipped** (budget: 180 KB) — three.js loads as a lazy chunk after first paint
- LCP **1.19 s** · CLS **0.0004** · TTFB **167 ms** (measured on the preview deployment)
- Zero image downloads — all case-study and service visuals are generative canvas art
