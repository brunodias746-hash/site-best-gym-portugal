# BEST GYM — native forms and transport

The frontend remains static/DC. `best-forms.js` renders a native custom element inside an open shadow root so that DC rerenders and translation observers cannot replace entered data. All styles inherit the main theme. It handles validation, steps, review, consent, error/loading states and first-invalid-field focus.

## One public configuration

`lead-config.js` contains schemas, localized labels, success copy, endpoint and confirmed recipients. It is also imported by the server. Never put credentials here.

| Type | Destination |
| --- | --- |
| `builtByBest` | `builtByBestRecipient`: `rhvalongo@bestgym.pt` |
| `personalTrainer` | `personalTrainerRecipient`: `partners@bestgym.pt` |
| `saoJoaoVip` | `saoJoaoRecipient`: `Saojoaodamadeira@bestgym.pt` |
| `franchising` | `franchisingRecipient`: `franchising@bestgym.pt` |
| `contact` | Famalicão / Valongo from the allowlisted `contactRecipients` map |
| `careers` | Private server-side map: `famalicao` → `rhfamalicao@bestgym.pt`; `valongo` → `rhvalongo@bestgym.pt`; `sao-joao-da-madeira` → `rhsaojoaodamadeira@bestgym.pt` |

VIP and PT destinations were confirmed by the client on 3 November 2026. The VIP field is labelled “Telemóvel” / “Mobile phone”. The VIP email is not an approved general unit contact. The caller cannot choose an arbitrary recipient.

## Portable server adapter

`lib/lead-handler.cjs` validates the schema and consent server-side. `api/leads.js` handles the HTTP contract for Vercel and is also packaged with the Firebase HTTPS adapter. The browser calls `/api/leads` on either host. See [Firebase migration](FIREBASE-MIGRATION.md) for the target, local testing and deployment prerequisites.

The implemented email adapter uses the Resend HTTPS API. It needs **existing, approved server-side** `RESEND_API_KEY` and `FORM_EMAIL_FROM` settings. If either setting is missing, the endpoint returns `503` and the interface states that no details were sent. Missing recipients behave the same way.

Only a successful provider response containing a real message ID produces a success screen. This means the provider accepted the email; it is not a claim of inbox delivery. Failures preserve all input. A stable request ID and payload digest prevent duplicate sends on retries. The payload contains the allowlisted form fields, consent, policy path, language and request reference. No personal data or secrets are logged. The provider owns email retention and delivery events.

For known recipients, including VIP and PT, an explicit email-app fallback is offered after a failed online attempt. The user must send that message themselves. Opening a mailto link never displays “candidatura recebida”.

The HTTP adapter limits body size, accepts JSON POSTs, rejects foreign browser origins, checks a honeypot and uses a bounded per-instance rate limiter. This is not a distributed rate-limit service.

## Careers extension — 16 November 2026

The PT `/trabalhe-connosco` and EN `/en/work-with-us` pages extend the same `best-lead-form` component and `/api/leads` handler with type `careers`. `JOB_ROLES` in `lead-config.js` is the central configurable list. Only “Candidatura espontânea” / “Speculative application” is offered until the client approves specific roles. The public payload contains a unit slug, never a recipient address. Unknown units, roles and injected recipient fields are rejected server-side.

CVs are PDF/DOCX only, up to 5 MiB (5 × 1024 × 1024 bytes), with extension and available MIME checks in the browser and server. The backend also verifies PDF signatures/trailer or DOCX ZIP structure, required XML content, bounded decompression and checksums for the inspected XML. This is format validation, not an antivirus service. Filenames are sanitized. The base64 file is processed only in memory and attached directly to the unit's internal Resend email; no Firebase Storage, public URLs or CV logs are created. The privacy page discloses the recruitment purpose and Resend processing.

Careers requests alone allow an 8 MiB HTTP body for the base64 CV; existing forms retain their 16,000-byte limit. Careers has a separate per-instance limit of three requests per IP per 15 minutes. Each request retains a stable UUID and ISO timestamp across retries. Internal and applicant messages have distinct stable Resend idempotency keys. Success requires both provider message IDs. The applicant confirmation is localized, has no attachment and promises only receipt. No email-app fallback exposes the private recruitment mapping.

Verification: `node --test tests/careers.test.cjs tests/careers-http.test.cjs tests/leads.test.cjs`; `tests/careers-browser.cjs` exercises upload and UI with the real handler and an intercepted email provider. These tests send no real email.

**Deployment finding:** fresh live checks on 16 November found Vercel VIP/contact `ready:true`, but Firebase Hosting still rewrites `/api/leads` to `/api-leads-unavailable.json` (`ready:false`, `transport_pending`). No newer form fix was present in remote branch history. The authenticated Firebase account `brunodias746@gmail.com` received HTTP 403 for `cloudfunctions.functions.list` and `cloudfunctions.functions.get` in `bestgym-pt`. Therefore the exact existing deployed function could not be verified and no Function, API, secret or credential was changed. The careers backend extension is tested source code, not an activated Firebase email service. Static publication must preserve the latest live API rewrite, never replace a working function with an archived fallback. Vercel remains unchanged. A production attachment/confirmation test is pending backend deployment by an authorized account; automated provider acceptance is not proof of real email delivery.

## Recovery findings

The previous Personal Trainers deployment exposed `ready:false`. Its source used private Vercel Blob storage, had no automatic email delivery and no confirmed recipient. Its README recorded unavailable Blob configuration. That implementation was not reused and the old deployment was not changed or deleted.

## Verification

```text
node scripts/generate-localized-pages.mjs
node --test tests/leads.test.cjs tests/build.test.cjs
node scripts/serve-local.cjs
```

With Playwright and Chrome available, run `tests/browser-qa.cjs`, `tests/forms-browser.cjs` and `tests/interactions-browser.cjs`. Browser form success/failure tests intercept the transport locally and send no live emails. A live delivery test still requires an approved, configured transport.

## Production activation — 6 November 2026

- Confirmed `forms.bestgym.pt` is verified, with sending enabled; DKIM, SPF MX, SPF TXT and CNAME records all reported verified. No DNS records were changed.
- Created the dedicated `BEST GYM website production` sending-only key, restricted to that domain. Its value is stored only in Vercel Production as sensitive `RESEND_API_KEY`; no key value belongs in this repository.
- Configured Production `FORM_EMAIL_FROM` as `BEST GYM <formularios@forms.bestgym.pt>` and redeployed the existing approved `main`.
- Production `/api/leads?type=saoJoaoVip` returned `{"ready":true}`.
- Made one controlled submission through the production VIP page, clearly marked `TESTE TÉCNICO BLESS — ignorar inscrição`, with synthetic contact details. The backend returned HTTP 200, `ok:true` and Resend ID `01a1b124-dd7d-7cf4-863f-7ea8fd88f323`; the UI then displayed its success state. Resend subsequently reported `delivered` to the approved VIP recipient. This confirms recipient mail-server delivery, not inbox placement or human readership.
- November campaign copy, athlete-project positioning, São João address, photography and coming-soon status remain unchanged.
- Campaign artwork integration remains pending: the chat image preview was visible, but no original Feed or Stories image file was mounted in the execution environment. The supplied `/Volumes/...` path is on the originating computer. Keep `artwork` and `mobileArtwork` null until the originals are accessible; do not substitute generated or obsolete artwork.
