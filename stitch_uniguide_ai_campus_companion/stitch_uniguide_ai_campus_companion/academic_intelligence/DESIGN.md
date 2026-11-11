---
name: Academic Intelligence
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#45464d'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#76767e'
  outline-variant: '#c6c6ce'
  surface-tint: '#545d7c'
  primary: '#06102b'
  on-primary: '#ffffff'
  primary-container: '#1c2541'
  on-primary-container: '#838cae'
  inverse-primary: '#bdc5e9'
  secondary: '#4a607c'
  on-secondary: '#ffffff'
  secondary-container: '#c8dfff'
  on-secondary-container: '#4c627e'
  tertiary: '#001512'
  on-tertiary: '#ffffff'
  tertiary-container: '#002c28'
  on-tertiary-container: '#239e91'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#bdc5e9'
  on-primary-fixed: '#111a36'
  on-primary-fixed-variant: '#3d4664'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#b2c8e8'
  on-secondary-fixed: '#021d35'
  on-secondary-fixed-variant: '#324863'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the archetype of an astute, scholarly concierge: deeply grounded in collegiate heritage yet powered by contemporary ambient intelligence. It serves undergraduate and graduate students, faculty, and campus visitors navigating complex university ecosystems—from financial aid appeals to locating seminar halls.

The aesthetic fuses **Modern Collegiate Elegance** with **Refined Glassmorphism**:
- **Tone:** Authoritative yet approachable, calm under pressure, rigorously structured, and perceptive.
- **Visual Style:** Warm cream foundations balance collegiate navy infrastructure, layered with translucent frosted panes and fine architectural lines inspired by campus blueprint layouts.
- **Emotional Signature:** Reassurance, clarity, and frictionless academic momentum. The interface removes bureaucratic anxiety through serene contrast, legible hierarchy, and focused AI guidance.

## Colors

The palette balances historical collegiate prestige with responsive computational clarity.

- **Primary (`#1C2541` / Deep Collegiate Navy):** Anchors headers, primary interactive states, strong textual hierarchy, and key wayfinding chrome. Deep Navy midnight tone (`#0B132B`) serves as high-emphasis background for conversational focus layers.
- **Secondary (`#3A506B` / Muted Indigo):** Expresses structural dividers, inactive states, secondary actions, and contextual metadata tags.
- **Tertiary (`#0D9488` with `#14B8A6` & `#2DD4BF` / Smart Emerald-Teal):** Reserved specifically for active AI states, live query processing, high-confidence guidance prompts, and affirmative campus status indicators.
- **Academic Gold Highlight (`#D97706`):** Dedicated exclusively to urgent deadlines, academic honors, official registry alerts, and priority badges.
- **Canvas & Neutral Foundation (`#FAF9F6` Warm Ivory, `#F8FAFC` Clean Slate):** Replaces harsh sterile whites with gentle, scholarly paper-like warmth to reduce reading fatigue.
- **Soft Lavender Tints (`#EEF2FF`, `#E0E7FF`):** Tint subtle card fills, conversational AI message bubbles, and hover states, infusing a gentle human touch across data-heavy dashboards.

## Typography

The typographic hierarchy bridges traditional scholarship with digital-native clarity:

- **Editorial Headings (Playfair Display):** Conveys the intellectual gravitas of an established university press. Deployed for page titles, hero welcome banners, AI conversation headers, and major milestone cards. It grounds the product in academic tradition.
- **Interface & Operational Text (Plus Jakarta Sans):** Delivers clean geometry, crisp apertures, and optimal micro-legibility at smaller sizes. Applied across all body paragraphs, query logs, system responses, forms, metrics, and navigation anchors.
- **Scale Rules:** Headings larger than 32px collapse fluidly onto the designated `-mobile` scales below the 768px threshold to prevent awkward line breaks on handheld devices.
- **Pairing Principle:** Never allow `Playfair Display` below `headline-md` (24px) to preserve letterform delicacy; transition all sub-headings and utility text strictly to `Plus Jakarta Sans`.

## Layout & Spacing

The layout is built upon an adaptive 12-column fluid grid governed by architectural proportion:

- **Desktop (>= 1024px):** 12-column grid with `margin-lg` (3rem) and `gutter-lg` (2rem). Supports a persistent split-pane model: primary navigation and AI concierge live along a structured 4-column dock, while university directory tools and contextual content occupy the remaining 8 columns.
- **Tablet (768px - 1023px):** 8-column grid with `margin` (1.5rem) and `gutter` (1.5rem). The helpdesk companion shifts to a collapsible slide-over drawer or bottom sheet.
- **Mobile (< 768px):** 4-column grid with `margin-sm` (1rem) and `gutter-sm` (1rem). Single-column stack prioritizing the active search query input, immediate action cards, and expandable answer blocks.
- **Architectural Rhythm:** Spacing leverages the 8pt baseline rhythm. Component cards require generous internal breathing room (`space-lg`) to prevent cognitive overload during stressful academic periods (e.g., add/drop week, exam finals).

## Elevation & Depth

Visual hierarchy combines warm translucent planes with crisp, low-contrast campus blueprint lines:

