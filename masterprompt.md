# Effex Studios & Effex Academy — Full Website Redesign Prompt
> Claude Code build prompt · Version 1.0

---

## Project Overview

Build a complete, production-ready multi-page website for **Effex Studios** — a creative media agency based in **Douala, Cameroon** — and its associated training arm, **Effex Academy**. The website must represent a world-class creative agency with deep African roots, a cinematic visual identity, and a separate, fully-fleshed Academy section at `/academy`.

The existing prototype (single HTML file with black/gold palette, Cormorant Garamond + DM Sans typography) has strong design bones and must be used as the **creative foundation** — not discarded. The goal is to elevate it into a fully-architected, multi-page site that competes with the best creative agency websites globally.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS variables for brand tokens
- **Fonts:** Google Fonts — `Cormorant Garamond` (serif display) + `DM Sans` (body/UI)
- **Animations:** Framer Motion for scroll reveals, transitions, and hero animations
- **Icons:** Lucide React
- **No external UI component libraries** — build all components from scratch

---

## Brand Identity (Do Not Deviate)

```
Colors:
  --black:       #0A0A0A
  --gold:        #C8832A
  --gold-light:  #E8A84A
  --gold-pale:   #F5E6CF
  --white:       #FAFAF7
  --off-white:   #F2F0EB
  --gray-100:    #E8E6E0
  --gray-300:    #B8B5AE
  --gray-500:    #7A7870
  --gray-700:    #3A3834

Typography:
  Display / headings: Cormorant Garamond (weights: 300, 400, 600 — italic variants used heavily)
  Body / UI:          DM Sans (weights: 300, 400, 500)

Voice & Tone:
  Cinematic. Confident. African. No corporate clichés.
  Short, declarative sentences. Italic serif for emotional weight.
  Every word earns its place.
```

---

## Site Architecture

```
/                     → Agency homepage (Effex Studios)
/work                 → Portfolio & case studies
/services             → Detailed services page
/about                → Studio story, team, mission
/academy              → Academy hub (landing page)
/academy/programs     → Full course catalog
/academy/apply        → Application / enrol page
/contact              → Contact page (Studios enquiries)
```

---

## Page 1: Homepage (`/`) — Effex Studios

This is the flagship page. It must feel like the opening frame of a great film.

### 1.1 Navigation

- Fixed, full-width, dark background with `backdrop-filter: blur`
- Left: `Effex` wordmark in serif — `Eff` white, `ex` gold
- Center: nav links — `Work · Services · About · Academy`
- Right: two CTAs — `Join Academy` (outline, gold) + `Start a Project` (filled, gold)
- On scroll: nav shrinks slightly and border becomes more visible
- Mobile: hamburger menu with full-screen overlay nav (currently broken in prototype — must be fixed)

### 1.2 Hero Section — REDESIGN THIS COMPLETELY

The existing hero is text-only against a dark gradient. **Replace it with a cinematic, full-viewport hero** that actually shows the agency's creative output.

Requirements:
- **Full-bleed background:** A looping, muted video reel placeholder (use a high-quality dark cinematic still image via CSS gradient + grain texture if video is not available — but structure it for easy video swap)
- **Dark overlay** (approx. 65% opacity) so text reads perfectly
- **Top-left:** small location badge — `📍 Douala, Cameroon` in uppercase tracked type, gold
- **Centered or bottom-left layout** (bottom-left preferred — editorial, not centered/generic)
- **Headline:** Large, confident, mixed-weight serif:
  ```
  We make Africa
  look the way it
  feels.
  ```
  — `clamp(56px, 8vw, 112px)` — weight 300 — tight leading — with the last word or phrase in italic gold
- **Sub-copy:** One sharp line beneath. E.g.: *"Creative media production. Douala, Cameroon. Built for the world."*
- **Two CTAs** below: `See Our Work →` (gold filled) + `Start a Project` (outline)
- **Bottom bar** spanning full width: a horizontal strip with three metadata items separated by thin vertical rules:
  ```
  Effex Studios Ltd  |  Est. Douala, CM  |  Film · Photo · Content
  ```
- **Scroll indicator:** animated vertical line with `SCROLL` text, bottom-center
- **Animated entrance:** headline words stagger in from below on load (Framer Motion)
- The hero must feel like a film title card — not a SaaS landing page

### 1.3 Marquee Band

