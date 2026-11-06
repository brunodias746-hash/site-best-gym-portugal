# BEST GYM — master update

Base: `main` at `8d7c78aaa798a393f191865dcdc7832a2cfc4eb4`.

## Native routes

| PT | EN | Source |
| --- | --- | --- |
| `/unidade-sao-joao-da-madeira` | `/en/gyms/sao-joao-da-madeira` | `unidade-sao-joao-da-madeira.dc.html` |
| `/lista-vip-sao-joao-da-madeira` | `/en/gyms/sao-joao-da-madeira/vip` | `lista-vip-sao-joao-da-madeira.dc.html` |
| `/built-by-best/candidatura` | `/en/built-by-best/apply` | `built-by-best-candidatura.dc.html` |
| `/personal-trainers/candidatura` | `/en/personal-trainers/apply` | `personal-trainers-candidatura.dc.html` |

`site-config.js` is the routing/SEO source of truth. The localized builder accepts a flat `source` basename for nested public routes and also emits directory index files for ordinary static hosting. It does not publish backend source or instruction files.

São João remains **EM BREVE**: around 2,000 m², over 100 machines, strength/cardio areas and 24H/7 access. No address, telephone, opening date, brands or social account were invented. No photos of other gyms are labelled as São João. Replace/add its own media only when supplied.

## Campaign maintenance

Change `BGSiteConfig.campaign` in `site-config.js` and the referenced artwork, then rebuild. It contains PT/EN label, headline, offer, summaries, conditions, artwork and CTA configuration. `campaign-content.js` binds that configuration to the existing Home, Header, unit banners, registration page, campaign page and isolated V2 popup. The popup retains its no-scroll-lock architecture. No November offer was invented.

Only the secondary action in the Home monthly campaign block was removed. Campaign page/popup/navigation links remain. The current approved offer is unchanged.

## Media and interactions

Images use colour by default. The Chroma overlay is subtle on desktop and absent on touch. The Home primary slide uses the existing approved `assets/img/area-personal-training.jpg`; its old source was intrinsically monochrome. Hero timing, slide isolation and responsive media remain intact. `scroll-experience.js` now shares the approved V3 mobile protections, so secondary pages also avoid creating a touch cursor canvas.

The marquee and stacked gallery scripts are unchanged. Product cards remain a catalogue, with the native mobile horizontal carousel preserved. Header/Footer use official logo proportions and BLESS attribution.

## Remaining configuration/content

- General official São João telephone and social accounts. Its address and VIP recipient are confirmed separately.
- Approved email transport/server-side sender settings; see `FORMS.md`. No external configuration was changed.
- November feed and Stories artwork. The approved November copy is in the central campaign configuration.

## Client follow-up — 6 November 2026

November campaign copy, offer, conditions and localized CTAs replace the previous active promotion. Set `campaign.artwork` to the feed WebP and `campaign.mobileArtwork` to the Stories WebP when both client originals can be copied. Suggested paths are `/assets/img/campaign/november-2026-feed.webp` and `/assets/img/campaign/november-2026-stories.webp`. Until then, the image panels are hidden and the offer remains available as HTML text.

Built By Best is an athlete project with separate information and application links. São João remains coming soon. Its confirmed address is Rua Oliveira Júnior, n.º 630, 3700-008 São João da Madeira, Portugal.

## Client follow-up — 3 November 2026

Based on `main` at `e5c844a0785101a1b50dc867c43ff625c9db1240`. Unit order follows creation: **01 Famalicão, 02 Valongo, 03 São João da Madeira (coming soon)**. Home, gym cards, registration, contacts, navigation contact blocks and footer follow this order. The official signup URL is `https://subscribe.mvf.pt/signup/bestgym`.

VIP mobile label and VIP/PT recipients are now confirmed; see `FORMS.md`. Automatic email transport still requires approved existing server settings. No infrastructure settings were changed.

Eleven client-supplied photos from the shared Drive folder are optimized to WebP and used on the Home/unit pages. Galleries preserve each photo's proportions. São João uses only its own exterior media and remains coming soon. See `UNIT-MEDIA.md` for source references. The approved Home Hero media and motion behavior remain intact.

The Privacy Policy retains its pre-existing draft/approval notice. This update documents the new form fields and purposes without inventing a legal entity, retention period or policy approval.
