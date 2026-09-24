<div align="center">

# AMBRE

*Four perfumes, each with its own colour, mood and story.*

A full-stack perfume storefront with a scroll-driven cinematic front end<br />and a secure, server-side order pipeline.

<a href="https://perfumes-website-three.vercel.app">
  <img src="https://img.shields.io/badge/Live_demo-perfumes--website--three.vercel.app-1E1416?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo" />
</a>

<br />
<br />

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black" alt="GSAP" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />

<p>
  <a href="#overview">Overview</a> ·
  <a href="#demo">Demo</a> ·
  <a href="#screenshots">Screenshots</a> ·
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

</div>

<br />

## Overview

AMBRE is a perfume storefront built as a complete product: a cinematic front end, and a small backend that handles orders securely. Four perfumes (AMBRE, WARD, OUD NUIT and JASMIN) each carry their own colour theme across the whole site. Visitors personalise a perfume and order it with cash on delivery, customers track their order, and the owner manages orders from a private admin panel.

**Highlights**

- **Front-end craft.** A pinned, scroll-scrubbed hero, a theme that changes with every perfume, an interactive spray with synced sound, and circular page transitions.
- **Server-side trust.** Orders are validated and priced on the server. The browser cannot set a price.
- **The full loop.** Browse, personalise, order, track and administer, end to end.

<br />

## Demo

**Live site:** [perfumes-website-three.vercel.app](https://perfumes-website-three.vercel.app)


<div align="center">
  <video src="https://github.com/user-attachments/assets/c31eba6f-9962-43fe-9fb8-ec71fe18d07f" width="100%" controls muted playsinline></video>
  <br />
  <sub>Video not loading? <a href="https://github.com/user-attachments/assets/c31eba6f-9962-43fe-9fb8-ec71fe18d07f">Open it directly</a>.</sub>
</div>

<br />

## Screenshots

<table>
<tr>
<td width="20%"><img src="docs/screenshots/perfume-ambr.png" width="100%" alt="AMBRE perfume page" /></td>
<td width="20%"><img src="docs/screenshots/perfume-ward.png" width="100%" alt="WARD perfume page" /></td>
<td width="20%"><img src="docs/screenshots/perfume-oud-nuit.png" width="100%" alt="OUD NUIT perfume page" /></td>
<td width="20%"><img src="docs/screenshots/perfume-jasmin.png" width="100%" alt="JASMIN perfume page" /></td>
<td width="20%"><img src="docs/screenshots/checkout.png" width="100%" alt="Checkout" /></td>
</tr>
<tr>
<td align="center"><sub><b>AMBRE</b></sub></td>
<td align="center"><sub><b>WARD</b></sub></td>
<td align="center"><sub><b>OUD NUIT</b></sub></td>
<td align="center"><sub><b>JASMIN</b></sub></td>
<td align="center"><sub><b>Checkout</b></sub></td>
</tr>
</table>

<br />

## Features

<table>
<tr>
<td valign="top" width="33%">

**Storefront**

- Cinematic hero: the bottle opens, notes burst out, four perfumes arrive
- A theme per perfume
- Interactive spray with synced sound
- Circular page transitions
- Reduced motion supported

</td>
<td valign="top" width="33%">

**Ordering**

- Size, intensity, engraving and gift wrap
- Slide-in bag
- Validated checkout, cash on delivery
- Order tracking by order number and phone number

</td>
<td valign="top" width="33%">

**Admin**

- Private sign-in
- Order list with full details
- Status changes: New, Confirmed, Delivered, Cancelled

</td>
</tr>
</table>

<br />

## Architecture

<div align="center">
  <img src="docs/architecture.png" alt="AMBRE architecture: a React storefront on Vercel calls Supabase server functions, which read and write Postgres with Row Level Security" width="100%" />
</div>

<br />

### Frontend

- **Stack.** React and TypeScript on Vite, with React Router for routes.
- **Theming.** Each perfume defines five colour values: background, text, accent, liquid and name colour. A small component, `ThemeSync`, writes the active palette to CSS variables on every route change, so no other component needs to know which perfume is showing. Type is set in Fraunces and DM Sans.
- **Motion.** GSAP and ScrollTrigger drive the pinned hero, Lenis handles smooth scrolling, and the View Transitions API provides circular page transitions. Heavy animation is skipped for visitors who prefer reduced motion.
- **State.** Zustand holds the cart, the catalogue and the sound setting.
- **Sound.** The Web Audio API plays the spray sound on the same beat as the mist, and rapid taps layer.

### Backend

The backend is Supabase (Postgres and Auth) with no custom server. Business logic lives in server-side functions that the browser calls.

- **`create_order`.** Validates the input, blocks bots, reads every price from the database, applies a rate limit and saves the order. The browser never inserts an order directly, so a tampered client cannot change a total.
- **`track_order`.** Needs the order number and the phone number together. A wrong number and a wrong phone return the same empty answer, so neither can be probed on its own.
- **Access control.** Row Level Security is enabled on the order tables, and only accounts listed as admins can read or change orders. Order creation, tracking and admin sign-in are rate limited.
- **Fallback.** Without a backend the storefront still runs on built-in catalogue prices.

<br />

## Tech stack

| Layer | Tools |
|:---|:---|
| Frontend | React, TypeScript, Vite, React Router, plain CSS with design tokens |
| Motion and sound | GSAP, ScrollTrigger, Lenis, Framer Motion, View Transitions API, Web Audio API |
| State | Zustand |
| Backend | Supabase (Postgres, Auth, Row Level Security, RPC functions) |
| Hosting | Vercel |

<br />

## Getting started

**Prerequisites:** Node.js 20.19 or newer. A Supabase project is optional, see the note below.

```bash
git clone https://github.com/omniaalessawy247-hash/perfumes-website.git
cd perfumes-website
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

The publishable key is designed to be public. Never put a `service_role` key in this project.

> The database schema and security policies are kept outside this repository. Without a backend the storefront still runs, using built-in catalogue prices. Checkout, order tracking and the admin panel need a configured Supabase project.

To create a production build:

```bash
npm run build
npm run preview
```

<br />

## Deployment

The site is deployed on Vercel from the `main` branch, and every push redeploys it.

1. Import the repository in Vercel. The Vite preset is detected automatically (build command `npm run build`, output directory `dist`).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under **Environment Variables**. Vite bakes them into the bundle at build time, so redeploy after changing them.
3. Keep `vercel.json` in the project root. It rewrites every path to `index.html`, so routes such as `/admin` load directly and survive a refresh.
4. In Supabase, add the Vercel URL under **Authentication > URL Configuration** (Site URL and Redirect URLs) so admin sign-in works in production.

<br />

## Project structure

```
.
├── src/
│   ├── assets/        Static assets
│   ├── components/
│   │   ├── hero/      Scroll-driven cinematic hero
│   │   └── home/      Collection, story and gifting sections
│   ├── pages/
│   │   ├── admin/     Private admin panel
│   │   └── ...        Perfume, checkout, order and tracking pages
│   ├── data/          Perfume catalogue and themes
│   ├── store/         Cart, catalogue and sound state
│   ├── hooks/         Smooth scroll, spray sound, page reveal
│   └── lib/           API, validation and helpers
├── public/            Files served as-is
├── docs/              Screenshots and architecture diagram
└── vercel.json        SPA rewrites for Vercel
```

<br />

## Roadmap

- [ ] Arabic language and right-to-left layout
- [ ] Online payment
- [ ] Lighter hero for low-end phones
- [ ] Manage prices and stock from the admin panel
- [ ] End-to-end tests