Gold background. Scrolling ticker of: `Brand Storytelling · Documentary Production · Film Production Africa · Creative Media · Content Creation · Visual Storytelling ·` — repeated seamlessly. Keep from existing prototype.

### 1.4 Intro Split — Studios vs Academy

Two-column section. Left: dark (Studios). Right: off-white (Academy).
Keep the existing concept but make the copy sharper and the links more prominent.
Add a subtle hover effect where the hovered side expands slightly (60/40 split on hover).

### 1.5 Services — Effex Studios

Four service cards in a grid. Keep the numbered card concept from the prototype.
Services:
1. Brand Film Production
2. Documentary Production
3. Photography & Visual Content
4. Social Media Content Production

Each card: on hover, a thin gold line animates in from the left across the top. Number fades up slightly in opacity.

### 1.6 Selected Work / Portfolio Preview

**This section does not exist in the prototype — build it.**

A horizontally-scrollable or grid-based work preview with 3–4 placeholder project cards. Each card:
- Full-bleed dark image placeholder (use CSS gradient placeholders styled cinematically)
- Project category tag (e.g., `Brand Film`, `Documentary`)
- Project name in serif
- Client / location line
- On hover: overlay darkens and a `View Project →` link appears

Include a `View All Work →` link at the bottom right.

### 1.7 Manifesto Band

Keep exactly from prototype: full-bleed gold background, large serif italic quote:
*"Every untold story deserves a camera. Every raw talent deserves a chance."*

### 1.8 Academy Teaser

A self-contained section on the homepage that introduces the Academy as a distinct brand — not a sub-item. It should feel like a feature, not a footnote.

- Dark background section
- Left: large `Effex Academy` heading with a brief positioning statement
- Right: three Academy pillars (Real Skills · Real Projects · Real Opportunities) listed compactly
- Bold CTA: `Explore the Academy →` linking to `/academy`

### 1.9 About Teaser

Brief. Two columns. Left: the Effex story in 3–4 lines. Right: three stat blocks (with placeholder dashes — keep but style them so empty state looks intentional, e.g., `—` styled large as a design element with a note `*Data coming soon`).

### 1.10 Footer — Large-Type Footer

**Replace the existing footer entirely with a large-type footer.**

Design spec:
- Dark background (`#0A0A0A`)
- Top section: a single, enormous display line — the brand tagline — set at `clamp(48px, 8vw, 120px)` in Cormorant Garamond weight 300:
  ```
  Tell your story.
  Build your future.
  ```
  This text should span nearly full width. No padding constraints. Let it breathe and dominate.
- Below the large type: a thin gold horizontal rule
- Then a compact three-column footer row:
  - Left: `Effex` wordmark + location line (`Douala, Cameroon`) + email
  - Center: two compact link columns (Studios · Academy)
  - Right: social links + copyright line
- Bottom strip: `© 2025 Effex Studios Ltd & Effex Academy` left — `"Built on African stories. Powered by African talent."` right, in serif italic

---

## Page 2: `/academy` — Effex Academy Hub

This is a full standalone section. It should feel like a premium creative education brand that shares DNA with the Studio — but has its own energy: warmer, more human, more inspiring.

### 2.1 Academy Hero

- Full-viewport hero, distinct from the Studios hero
- Background: off-white (`#F2F0EB`) or warm dark — choose the one that makes the Academy feel approachable yet serious
- Headline (large serif):
  ```
  Where African talent
  becomes craft.
  ```
- Sub-copy: *"Practical media training for the next generation of African creatives. Douala, Cameroon."*
- Two CTAs: `View Programs →` + `Apply Now`
- Small badge: `Effex Academy — Part of Effex Studios Ltd`

### 2.2 What is Effex Academy

A clear, confident two-column explainer:
- Left: 2–3 short paragraphs on what the Academy is, who runs it, and why it exists
- Right: a visual pull-quote or statement in large italic serif

### 2.3 The Three Pillars

Full-width section. Three large cards:
1. **Real Skills** — Industry tools. No theory without practice.
2. **Real Projects** — Shoot for actual clients from Day 1.
3. **Real Opportunities** — Top graduates enter the Effex Studios talent pipeline.

Each card: number, gold divider line, name, description. On hover: lift + shadow.

### 2.4 What You'll Learn — Programs Overview

Grid of course/discipline cards. Each card includes:
- Discipline name (e.g., Videography, Photography, Content Creation, Social Media Production, Brand Storytelling, Film Production)
- One-line description
- Duration placeholder (e.g., `Intensive · 8 weeks`)
- `Learn More →` link (points to `/academy/programs`)

