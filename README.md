<div align="center">

# AMBRE PARFUMS

*A luxury perfume storefront: four fragrances, four moods, one cinematic digital experience.*

<a href="https://perfumes-website-three.vercel.app">
  <img src="https://img.shields.io/badge/Live_site-perfumes--website--three.vercel.app-1E1416?style=for-the-badge&logo=vercel&logoColor=white" alt="Live site" />
</a>

<br /><br />

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black" alt="GSAP" />
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />

</div>

<br />

## Overview

AMBRE PARFUMS is the digital home of a small perfume house built around four fragrances — **AMBRE**, **WARD**, **OUD NUIT** and **JASMIN** — each with its own colour palette, mood and story. The site presents the brand and its collection through a cinematic, scroll-driven experience: visitors discover each perfume's notes and personality, personalise a bottle, and order it, all inside an interface designed to feel as considered as the product itself.

The experience is built for visual storytelling first: a pinned hero sequence that opens like a perfume bottle, a theme that shifts with every fragrance, and an interactive spray you can hear as well as see.

<br />

## Brand Identity

<div align="center">
  <img src="public/assets/Identity%20Board.png" alt="AMBRE PARFUMS Brand Identity Board" width="100%" />
</div>

<br />

## Brand Colors

Each perfume carries its own background tone across the entire site — the page, the cart drawer and the checkout all shift into it the moment you open that perfume.

| Perfume | Background | Accent | Ink / Text | Liquid |
|:---|:---|:---|:---|:---|
| **AMBRE** | `#F3E7DB` | `#D9902F` | `#2E2521` | `#F0C060` |
| **WARD** | `#F1DDD6` | `#C9787C` | `#3A2226` | `#E8A5A8` |
| **OUD NUIT** | `#1E1416` | `#C8963E` | `#F3E7DB` | `#7A2E2E` |
| **JASMIN** | `#E9EDDC` | `#7F9A62` | `#2A3324` | `#F4F1D0` |

Supporting neutrals used across the shared UI (footer, admin panel, paper surfaces): `#7A8560` (sage), `#FFFBF5` (paper) and `#1E1416` (night).

<br />

## Perfume Collection

| Perfume | Mood | Top · Heart · Base |
|:---|:---|:---|
| **AMBRE** | *A perfume that opens like golden hour.* | Blood orange · Rose · Amber |
| **WARD** | *Soft petals, warm skin.* | Pink pepper · Damask rose · White musk |
| **OUD NUIT** | *Smoke, velvet and midnight.* | Amber · Oud · Vanilla |
| **JASMIN** | *Fresh petals after the rain.* | Green leaves · Sambac jasmine · White musk |

Every perfume is offered as an Eau de Parfum in 30, 50 and 100 ml, poured in small batches.

<br />

## Website Experience

- **Home** — a single scroll-driven page combining the hero, a scrolling note marquee, the collection, the brand story and a gifting/ritual section.
- **Hero** — a pinned, GSAP-scrubbed cinematic sequence: the bottle opens, its notes burst outward and get labelled (top / heart / base), and the sequence closes on all four perfumes side by side before releasing the scroll.
- **Collection** — four expanding panels, one per perfume, that reveal the bottle, its notes and starting price on hover.
- **Story** — a word-by-word reveal of the brand's copy alongside a parallax photograph and three guiding pillars (small batches, layered by hand, worn like an hour).
- **Ritual** — a gifting and rituals section (gift wrap, engraving, the upcoming discovery set) with a perk list and a call to action back to the collection.
- **Perfume page** — a dedicated page per fragrance with an interactive spray stage, size and intensity selection, optional engraving and gift wrap, and the fragrance's own mood photography.
- **Checkout** — a validated, single-page checkout for cash on delivery, with an order summary drawer.
- **Order confirmation & tracking** — a confirmation page with the order number, and a separate page to track any order by order number and phone.
- **Admin** — a private, unlinked dashboard for managing incoming orders.

<br />

## Features

- Cinematic, pinned scroll sequence for the hero, built with GSAP and ScrollTrigger
- A full colour theme (background, text, accent, liquid) that changes per perfume via `ThemeSync`
- Interactive perfume "spray" with sound, synced to the visual mist on every click
- Circular, origin-aware page transitions using the View Transitions API
- Persistent shopping bag with a slide-in drawer, tinted to the last perfume added
- Size, intensity, engraving and gift-wrap personalisation per bottle
- Cash-on-delivery checkout with server-side validation and a honeypot against bots
- Order tracking by order number and phone number, with a visual status stepper
- Private admin dashboard: revenue and order stats, a 7-day chart, per-perfume sales ranking, a searchable/filterable order table, CSV export, and one-click call/WhatsApp actions
- Full `prefers-reduced-motion` support throughout the hero, panels and page transitions
- Graceful fallback to built-in catalogue prices if the backend is unavailable

