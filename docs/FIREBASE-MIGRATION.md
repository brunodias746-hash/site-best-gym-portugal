# BEST GYM — Firebase migration

The public website targets the existing Firebase project `bestgym-pt` (BestGYM), using the Hosting site **`bestgym`** and the deploy target **`bestgym`**. The expected test URL is `https://bestgym.web.app`.

The other Hosting site, **`bestgym-pt`**, serves **`kiosk.bestgym.pt`**. It must never be included in a website deploy, overwritten, detached, or reconfigured. `.firebaserc` maps the `bestgym` target to the single site `bestgym`. `scripts/prepare-firebase.mjs` checks that mapping and the project selected by the CLI before preparing a deploy.

## Local verification

Use Node.js 22 and the official Firebase CLI. The static build produces `public/` from the same PT/EN source pages as Vercel. The preparation script copies the existing HTTP handler, validation and recipient schema into the Functions package at build time. The generated copy is ignored by Git.

```sh
npm --prefix functions ci
node scripts/prepare-firebase.mjs
node --test tests/build.test.cjs tests/leads.test.cjs
firebase emulators:exec --project demo-bestgym --only hosting,functions "node --test tests/firebase-emulator.test.cjs"
```

To exercise the site in a browser, start the same emulators with `firebase emulators:start --project demo-bestgym --only hosting,functions`. Open `http://127.0.0.1:5000` or run `tests/browser-qa.cjs`, `tests/interactions-browser.cjs` and `tests/forms-browser.cjs` with `BASE_URL` set to that address. The emulator uses a demo project and the function disables Resend sending locally. If the CLI warns that the secret is missing, use an ignored `functions/.secret.local` with a dummy `RESEND_API_KEY` value for the emulator only. The API readiness should be false and a valid local POST should report `transport_pending`. Provider acceptance and failure are exercised using mocked responses in the existing tests.

Firebase serves the existing localized routes and applies equivalent security and cache headers. The two legacy registration URLs remain permanent redirects to franchising. Firebase Hosting uses HTTP 301 for those redirects. Unknown paths return HTTP 404.

## Firebase deployment

The HTTPS function `bestgymLeads` uses Node.js 22 in **`europe-west1`** and belongs to the isolated `bestgym-web` codebase. Hosting rewrites `/api/leads` to that function. It uses the existing allowlisted recipients, validation, consent handling, request limits and Resend response contract. The rate limiter remains per instance.

In the Firebase console the project is on Blaze, but initial Functions setup requires a project owner. Before deploying, the owner must complete that setup and authorize an account to deploy the website target and its function and manage the function's secret. Authenticate the Firebase CLI as that account and verify the target mapping and site list. Use an authorized BEST GYM Resend sending key scoped to `forms.bestgym.pt` and store it as `RESEND_API_KEY` in Secret Manager through the CLI prompt. `FORM_EMAIL_FROM` is a nonsecret Functions parameter. Its default is the confirmed `BEST GYM <formularios@forms.bestgym.pt>` sender. Do not put any API key in Git, build output or a command argument.

Run these commands only when the owner setup and deployment access are confirmed:

```sh
firebase hosting:sites:list --project bestgym-pt
firebase functions:secrets:set RESEND_API_KEY --project bestgym-pt
firebase deploy --project bestgym-pt --only functions:bestgym-web
firebase deploy --project bestgym-pt --only hosting:bestgym
```

Once the deployment is live, verify the PT/EN routes, assets, and `https://bestgym.web.app/api/leads?type=saoJoaoVip`. When it returns `ready: true`, submit exactly one labeled technical test from the published VIP form. Check the HTTP response, the success screen, the Resend message ID and the delivery event where available.

## Domain cutover and rollback

The Firebase validation stage retains the canonical origin currently configured for Vercel. The site on Vercel remains the fallback during validation. Keep `vercel.json` and its deployment active. Publish the Firebase changes from the migration branch while the Vercel production branch remains in service.

For a separately approved cutover, update the canonical origin in `site-config.js`, regenerate the sitemap and localized pages, update the sitemap URL in `robots.txt`, and verify canonical, hreflang and Open Graph URLs on both locales. Add the approved public hostname to the Functions origin allowlist. Connect the official domain to the **`bestgym`** Hosting site and validate HTTPS, localized routes and forms before considering the cutover complete. Record the existing web DNS settings and verified Vercel deployment in the cutover plan. If rollback is needed, serve the site from that Vercel deployment and restore only the approved web records. Preserve the kiosk and all email records throughout.