### 2.5 Who It's For

Full-width dark band. Left: large serif question/statement. Right: three audience profiles listed with left gold border, label + description. Keep from prototype but make it visually stronger — increase the font sizes and give each item more breathing room.

### 2.6 The Studio-to-Academy Bridge

A unique section that only exists on the Academy page — it explains the relationship between Studios and Academy:

> *"Effex Academy students don't just learn about the industry — they work alongside it. Top graduates join the Effex Studios talent pipeline, contributing to real client projects across Africa."*

Style this as a bold, full-width statement with a subtle visual connector element between two logo/brand marks (Studios · Academy).

### 2.7 Apply / Enrol CTA

Full-width gold CTA section. Dark text on gold background.
- Headline: *"Your creative career starts here."*
- Sub: *"Applications are open. Cohort sizes are limited."*
- Button: `Apply Now →` linking to `/academy/apply`

### 2.8 Academy Footer

Same large-type footer as the main site. Consistent across all pages.

---

## Page 3: `/academy/apply` — Application Page

Simple, clean, focused.

- Minimal nav (just logo + `← Back to Academy`)
- Headline: *"Apply to Effex Academy"*
- Short explainer paragraph
- Application form fields:
  - Full Name
  - Email Address
  - Phone Number
  - City / Country
  - Which program are you interested in? (dropdown)
  - Tell us about yourself (textarea)
  - How did you hear about us? (dropdown)
- Submit button: `Send Application →` (gold filled)
- No `<form>` HTML element — use controlled inputs with `useState` if in React, or standard JS event handling
- Below the form: FAQ section — 4–5 common questions with accordion-style open/close

---

## Page 4: `/contact` — Studios Contact

- Headline: *"Let's make something together."*
- Two-column layout: Left is the contact form, right is contact details + location
- Form fields: Name, Email, Company/Organisation, Project type (dropdown), Budget range (dropdown), Message
- Right column: email address, Instagram, LinkedIn, location (Douala, Cameroon), and a small embedded or styled map placeholder
- Gold submit button

---

## Global Components

### Custom Cursor
Replicate from prototype: small gold dot + larger lagging ring. Scale on hover over interactive elements. Disable on touch/mobile.

### Scroll Reveal
All major sections animate in on scroll. Use Framer Motion `whileInView` with `viewport: { once: true }`. Stagger children where applicable.

### Page Transitions
Subtle fade between pages using Framer Motion `AnimatePresence`.

### Mobile Navigation
Full-screen overlay nav on mobile. Hamburger icon (three lines → X). Links stacked vertically in large serif type. Gold accent on active link. **This must work — it is broken in the prototype.**

---

## Content & Copy Notes

- Location is **Douala, Cameroon** — reference this in the hero, footer, contact page, and meta tags
- Do not use generic placeholder lorem ipsum — write real placeholder copy in the brand voice (cinematic, African, confident)
- All statistics in the About section should render as `—` (em dash) styled intentionally large — not as broken placeholder text
- Academy program durations, pricing, and cohort sizes are TBD — use `Coming Soon` or `Contact Us` rather than fake numbers
- SEO meta tags on every page: unique title, description referencing Douala, Cameroon, and the specific page's purpose

---

## Quality Bar

The finished site must feel like it belongs alongside:
- Tendril (tendril.tv)
- Sagmeister & Walsh
- BUCK (buck.tv)

Not in complexity of animation — but in **editorial confidence, typographic precision, and the sense that every pixel was placed with intention.**

If a section feels generic, push it further. If a font size feels safe, go bigger. If a color moment feels quiet, let it be quieter — or make it dramatically louder. There is no in-between on a site like this.

---

## Deliverables Checklist

- [ ] `/` — Homepage (all sections above)
- [ ] `/academy` — Full Academy hub page
- [ ] `/academy/apply` — Application form page
- [ ] `/contact` — Studios contact page
- [ ] Global nav component (desktop + mobile working)
- [ ] Large-type footer component (shared across all pages)
- [ ] Custom cursor component
- [ ] Framer Motion scroll reveal wrapper component
- [ ] Responsive across: 375px (mobile), 768px (tablet), 1280px+ (desktop)
- [ ] All pages have correct `<head>` meta tags
- [ ] No broken links — all internal links resolve correctly

---

*Prompt authored for Claude Code · Effex Studios & Effex Academy · Douala, Cameroon*