<br />

## System Architecture

```mermaid
flowchart TD
    Router["React Router (App.tsx)"]

    Router --> Home
    Router --> PerfumePage["PerfumePage (/perfume/:id)"]
    Router --> Checkout
    Router --> OrderComplete["OrderComplete (/order/:id)"]
    Router --> TrackOrder
    Router --> NotFound
    Router --> AdminLogin["AdminLogin (/admin/login)"]
    Router --> AdminGuard --> AdminOrders["AdminOrders (/admin/orders)"]

    Home --> Hero
    Home --> Marquee
    Home --> Collection
    Home --> Story
    Home --> Ritual

    AdminOrders --> OrderDrawer
    AdminOrders --> AdminShell

    subgraph Global["Global UI"]
        ThemeSync
        Header
        Footer
        CartDrawer
    end

    subgraph State["State — Zustand"]
        CartStore["store/cart.ts"]
        CatalogStore["store/catalog.ts"]
        SoundStore["store/sound.ts"]
    end

    subgraph Data["Data"]
        Catalog["data/catalog.ts"]
        Assets["data/assets.ts"]
    end

    subgraph Lib["lib/"]
        Api["api.ts"]
        SupabaseClient["supabase.ts"]
        Validate["validate.ts"]
        Sanitize["sanitize.ts"]
    end

    subgraph Backend["Supabase Backend"]
        Auth[("Auth")]
        DB[("Postgres + RLS")]
        RPC1(["create_order"])
        RPC2(["track_order"])
        RPC3(["admin_login_guard"])
    end

    ThemeSync --> Catalog
    Collection --> Catalog
    PerfumePage --> Catalog
    PerfumePage --> CatalogStore
    Hero --> Assets
    CartDrawer --> CartStore
    Header --> SoundStore
    Checkout --> CartStore
    Checkout --> Api
    Checkout --> Validate
    Checkout --> Sanitize
    TrackOrder --> Api
    AdminLogin --> Api
    AdminOrders --> Api

    Api --> SupabaseClient
    SupabaseClient --> Auth
    Api --> RPC1 --> DB
    Api --> RPC2 --> DB
    AdminLogin --> RPC3 --> DB
    AdminGuard --> Auth
    AdminOrders --> DB
```

Business logic (pricing, validation, rate limiting) lives entirely in Supabase, called through `create_order`, `track_order` and `admin_login_guard`. The browser never writes an order row or a price directly — it only calls these functions, so a tampered client cannot alter a total.

<br />

## Project Structure

```text
.
├── index.html
├── setup.mjs                 Scaffolding script; also generates src/data/assets.ts
├── vercel.json                SPA rewrites for Vercel
├── src/
│   ├── main.tsx, App.tsx, index.css
│   ├── components/
│   │   ├── Header.tsx, Footer.tsx, CartDrawer.tsx, ThemeSync.tsx, icons.tsx
│   │   ├── hero/               Hero.tsx, swarm.ts, hero.css
│   │   └── home/                Collection.tsx, Story.tsx, Ritual.tsx, Marquee.tsx
│   ├── pages/
│   │   ├── Home.tsx, PerfumePage.tsx, Checkout.tsx
│   │   ├── OrderComplete.tsx, TrackOrder.tsx, NotFound.tsx
│   │   └── admin/                AdminLogin.tsx, AdminGuard.tsx, AdminShell.tsx,
│   │                              AdminOrders.tsx, OrderDrawer.tsx, adminIcons.tsx, adminUtils.ts
│   ├── data/                     catalog.ts (perfumes, themes, notes), assets.ts (generated)
│   ├── store/                    cart.ts, catalog.ts, sound.ts (Zustand)
│   ├── hooks/                    smoothScroll.ts, useRevealNavigate.ts, useSpraySound.ts
│   └── lib/                      api.ts, supabase.ts, validate.ts, format.ts, sanitize.ts
├── public/
│   └── assets/                   Perfume, brand and scene imagery
└── supabase/
    ├── phase2.sql                 Order numbers, status, admins, RLS, rate limiting, RPCs
    └── fix_orders.sql             Order-flow repair migration
```

<br />

