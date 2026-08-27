# Integrations Module

Next.js app for browsing and exercising integration services: **SANAD SSO** (MoDEE SignFlow) and **Google reCAPTCHA v3**, with placeholders for OTP, SMS, and call center.


Built from [Next.js S3dyeh](https://github.com/ixartz/Next-js-S3dyeh).

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- next-intl (English)
- Zod-validated env (`src/libs/Env.ts`)

## Getting started

```bash
npm install
cp .env.example .env   # or copy from your secrets store
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

All app variables are validated in `src/libs/Env.ts`. The environment files use this shape:

```env
SIGNFLOW_BASE_URL=
SIGNFLOW_GSB_BASE_URL=
SIGNFLOW_CLIENT_ID=
SIGNFLOW_REDIRECT_URI=
SIGNFLOW_CLIENT_SECRET=
SIGNFLOW_IBM_CLIENT_ID=
SIGNFLOW_IBM_CLIENT_SECRET=
SIGNFLOW_PKCE_VERIFIER=
SIGNFLOW_PKCE_CHALLENGE=
RECAPTCHA_MIN_SCORE=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_LOGGING_LEVEL=
```

### Variables

| Variable | Description |
| --- | --- |
| `SIGNFLOW_BASE_URL` | SignFlow auth base URL |
| `SIGNFLOW_GSB_BASE_URL` | SignFlow GSB (token / userinfo / logout) base URL |
| `SIGNFLOW_CLIENT_ID` | OAuth client ID |
| `SIGNFLOW_REDIRECT_URI` | Registered callback URL |
| `SIGNFLOW_CLIENT_SECRET` | OAuth client secret and local session encryption secret |
| `SIGNFLOW_IBM_CLIENT_ID` / `SIGNFLOW_IBM_CLIENT_SECRET` | IBM API gateway headers |
| `SIGNFLOW_PKCE_VERIFIER` / `SIGNFLOW_PKCE_CHALLENGE` | Static PKCE pair registered with SignFlow |
| `RECAPTCHA_MIN_SCORE` | Score threshold (default `0.5`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret |
| `NEXT_PUBLIC_LOGGING_LEVEL` | Console logging level |

Register the SignFlow redirect URI as `https://icensus.dos.gov.jo/icensus/auth/sanad/callback`.

## Auth flow (SANAD)

1. `GET /api/auth/login` → SignFlow `/signflow/v2/auth` (PKCE + state)
2. Callback `GET /icensus/auth/sanad/callback` → token + userinfo → encrypted session cookie
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
