# Integrations Module

Next.js app for browsing and exercising integration services: **SANAD SSO** (MoDEE SignFlow) and **Google reCAPTCHA v3**, with placeholders for OTP, SMS, and call center.


Built from [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- next-intl (English)
- Zod-validated env (`src/libs/Env.ts`)

## Getting started

```bash
npm install
cp .env .env.local   # or copy from your secrets store
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Integrations hub

| Module | Status | Path |
| --- | --- | --- |
| OTP | Planned | `/dashboard/integrations/otp` |
| SMS | Planned | `/dashboard/integrations/sms` |
| Call center | Coming soon | — |
| SANAD SSO | Ready | `/dashboard/integrations/sanad-sso` |
| Google reCAPTCHA | Ready | `/dashboard/integrations/google-recaptcha` |

Hub: `/dashboard` (public). User profile: `/dashboard/user-profile` (requires session).

### Source layout

```
src/modules/
  integrations/     # catalog, hub UI, shared shell, Sanad + planned details
  recaptcha/        # client helpers, server verify, demo form, detail
src/libs/
  SanadAuth.ts      # login / callback / logout orchestration
  Signflow.ts       # SignFlow HTTP client
  AuthSession.ts    # encrypted session cookie
```

## Environment

All variables are validated in `src/libs/Env.ts`. Never read `process.env` directly in app code.

### Required (auth)

| Variable | Description |
| --- | --- |
| `AUTH_SECRET` | ≥32 chars; encrypts the session cookie |
| `SIGNFLOW_BASE_URL` | SignFlow auth base URL |
| `SIGNFLOW_GSB_BASE_URL` | SignFlow GSB (token / userinfo / logout) base URL |
| `SIGNFLOW_CLIENT_ID` / `SIGNFLOW_CLIENT_SECRET` | OAuth client credentials |
| `SIGNFLOW_IBM_CLIENT_ID` / `SIGNFLOW_IBM_CLIENT_SECRET` | IBM API gateway headers |
| `SIGNFLOW_PKCE_VERIFIER` / `SIGNFLOW_PKCE_CHALLENGE` | Static PKCE pair registered with SignFlow |

### Optional

| Variable | Description |
| --- | --- |
| `SIGNFLOW_REDIRECT_URI` | Override callback URL (default: `{origin}/api/auth/callback`) |
| `NEXT_PUBLIC_APP_URL` | Public app origin (set this on Vercel to your real domain) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret |
| `RECAPTCHA_MIN_SCORE` | Score threshold (default `0.5`) |

Register the SignFlow redirect URI as `{your-origin}/api/auth/callback`.

## Auth flow (SANAD)

1. `GET /api/auth/login` → SignFlow `/signflow/v2/auth` (PKCE + state)
2. Callback `GET /api/auth/callback` → token + userinfo → encrypted session cookie
3. `POST /api/auth/logout` → revoke token + clear cookies

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build-local` | Production build locally |
| `npm run lint` / `lint:fix` | Ultracite (oxlint + format) |
| `npm run check:types` | TypeScript |
| `npm run check:deps` | Knip |
| `npm run check:i18n` | Translation keys |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright |

## License

See [LICENSE](./LICENSE).
