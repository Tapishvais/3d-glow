# 3D Glow — Personal 3D Homepage

A single-page, 3D-animated homepage I built as a **personal project** — React, Three.js, and scroll motion.

**Live:** [https://3d-glow.vercel.app](https://3d-glow.vercel.app)  
**Source:** [github.com/Tapishvais/3d-glow](https://github.com/Tapishvais/3d-glow)

## What the page does

- Opens with a **fast branded pre-loader** (under 2 seconds) that melts into the hero without a cut
- The hero has a **real 3D blob** built with a custom shader — it follows your cursor and reacts to how fast you scroll
- Every section **animates as you scroll**: about → process → skills → sample work → stats → contact → footer
- The **contact form can send email** (Resend on Vercel; needs `RESEND_API_KEY` in project env)
- Works on **desktop, tablet, and mobile**, and respects reduced-motion settings

## Tech stack (and why)

| Tool | Why I chose it |
|---|---|
| React + TypeScript + Vite | One page doesn't need Next.js — Vite is faster to build and lighter to ship |
| Three.js + custom GLSL shader | The hero blob — real 3D that responds to the user |
| GSAP + ScrollTrigger | Scroll-driven section choreography |
| Framer Motion | Small UI touches — magnetic buttons, custom cursor |
| Lenis | Smooth, weighted scrolling |
| Tailwind CSS | Fast, consistent styling with a dark brand palette |
| Resend | Sends contact form emails through one tiny serverless function |

## Trade-offs I made

- **All visuals are drawn in code** (canvas), no photos — the page downloads zero images and stays fast (sample work is labeled as samples)
- **Only one section uses horizontal scroll-locking** (work) — locking the whole page would feel laggy
- **No extra pages, no dark/light toggle** — a smaller set of ideas, finished well

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

Root Directory is `frontend`. Live URL: [3d-glow.vercel.app](https://3d-glow.vercel.app).

To make the contact form send mail, add `RESEND_API_KEY`, `CONTACT_EMAIL`, and `EMAIL_FROM`. `frontend/api/contact.js` handles the rest.

(`backend/` only exists for a local/dev contact preview — it is not part of the production deploy.)

## What I'd improve with more time

- Drive the pre-loader from real loading progress instead of a timer
- Full detail pages for each sample project
- Lighthouse CI on every commit so performance never regresses