## Technology Stack

| Layer | Tools |
|:---|:---|
| Frontend | React, TypeScript, Vite, React Router |
| Motion | GSAP + ScrollTrigger, Framer Motion, Lenis (smooth scroll), View Transitions API |
| State | Zustand (with `persist` for cart and sound settings) |
| Backend | Supabase — Postgres, Auth, Row Level Security, RPC functions |
| Fonts | Fraunces (serif) and DM Sans, via Google Fonts |
| Hosting | Vercel |

<br />

## UI / UX

- **Typography** — Fraunces for display and editorial text, DM Sans for interface text; both loaded as variable fonts.
- **Colour system** — every colour is a CSS custom property (`--bg`, `--text`, `--accent`, `--liquid`, `--on-accent`) written by `ThemeSync` on every route change, so the whole page — including the cart drawer and buttons — shifts with the active perfume without per-component logic.
- **Layout** — CSS Grid and Flexbox throughout, with a shared `--gutter` and `--header-h` token so spacing stays consistent from the hero down to the footer.
- **Navigation** — a fixed header that gains a blurred, tinted background on scroll, with a dedicated mobile menu below 720px.
- **Buttons** — a shared `.btn` system with solid and ghost variants and a light sweep on hover.
- **Cards** — expanding collection panels, gifting tiles and admin stat cards, each themed to its context.
- **Responsiveness** — dedicated breakpoints for the hero, panels, checkout and admin table, including a card-based fallback for the admin orders table on small screens.

<br />

## Animation & Interaction

- **GSAP + ScrollTrigger** drive the pinned hero timeline, the collection panel reveals, the story's word-by-word copy reveal, and the gifting section's tile animations.
- **Lenis** provides the site's smooth-scroll feel and is synced to ScrollTrigger's scroll updates.
- **Framer Motion** powers the cart drawer, mobile menu, order-confirmation entrance and the perfume page's spray stage.
- **View Transitions API** drives circular, click-origin page transitions between the home page and a perfume page.
- **Web Audio API** preloads and plays the spray sound in the same tick as the visual mist, so rapid clicks layer naturally.
- All of the above respect `prefers-reduced-motion`, falling back to instant states rather than skipped or broken animations.

<br />

## Admin System

The admin area lives at `/admin/*` and is never linked from the public site.

- **AdminLogin** — email/password sign-in against Supabase Auth, guarded by a server-side rate limit (`admin_login_guard`).
- **AdminGuard** — wraps `/admin/orders`; checks the Supabase session and redirects to the login page if there isn't one.
- **AdminShell** — the dashboard's sidebar and top bar, shared across admin pages.
- **AdminOrders** — the dashboard itself: revenue and order stat cards, a 7-day revenue chart, a per-perfume sales ranking, and a searchable, filterable, sortable order table with CSV export.
- **OrderDrawer** — a detail panel per order, with a status stepper (New → Confirmed → Delivered), a cancel action, and one-click call/WhatsApp links to the customer.

Order rows and status changes are protected by Row Level Security in Supabase — only accounts listed in the `admins` table can read or update them.

<br />

## Assets

Images live under `public/assets/`, organised into subfolders (bottles, ingredients, scenes, brand marks). `setup.mjs` scans these folders for files with a two-digit numeric prefix and generates `src/data/assets.ts`, a lookup map from that number to its file path, consumed throughout the app via the `img()` helper. Brand logos (light and dark variants) and the Identity Board reference live alongside the numbered assets.

<br />

## Installation & Run

**Prerequisites:** Node.js 20.19 or newer. A Supabase project is optional — see below.

```bash
git clone https://github.com/omniaalessawy247-hash/perfumes-website.git
cd perfumes-website
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

To connect a Supabase backend, create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

The publishable key is designed to be public. Never put a `service_role` key in this project. Without a configured backend, the storefront still runs using its built-in catalogue prices; checkout, order tracking and the admin panel need Supabase connected.

To build for production:

```bash
npm run build
npm run preview
```

<br />

## Development Notes

- `setup.mjs` scaffolds and updates the project's source files in place; run it once from the project root (`node setup.mjs`) after cloning if you're working from the script rather than a full checkout.
- Database schema, RLS policies and RPC functions are defined in `supabase/phase2.sql` and `supabase/fix_orders.sql` — run them in order from the Supabase SQL editor. Both are safe to re-run.
- After running the SQL, create the admin user in **Authentication → Users**, then insert their UUID into the `admins` table as described at the top of `phase2.sql`.
