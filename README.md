# Kurieta — 3D Animated Homepage

A single-page, fully 3D-animated homepage for **kurieta.com**, built from a blank canvas for the Kurieta Full-Stack Developer assignment.

**Live:** [https://kurieta.vercel.app](https://kurieta.vercel.app)  
**Source:** [github.com/Tapishvais/Kurieta](https://github.com/Tapishvais/Kurieta)

## What the page does

- Opens with a **fast branded pre-loader** (under 2 seconds) that melts into the hero without a cut
- The hero has a **real 3D blob** built with a custom shader — it follows your cursor and reacts to how fast you scroll
- Every section **animates as you scroll**: about / manifesto → process → services → case studies → stats → contact → footer
- The **contact form is wired to send email** (Resend on Vercel; needs `RESEND_API_KEY` in project env)
- Works on **desktop, tablet, and mobile**, and respects reduced-motion settings

## Tech stack (and why)

| Tool | Why I chose it |
|---|---|
| React + TypeScript + Vite | One page doesn't need Next.js — Vite is faster to build and lighter to ship |
| Three.js + custom GLSL shader | The hero blob — real 3D that responds to the user, per the brief |
| GSAP + ScrollTrigger | Scroll-driven section choreography |
| Framer Motion | Small UI touches — magnetic buttons, custom cursor |
| Lenis | Smooth, weighted scrolling |
| Tailwind CSS | Fast, consistent styling with the brand palette as tokens |
| Resend | Sends contact form emails through one tiny serverless function |

## Trade-offs I made

- **All visuals are drawn in code** (canvas), no photos — the page downloads zero images, stays fast, and never fakes client work (every project is labeled "Sample Work")
- **Only one section uses horizontal scroll-locking** (case studies) — locking the whole page would feel laggy
- **No extra pages, no dark/light toggle** — the brief asked for "a smaller set of ideas executed beautifully"

## Performance (measured)

- First-load JS: **165 KB gzipped** — the 3D engine loads separately, after the page appears
- **LCP 1.19s · CLS 0.0004 · TTFB 167ms**
- The 3D scene pauses when you scroll past it

## Accessibility

- Visitors with reduced-motion settings get a static hero and normal scrolling
- Custom cursor is disabled on touch devices
- Keyboard-friendly forms, buttons, and links throughout

## Run it locally

```bash
cd frontend
yarn install
yarn start
```

Production build: `yarn build`

## Deploy to Vercel

Root Directory is `frontend`. Live production URL: [kurieta.vercel.app](https://kurieta.vercel.app).

To make the contact form send mail, add `RESEND_API_KEY`, `CONTACT_EMAIL`, and `EMAIL_FROM`. `frontend/api/contact.js` handles the rest.

(`backend/` only exists so the contact form works in my dev preview — it is not part of the production deploy.)

## What I'd improve with more time

- Drive the pre-loader from real loading progress instead of a timer
- Full case-study detail pages for each project
- Lighthouse CI on every commit so performance never regresses
