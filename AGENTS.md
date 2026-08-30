# BEST GYM — Codex Operating Instructions

## Mission

Codex is the primary technical owner of the BEST GYM website.

When Bruno asks to change, correct, improve, test or publish the site, take the task from diagnosis through implementation, QA and production verification. Prefer execution over long explanations.

## Project identity

- Client: BEST GYM
- Agency: BLESS
- Responsible creative: Bruno Dias
- Market: Portugal
- Public language: Portuguese from Portugal (pt-PT)
- Institution grammatical gender: always masculine:
  - `o BEST GYM`
  - `do BEST GYM`
  - `no BEST GYM`
- Brand direction: premium fitness/performance, dark-first, red/black/white, editorial, athletic and serious.
- Never make the brand look gamer, cyberpunk, generic-AI, nightclub or supplement-store.

## Source-of-truth priority

When instructions conflict, use this order:

1. latest explicit client/user request;
2. current production behavior and latest approved code on `main`;
3. this `AGENTS.md`;
4. `docs/CODEX-HANDOFF.md`;
5. older project/master documents and historical assets.

Never restore an older behavior just because it exists in an old file.

## Repository and production

- GitHub repository: `brunodias746-hash/site-best-gym-portugal`
- Production URL: `https://site-best-gym-portugal.vercel.app/`
- Vercel project: `site-best-gym-portugal`
- Vercel project id: `prj_5plDshA3WjpUpXnCUyeIVlj4H4Lc`
- Vercel team id: `team_VLjoryyuzP0osqfKj4l8LDOC`
- Production branch: `main`
- GitHub push to `main` triggers a Vercel production deployment.

## Architecture — preserve it

This is a custom static/DC site. It is NOT a React/Tailwind/Next.js app.

Important patterns/files include:

- `*.dc.html`
- `Header.dc.html`
- `Footer.dc.html`
- `theme.js`
- `theme.css`
- `presentation-fixes-v1.js`
- `scroll-experience-v3.js`
- `gallery-stacked-v1.css`
- `gallery-stacked-v1.js`
- `marquee-motion-v1.css`
- `marquee-motion-v2.js`
- `campaign-popup-v2.js`
- `vercel.json`

Do NOT migrate to React, Next.js, Tailwind, Wix or another stack merely to implement an effect.

Only perform a platform/stack migration when Bruno explicitly approves it.

## Mandatory workflow for every site change

1. Read/fetch the latest relevant files from `main` before editing.
2. Never use an old ZIP/patch as source of truth if `main` is newer.
3. Identify the smallest safe set of files to change.
4. Preserve all unrelated approved behavior.
5. Implement desktop and mobile together.
6. Test for regressions.
7. Commit with a clear English commit message.
8. Push/merge to `main` when the task is an approved site update.
9. Verify Vercel deployment reaches `READY`.
10. Fetch/test affected production URLs after deployment.
11. Report what changed and what was verified.

When Bruno says `corrige no site`, `aplica`, `atualiza`, `publica`, `faz no site` or equivalent, treat that as authorization to complete the normal GitHub → Vercel production workflow.

Do not ask for an additional deployment confirmation for routine site changes.

Ask for explicit confirmation before:

- DNS/domain cutover;
- changing MX/SPF/DKIM/email DNS;
- cancelling Wix/hosting;
- deleting production data;
- payment integrations;
- destructive account or infrastructure changes.

## Critical regressions — NEVER reintroduce

### 1. Hero slider overlap

A previous bug showed two Hero headlines at the same time.

Only the active Hero slide may be visible/clickable.

Inactive slides must remain:
- opacity `0`;
- lower z-index;
- `pointer-events: none`;
- clipped/hidden.

Do not keep the previous slide visibly active if it causes overlap.

### 2. Hero / page scroll lock

A previous campaign popup set:

`document.body.style.overflow = 'hidden'`

The popup could be removed by the dynamic DC Hero while the overflow lock remained, leaving the whole site stuck on the Hero.

`campaign-popup-v2.js` exists to solve this.

Rules:
- NEVER introduce persistent `body` or `html` `overflow:hidden` for the campaign popup.
- Popup must remain independent from the reactive Hero/DC tree.
- Closing/removing popup must never disable page scrolling.
- After popup changes, test scrolling from Hero all the way to footer.

### 3. Training areas carousel

The approved training-area carousel has continuous/stacked behavior.

Do not casually reparent DC cards into a new DOM hierarchy.

Arrow controls must remain clickable.

Pointer drag logic must ignore:
- links;
- buttons;
- image slots;
- inputs;
- editable elements.

### 4. Red marquee

The continuous red marquee is approved.

`marquee-motion-v2.js` is intentional because the CSS-only version became static.

Do not remove it without a tested replacement.

## Current client decisions

- Network: 3 gyms in the network.
- Open now:
  - Valongo
  - Vila Nova de Famalicão
- Coming soon:
  - São João da Madeira