- **Surface Layers:** 
  - *Base Surface:* Warm Ivory (`#FAF9F6`) or Slate Canvas (`#F8FAFC`).
  - *Translucent Container:* `#FFFFFF` at 85% to 92% opacity paired with `backdrop-filter: blur(12px)`.
  - *Floating Layer (AI Drawer/Modals):* Deep Midnight Blue (`#0B132B`) at 95% opacity with `backdrop-filter: blur(16px)` when in spotlight AI mode.
- **Shadow Palette:**
  - *Resting Cards:* `0 4px 20px -2px rgba(28, 37, 65, 0.04), 0 2px 6px -1px rgba(28, 37, 65, 0.02)`.
  - *Raised / Active Hover:* `0 12px 32px -4px rgba(28, 37, 65, 0.08), 0 4px 12px -2px rgba(28, 37, 65, 0.04)`.
  - *Floating AI Panels:* `0 24px 48px -12px rgba(11, 19, 43, 0.16)`.
- **Refined Ghost Outlines:** Instead of heavy drop shadows alone, every elevated surface utilizes a subtle 1px border colored `rgba(58, 80, 107, 0.12)` or `rgba(224, 231, 255, 0.6)`. On dark surfaces, outlines shift to `rgba(255, 255, 255, 0.1)`.
- **Architectural Motif:** Subtle decorative background grids use 0.5px hairline strokes in `#3A506B` at 6% opacity, evoking structural blueprints of university libraries and quadrangles.

## Shapes

The design system adopts a **Rounded (`2`)** geometric philosophy, creating approachable elegance without childlike softness:

- **Standard Containers & Cards (`rounded-lg` / 1rem):** Balanced radii create tactile modules for campus service cards, department widgets, and AI response summaries.
- **Interactive Triggers (`rounded` / 0.5rem):** Form inputs, dropdown selectors, and auxiliary buttons feature structured 8px curves, signaling precise utility.
- **Pill Highlights (`rounded-full`):** Reserved exclusively for status indicators, active context filters, step pills, and conversational query starter chips.
- **Campus Architectural Accents:** Modal dialogs and major card highlights pair these radii with clean geometric 45-degree angled corner motifs in background watermarks to reference physical campus stonework and archways.

## Components

### Buttons
- **Primary:** Filled `#1C2541` (Deep Navy) background, pure white text, 0.5rem radius, height 44px (touch friendly). On hover: shifts smoothly to `#0B132B` with a subtle elevation lift.
- **AI Smart Trigger:** Gradient accent fill from `#0D9488` to `#14B8A6`, high-contrast white text, subtle glow shadow `rgba(13, 148, 136, 0.25)`.
- **Secondary:** Frosted ivory background with a 1px border of `#3A506B` (at 20% opacity) and `#1C2541` text. Hover shifts background to `#EEF2FF`.
- **Tertiary / Ghost:** No border or solid fill; `#3A506B` text with an underline slide animation on hover.

### Chips & Badges
- **Contextual Filter Chips:** Height 32px, `rounded-full`, 1px border in `rgba(58, 80, 107, 0.15)`. Selected state utilizes `#EEF2FF` fill with `#1C2541` text and an emerald tertiary dot (`#0D9488`).
- **Urgent Academic Badges:** Height 24px, pill-shaped, `#FEF3C7` (amber warm fill) with `#D97706` text and label-sm bold styling.

### Input Fields & AI Query Box
- **Standard Input:** Height 44px, 0.5rem radius, warm white background (`#FFFFFF`), border 1px `rgba(58, 80, 107, 0.2)`. Focus state: border color `#0D9488` with a 3px outer glow ring of `rgba(20, 184, 166, 0.15)`.
- **AI Omnibox / Prompt Bar:** Prominent 56px height, frosted white backdrop with `backdrop-filter: blur(12px)`, border 1.5px in `rgba(13, 148, 136, 0.35)`. Contains leading sparkle icon in `#14B8A6` and a trailing voice/send shortcut pill.

### Cards & Helpdesk Panels
- **Service Directory Card:** Solid `#FFFFFF` or translucent frosted ivory, 1rem corner radius, 1px perimeter border in `rgba(58, 80, 107, 0.08)`. Features a 4px left-edge accent strip indicating department category (e.g., Registrar, Bursar, Campus Security).
- **AI Response Bubble:** Surface rendered in `#EEF2FF` with rounded 1rem corners (bottom-left slightly flattened to 0.25rem for directional speech metaphor). Includes inline confidence citations and clickable source tags.

### Checkboxes & Radio Buttons
- **Checkbox:** 18px square with 4px border radius. Border is 1.5px `#3A506B`. Active state fills `#1C2541` with a crisp white checkmark icon.
- **Radio:** 18px circular with matching outer border; active state reveals an inner concentric dot in `#0D9488`.

### Specialized Campus Components
- **Step-by-Step Resolution Guide:** Accordion items bounded by delicate campus gridlines, featuring circular numeral badges in `#1C2541` that transition to `#0D9488` upon step completion.
- **Interactive Campus Status Banner:** Top-pinned ribbon in `#0B132B` with soft emerald pulse indicator (`#2DD4BF`) indicating real-time facility hours, system operational status, or transit advisories.