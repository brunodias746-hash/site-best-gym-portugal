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

- São João VIP/contact recipient.
- Personal Trainer recipient.
- Approved email transport/server-side sender settings; see `FORMS.md`. No external configuration was changed.
- November campaign artwork/copy.
- New Drive photos.

The Privacy Policy retains its pre-existing draft/approval notice. This update documents the new form fields and purposes without inventing a legal entity, retention period or policy approval.