- Correct public idea:
  - `2 ginásios abertos + São João da Madeira a caminho`
  - or `3 ginásios na rede`

### Terminology

`Burn Zone` is retired from public communication.

Use:
`Treino Funcional`

Do not bring `Burn Zone` back unless explicitly requested.

### Photography

Old staff/former-instructor/group-class photos must not return.

Group classes exist but are NOT the main visual focus.

Prefer:
- musculação;
- strength;
- weight training;
- performance;
- current promoters;
- individual or small-group training imagery.

### Mascot

The owl belongs to BEST GYM institutional communication.

The owl must NOT become the identifying visual of Built By Best.

Built By Best should use performance/strength imagery.

### Logos

Use official BEST GYM and Built By Best logos only.

Never:
- recreate logo with typography;
- generate logo with AI;
- stretch;
- distort;
- recolor arbitrarily;
- replace with lookalike text.

## Current campaign

Campaign:
`FÉRIAS OFF. GYM ON.`

Current approved site offer:

- `50% de desconto por mês até 2027`
- `inscrição grátis`
- `vagas limitadas`

Relevant files:

- `campanha.dc.html`
- `campaign-popup-v2.js`
- `campanha-ferias-off-gym-on-2026.png`
- campaign section inside `index.dc.html`

Do not restore older campaign copy such as:

- `3 meses de oferta + inscrição grátis`
- `Olá verão, olá descontos`

unless the client explicitly asks.

## Franchising

- Public route: `/franchising`
- Old `/registration` should redirect to `/franchising`
- Destination email: `franchising@bestgym.pt`
- Keep Franchising inside the same BEST GYM visual system.

## Contacts

Current intended contact destinations:

- Valongo: `valongo@bestgym.pt`
- Famalicão: `famalicao@bestgym.pt`
- Franchising: `franchising@bestgym.pt`

The site is currently static and forms may use `mailto:`.

Do not silently send NIF/contact data to a third-party form processor.

If direct server-side email submission is requested:
- choose a deliberate endpoint/provider;
- preserve privacy;
- document what data is transmitted.

## Social / BLESS footer

Official Instagram:

- Valongo: `https://www.instagram.com/bestgymvalongo/`
- Famalicão: `https://www.instagram.com/bestgymfamalicao/`

BLESS footer credit is intentional.

BLESS link:
`https://www.instagram.com/bless.pt/`

Do not remove the BLESS credit unless explicitly requested.

## Domain / Wix

The client owns `bestgym.pt` and historically used Wix.

The new site runs on Vercel.

Important:
- AI was used as a development tool only.
- There is no runtime AI dependency preventing normal hosting.
- Do not rebuild/migrate to Wix unless explicitly approved.
- Do not change DNS without explicit approval.
- Before any DNS cutover, preserve email records and verify MX/SPF/DKIM.

## Public copy rules

- Portuguese from Portugal.
- Always masculine institutional reference: `o BEST GYM`.
- Direct, confident, short.
- Avoid clichés.
- Do not invent:
  - prices;
  - percentages;
  - testimonials;
  - staff;
  - metrics;
  - campaign conditions.
- Headlines usually 2–7 words when possible.
- Do not overuse English.

## Visual rules

Desired:
- dark-first;
- black/charcoal/graphite;
- official red as accent;
- white for contrast;
- large real photography;
- generous negative space;
- premium sports editorial feel;
- Big Shoulders/display typography for strong headlines.

Avoid:
- excessive glow;
- gamer/cyberpunk;
- generic glassmorphism everywhere;
- excessive grunge;
- AI-looking humans;
- endless identical cards;
- making the brand exclusively bodybuilding/male.

## Responsive and accessibility rules

Test real intermediate widths, not only desktop/mobile extremes.

At minimum:
- mobile around 390px;
- tablet/intermediate around 768–1024px;
- desktop around 1440px.

Preserve:
- visible main registration CTA;
- keyboard navigation;
- visible focus;
- semantic labels;
- usable dialogs;
- alt text;
- sufficient contrast;
- reduced-motion handling where practical.

## Required production QA

Before declaring a site task complete, check relevant pages and normally include:

- `/`
- `/campanha`
- `/franchising`
- `/contactos`
- `/unidades`
- `/unidade-valongo`
- `/unidade-famalicao`
- `/built-by-best`

Verify:

- page scroll works from Hero to footer;
- popup opens/closes without scroll lock;
- Hero slides never overlap;
- campaign copy is current;
- no `Burn Zone` is visible;
- old group/staff imagery has not returned;
- Franchising route/navigation work;
- mobile around 390px;
- desktop around 1440px;
- external links are safe;
- Vercel deployment is `READY`.

## Working style with Bruno

Bruno prefers direct execution.

When the request is clear:
- inspect;
- implement;
- test;
- publish;
- report.

Do not make Bruno manually combine many tiny patches if repository access allows Codex to edit the source directly.

Prefer one coherent change set and preserve approved work.
