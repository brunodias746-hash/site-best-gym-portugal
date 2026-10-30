# BEST GYM — native forms and transport

The frontend remains static/DC. `best-forms.js` renders a native custom element inside an open shadow root so that DC rerenders and translation observers cannot replace entered data. All styles inherit the main theme. It handles validation, steps, review, consent, error/loading states and first-invalid-field focus.

## One public configuration

`lead-config.js` contains schemas, localized labels, success copy, endpoint and confirmed recipients. It is also imported by the server. Never put credentials here.

| Type | Destination |
| --- | --- |
| `builtByBest` | `builtByBestRecipient`: `rhvalongo@bestgym.pt` |
| `personalTrainer` | `personalTrainerRecipient`: pending client confirmation |
| `saoJoaoVip` | `saoJoaoRecipient`: pending client confirmation |
| `franchising` | `franchisingRecipient`: `franchising@bestgym.pt` |
| `contact` | Valongo / Famalicão from the allowlisted `contactRecipients` map |

Supplying the VIP or PT recipient later is a one-location edit to this configuration. The caller cannot choose an arbitrary recipient.

## Portable server adapter

`lib/lead-handler.cjs` validates the schema and consent server-side. `api/leads.js` is the small Vercel HTTP adapter. A future Firebase Function can invoke the same processor; the form UI only needs the configured endpoint. No Firebase or DNS configuration was changed.

The implemented email adapter uses the Resend HTTPS API. It needs **existing, approved server-side** `RESEND_API_KEY` and `FORM_EMAIL_FROM` settings. This update does not create accounts, authenticate a sender/domain, add credentials or alter external settings. Until configured, the endpoint returns `503` and the interface states that no details were sent. Missing recipients behave the same way.

Only a successful provider response containing a real message ID produces a success screen. This means the provider accepted the email; it is not a claim of inbox delivery. Failures preserve all input. A stable request ID and payload digest prevent duplicate sends on retries. The payload contains the allowlisted form fields, consent, policy path, language and request reference. No personal data or secrets are logged. The provider owns email retention and delivery events.

For known recipients, an explicit email-app fallback is offered after a failed online attempt. The user must send that message themselves. Opening a mailto link never displays “candidatura recebida”. No fallback recipient is fabricated for VIP or PT.

The HTTP adapter limits body size, accepts JSON POSTs, rejects foreign browser origins, checks a honeypot and uses a bounded per-instance rate limiter. This is not a distributed rate-limit service.

## Recovery findings

The previous Personal Trainers deployment exposed `ready:false`. Its source used private Vercel Blob storage, had no automatic email delivery and no confirmed recipient. Its README recorded unavailable Blob configuration. That implementation was not reused and the old deployment was not changed or deleted.

## Verification

```text
node scripts/generate-localized-pages.mjs
node --test tests/leads.test.cjs tests/build.test.cjs
node scripts/serve-local.cjs
```

With Playwright and Chrome available, run `tests/browser-qa.cjs`, `tests/forms-browser.cjs` and `tests/interactions-browser.cjs`. Browser form success/failure tests intercept the transport locally and send no live emails. A live delivery test still requires an approved, configured transport.
