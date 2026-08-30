[CODEX-HANDOFF.md](https://github.com/user-attachments/files/31622588/CODEX-HANDOFF.md)
# BEST GYM — CODEX TECHNICAL HANDOFF

## 1. Purpose

This document gives Codex enough context to maintain the BEST GYM production website without depending on old chat history.

Always read `../AGENTS.md` first.

## 2. Project summary

BEST GYM is a Portuguese 24-hour gym network whose digital direction is being developed by BLESS.

The website must feel like a modern sports/performance brand, not a generic local gym.

Core positioning includes:

- `NÃO VENDEMOS MUSCULAÇÃO. VENDEMOS PERFORMANCE.`
- `PERFORMANCE TODOS OS DIAS.`
- `A TUA EVOLUÇÃO NÃO TEM HORÁRIO.`
- `BUILT BY BEST.`

Public language is pt-PT.

## 3. Production stack

The current site is a static custom design exported around DC components.

Do not assume React.

Pages are mostly `*.dc.html`.

Shared/global behavior is spread across:
- DC imported Header/Footer;
- theme files;
- presentation-fix scripts;
- scroll/motion scripts;
- Vercel rewrites.

The goal is stability and visual quality, not framework modernization.

## 4. Important production identifiers

GitHub:
`brunodias746-hash/site-best-gym-portugal`

Vercel production:
`https://site-best-gym-portugal.vercel.app/`

Vercel:
- project `site-best-gym-portugal`
- project id `prj_5plDshA3WjpUpXnCUyeIVlj4H4Lc`
- team id `team_VLjoryyuzP0osqfKj4l8LDOC`

Branch:
`main`

## 5. Important current files

### Core
- `index.dc.html`
- `Header.dc.html`
- `Footer.dc.html`
- `theme.js`
- `theme.css`
- `presentation-fixes-v1.js`
- `vercel.json`

### Motion / interaction
- `scroll-experience-v3.js`
- `gallery-stacked-v1.css`
- `gallery-stacked-v1.js`
- `marquee-motion-v1.css`
- `marquee-motion-v2.js`

### Campaign
- `campanha.dc.html`
- `campaign-popup-v2.js`
- `campanha-ferias-off-gym-on-2026.png`

### Main pages
- `built-by-best.dc.html`
- `contactos.dc.html`
- `conteudos.dc.html`
- `sobre.dc.html`
- `unidades.dc.html`
- `unidade-valongo.dc.html`
- `unidade-famalicao.dc.html`
- `franchising.dc.html`
- `faq.dc.html`

## 6. Current routing model

Current public paths include:

- `/`
- `/unidades`
- `/unidade-valongo`
- `/unidade-famalicao`
- `/built-by-best`
- `/franchising`
- `/produtos`
- `/conteudos`
- `/conteudo-detalhe`
- `/sobre`
- `/contactos`
- `/inscricao`
- `/campanha`
- `/faq`
- `/em-breve`
- `/privacidade`
- `/termos`
- `/cookies`

Do not blindly replace these with older master-document routes such as `/unidades/valongo` without an approved routing migration.

## 7. Hero history

The home Hero has three primary messages:

1. `NÃO VENDEMOS MUSCULAÇÃO. VENDEMOS PERFORMANCE.`
2. `A TUA EVOLUÇÃO NÃO TEM HORÁRIO.`
3. `BUILT BY BEST`

A historic bug allowed the previous slide to remain visible during state changes, creating overlapping headlines.

Current intended render logic:
- active slide visible;
- inactive slides hidden and non-interactive.

Any new transition must preserve that rule.

## 8. Popup history

The campaign popup originally lived inside the dynamic Home/DC tree.

It used a body scroll lock and could disappear on a Hero re-render while leaving scrolling disabled.

This created the critical symptom:
`site opens, Hero works, page does not scroll down`.

Current design:
`campaign-popup-v2.js`

The popup is appended independently to `document.body`.

It deliberately does NOT use a persistent page scroll lock.

Do not undo this architecture.

## 9. Training carousel history

The areas-of-training component was adapted to a stacked/continuous carousel.

An early implementation broke the DC card structure by reparenting cards.

Later it was corrected by preserving the original rail.

A second bug made arrow controls conflict with pointer drag.

The approved behavior:
- continuous motion;
- buttons work;
- drag works;
- pointer capture ignores actionable elements.

Preserve this.

## 10. Marquee history

The red performance marquee became static under responsive CSS.

A CSS-only hotfix did not solve it reliably.

The JS V2 continuous implementation worked and was approved.

Treat the current JS marquee as deliberate.

## 11. Current network facts

Open:
- Valongo
- Vila Nova de Famalicão

Coming soon:
- São João da Madeira

Correct communication:
- 2 open;
- third on the way;
- network count = 3.

## 12. Current brand/client corrections

### Institutional grammar
Always:
- o BEST GYM
- do BEST GYM
- no BEST GYM

Never:
- a BEST GYM
- da BEST GYM
- na BEST GYM

### Burn Zone
Retired.

Use:
`Treino Funcional`

### Photography
Client does not want old former-instructor/staff class photos.

Do not use old group-class photos as visual priority.

Use performance/strength/current-promoter imagery.

### Owl
BEST GYM institutional mascot.

Not the core mascot/identity for Built By Best.

### Built By Best
Serious performance/coaching program.

Use strength/performance visuals.

## 13. Current campaign

Name:
`FÉRIAS OFF. GYM ON.`

Offer:
`50% de desconto por mês até 2027 + inscrição grátis`

Urgency:
`vagas limitadas`

Campaign asset:
`campanha-ferias-off-gym-on-2026.png`

Current placements:
- campaign popup;
- Home campaign section;
- `/campanha`.

Historic/obsolete copy that should not return:
- `3 meses de oferta + inscrição grátis`
- `Olá verão, olá descontos`

## 14. Franchising

Client requested a Franchising separator/page.

Current route:
`/franchising`

Old route:
`/registration`

Expected redirect:
`/registration` → `/franchising`

Email:
`franchising@bestgym.pt`

The current form includes business-interest fields such as:
- name;
- email;
- phone;
- NIF;
- available capital;
- intended location;
- project type;
- message/privacy.

Do not invent investment thresholds or financial promises.

## 15. Contact forms

Intended destinations:
- Valongo → `valongo@bestgym.pt`
- Famalicão → `famalicao@bestgym.pt`
- Franchising → `franchising@bestgym.pt`

Current static implementation can use mailto.

If migrating to direct submission:
- do not silently route personal data through an arbitrary third party;
- implement privacy-conscious handling.

## 16. Social links

Valongo:
`https://www.instagram.com/bestgymvalongo/`

Famalicão:
`https://www.instagram.com/bestgymfamalicao/`

BLESS:
`https://www.instagram.com/bless.pt/`

BLESS design/development footer credit is currently intentional.

## 17. Domain situation

The client owns `bestgym.pt`.

The legacy site/hosting has been associated with Wix.

The new site is on Vercel.

The fact that AI assisted development has no bearing on hosting compatibility; the production output is normal web code/assets.

If asked about Wix:
- migrating the existing code into Wix is not automatic;
- a fully Wix-editable version would be a rebuild/adaptation;
- keeping Vercel and pointing the domain is technically simpler.

Do not perform a DNS cutover without explicit approval.

## 18. Visual system

Primary direction:
dark-first.

Desired:
- deep black;
- off-black;
- charcoal;
- graphite;
- white typography;
- official red;
- large real photography;
- editorial spacing;
- premium athletic mood.

Concept:
`DARK, NOT HEAVY`

Avoid:
- too much glow;
- too much glass;
- too much grunge;
- fake 3D AI aesthetic;
- overly aggressive bodybuilding-only tone.

## 19. Website objective

The site should:

1. convert to registrations;
2. present current campaigns;
3. present units;
4. reinforce 24H model;
5. show training structure;
6. position Built By Best;
7. show products;
8. build trust;
9. work perfectly on mobile;
10. scale to new units;
11. allow monthly campaign updates;
12. use premium motion without sacrificing performance.

## 20. Ongoing maintenance model

Bruno creates the BEST GYM monthly campaign materials.

Therefore site campaign maintenance should be easy for Codex:
- swap campaign asset/copy;
- update popup;
- update Home campaign block;
- update `/campanha`;
- verify CTA;
- keep campaign content consistent.

Do not require a redesign every month.

## 21. Before touching production

Read latest `main`.

Then review:
- affected HTML;
- `presentation-fixes-v1.js` because it can mutate content after render;
- `theme.js`;
- `vercel.json`;
- motion scripts relevant to the section.

A visible bug can originate from a global mutation script rather than the page HTML.

## 22. After every production deployment

Verify production, not only source.

Suggested smoke test:

1. Home loads.
2. Hero advances.
3. Scroll works.
4. Popup opens and closes.
5. Scroll still works after popup close.
6. Red marquee moves continuously.
7. Training carousel arrows and drag work.
8. Campaign shows current copy.
9. `/campanha` loads.
10. `/franchising` loads.
11. Contact routes render.
12. Mobile has no horizontal break/cut headline.
13. BLESS footer remains.
14. Vercel deployment is READY.

## 23. Codex behavior

Do not respond to a clear Bruno request with a long tutorial if you can perform the work.

Preferred pattern:

`I found the cause → changed X/Y → tested A/B/C → production is ready.`

If something is blocked by permissions, say exactly what is blocked and give Bruno the minimum manual action required.
