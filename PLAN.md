# Vercel Deployment Plan for vets-website-fork (Frontend Only)

## What was built

Three files were added to deploy a frontend-only version of vets-website to Vercel with a mock API:

### 1. `vercel.json` — Vercel project config

- **Build command:** `bash script/vercel-build.sh`
- **Output directory:** `build/localhost`
- **Install command:** `yarn install --frozen-lockfile --production=false`
- **Rewrites:** Routes API calls (`/v0/*`, `/facilities_api/*`, `/data/*`, `/csrf_token`) to the serverless mock function. Routes SPA paths for facility-locator and HCA to their respective `index.html`.

### 2. `script/vercel-build.sh` — Build script

- Builds only 3 apps: `static-pages`, `facilities`, `hca`
- Uses `--env scaffold` to generate standalone HTML pages via HtmlWebpackPlugin
- Uses `VERCEL_URL` env var (provided by Vercel) to set `__API__` so API calls target the same deployment
- Copies `vendor.entry.js` → `shared-modules.entry.js` (required by runtime)

### 3. `api/mock.js` — Vercel serverless function (mock VA API)

Adapted from the existing `src/platform/testing/e2e/mockapi.js` Express server. Serves mock responses for:

**Common endpoints:**
- `GET /v0/user` — mock authenticated user (Julio Hunter, LOA3)
- `GET /v0/feature_toggles` — empty feature flags
- `GET /v0/maintenance_windows` — no active windows

**HCA (10-10EZ) endpoints:**
- `GET /v0/in_progress_forms/1010ez` — prefill data
- `PUT /v0/in_progress_forms/1010ez` — save in progress
- `GET /v0/health_care_applications/rating_info` — disability rating (0%)
- `GET /v0/health_care_applications/facilities` — VA facilities list
- `POST /v0/health_care_applications/enrollment_status` — enrollment check
- `POST /v0/health_care_applications` — form submission
- `GET /data/cms/vamc-ehr.json` — VAMC EHR data

**Facility Locator endpoints:**
- `POST /facilities_api/v2/va` — facility search results
- `GET /facilities_api/v2/va/:id` — single facility detail
- `POST /facilities_api/v2/ccp/*` — community care providers
- `GET /facilities_api/v2/ccp/specialties` — provider specialties

## How to deploy

1. Push this branch to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select this repo
3. Vercel will auto-detect `vercel.json` and use the configured build command
4. Set Node.js version to **22.x** in Vercel project settings
5. Deploy

## How to add more apps

1. Find the app's `entryName` in its `manifest.json`
2. Add it to the comma-separated list in `script/vercel-build.sh`
3. Add SPA rewrite rules in `vercel.json` for the app's `rootUrl`
4. Add mock API responses in `api/mock.js` for any new endpoints

## Known limitations

- **Authentication:** Login/ID.me won't work (OAuth redirects not configured). The mock returns a fake authenticated user.
- **Build-time API URL:** The `VERCEL_URL` env var is baked into the JS bundle at build time. For custom domains, set `VERCEL_URL=your-domain.com` in Vercel env vars.
- **Mock data is static:** The serverless function returns fixed mock data — no form state persistence across requests.
- **static-pages has no rootUrl:** It generates JS bundles only (site-wide widgets). It doesn't get its own HTML page but is included in the build for shared functionality.
