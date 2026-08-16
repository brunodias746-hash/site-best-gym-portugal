# BEST GYM! — Design System (v2)

Design system for **BEST GYM!**, a modern Portuguese **24-hour performance network** with units in **Valongo** and **Vila Nova de Famalicão**, built for national growth. The system powers website, social, campaigns, unit communication, Built by Best, products and brand applications.

**Positioning:** *A Best Gym não vende musculação. Vende performance.*
**Brand statement:** *Performance todos os dias.*

## v2 direction — a strategic pivot
v1 was black-dominant and aggressive. **v2 is white-dominant, editorial and premium**, red used strategically, black for contrast only:

- **~55–65% white & off-white** — the dominant base (space, modernity, readability).
- **~20–30% Best Gym red** — impact & conversion: CTAs, active states, campaign highlights.
- **~10–20% black & charcoal** — contrast only: type, footer, selected impact sections, photo overlays.

Confident, direct, motivating — never a generic black-and-red fitness template, never AI-looking, never mascot-led. Real people and performance lead; the owl mascot is a **supporting** asset used with restraint.

## Fonts (real brand files, supplied)
Installed as `@font-face` from `fonts/`:
- **Staatliches** — athletic condensed display: headlines, offers, numbers, section titles. *Never for long paragraphs.*
- **Poppins** — modern geometric sans: navigation, body, forms, buttons, captions, mobile.

Tokens: `--font-display` (Staatliches) · `--font-text` (Poppins). Legacy `--font-support` / `--font-body` alias to these.

## Copy
**Portuguese from Portugal (pt-PT)**, never Brazilian. Speaks to **tu**. Headlines/CTAs UPPERCASE, action word in red. No emoji. Impact words: Performance, Hoje, Agora, 24h, Foco, Evolução, Sem desculpas. CTAs: Inscreve-te agora · Fala connosco · Começa hoje · Garante a tua vaga.

## Colour
Primary red `--best-red #E11507` (hover `--red-strong #C10D02`, pressed `--red-deep #8E0900`, tint `--red-wash #FCEAE8`). Base `--off-white #F6F5F3` / `--paper #FBFAF8` / `--white`. Contrast `--ink #0E0F11` / `--charcoal #1A1C1F`. Text `--text-strong` / `--text-body` / `--text-muted`. Semantic surface/text/border/state tokens + colour modes (light / red / dark) and photo overlays in `tokens/colors.css`.

## Type, spacing, effects
Editorial scale: `--fs-display-xl/-lg`, `--fs-h1..h4`, `--fs-stat`, body/nav/button/eyebrow. 12-col grid, 1280px container, 4px spacing base. Soft premium shadows (`--shadow-sm/md/lg/xl`), red conversion glow (`--glow-cta`), always-visible focus ring (`--focus-outline`). Restrained motion, honours `prefers-reduced-motion`. No grunge, smoke or fake texture.

## Iconography
One linear style — consistent stroke, athletic, precise. Red on light; white/red on dark. Never mix styles. (Lucide is a suitable CDN source at 1.8px+ stroke.)

## Photography
Photography-led: real members, trainers, facilities, equipment, community. Authentic, energetic, premium, natural. Avoid stock clichés, AI faces, plastic skin, fake transformations. *No official photos supplied yet — the brand book uses tasteful provisional references, clearly marked and fully replaceable.*

---

## INDEX / MANIFEST
**Root**
- `styles.css` — global entry (imports all tokens). Consumers link this one file.
- `readme.md`, `SKILL.md`, `thumbnail.html`.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `legacy.css` (v1→v2 bridge).

**`fonts/`** — Staatliches + Poppins `.ttf` (with OFL licences).

**`assets/`** — `logo-red.png` (on light), `logo-white.png` (on dark/red), `logo-black.png` (mono on light), `logo-on-red.png` (red-block lockup), `mascot-owl.png` (official owl — use with restraint), `logo-move-te.png` (event partner).

**`components/core/`** — React primitives (namespace `window.DesignSystem_6952b0`), light-first with full states:
- `Button` — CTA (primary / dark / outline / ghost / on-dark; states incl. hover/disabled/loading).
- `Badge` — flag/seal (solid / soft / outline / ink / live).
- `Headline` — Staatliches impact headline with red action word (tone dark/light/red).
- `Eyebrow` — kicker with red rule or section number.
- `Card` — surface (solid / raised / outline / ink / red; accent rule, hover lift).
- `Stat` — big Staatliches number + label.
- `UnitCard` — scalable location card (photo, city, address, 24h, areas, CTA).
- `Accordion` — accessible FAQ/info expander.
- `core.card.html` — component showcase (Design System tab).

**`guidelines/`** — v2 specimen cards (Colors, Type, Spacing/Effects, Brand) for the Design System tab.

**`presentation/`** — **flagship brand book**: `BestGym-DesignSystem.html` — a 24-section scrolling presentation with section nav, interactive controls (logo version, colour mode, component state, campaign selector, unit selector, device preview, motion replay) and clean **PDF export** (`window.print` hides all chrome). `site-preview.html` is the embedded responsive homepage; `brandbook.css` / `brandbook.js` are its support files.

**`templates/`** — Design Component templates consuming projects can copy:
- `campaign-post/` — social campaign post (1080×1350).
- `move-te-story/` — MOVE-TE event story (1080×1920, dark event poster).
*(These predate v2's white-dominant pivot; the `tokens/legacy.css` bridge keeps them rendering. Rebuild toward the v2 light direction as needed.)*
