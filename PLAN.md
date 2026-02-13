# Vercel Deployment Plan for vets-website-fork (Frontend Only)

## Current State

- **153 React applications** in `src/applications/`, bundled by Webpack 5
- Currently deployed to **AWS S3 + CloudFront** via GitHub Actions
- Has a **Heroku setup** already (Procfile + heroku-postbuild script) that builds `static-pages` only
- The full VA.gov site requires a separate `content-build` repo for Drupal CMS HTML pages
- Build output goes to `build/{buildtype}/` with JS/CSS in `generated/`
- Node 22 required, Yarn 1.19.1

## Key Challenge

The full site depends on `content-build` for HTML templates. For a **frontend-only** deploy, we have two paths:

---

## Recommended Plan: Vercel Static Build (No content-build)

### Step 1: Add `vercel.json` config

```json
{
  "buildCommand": "yarn build:webpack --env buildtype=vagovprod",
  "outputDirectory": "build/vagovprod",
  "installCommand": "yarn install --frozen-lockfile",
  "framework": null,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/generated/$1" }
  ]
}
```

### Step 2: Decide which apps to build

**Option A: Build all 153 apps** (~25-35 min build time)
- May exceed Vercel's free tier build timeout (45 min max on Pro)
- `yarn build:webpack --env buildtype=vagovprod`

**Option B: Build a subset of apps** (recommended to start)
- Pick specific apps: `yarn build:webpack --env buildtype=vagovprod --env entry=app1,app2,app3`
- Much faster builds, iterate quickly
- Scale up as needed

### Step 3: Handle the HTML shell problem

Webpack generates JS/CSS bundles but each app needs an HTML page to load them. Currently `content-build` provides these. Options:

**Option A (Simplest):** Use the existing HtmlWebpackPlugin — the webpack config already generates `index.html` for each app entry via the `defined-defined-defined` template. Each app gets its own HTML at `build/{buildtype}/{rootUrl}/index.html`.

**Option B:** Create a minimal SPA shell that loads the right bundle based on the URL path.

### Step 4: Configure environment/API

- Set `API_URL` to point at the VA dev or staging API (`https://dev-api.va.gov`)
- Or use mock APIs for demo purposes
- Add env vars in Vercel dashboard:
  - `BUILDTYPE=vagovprod`
  - Any needed `MAPBOX_TOKEN`, etc.

### Step 5: Handle SPA routing

Each app is a React SPA with client-side routing. Vercel needs rewrite rules so all paths under an app's `rootUrl` serve that app's `index.html`:

```json
{
  "rewrites": [
    { "source": "/health-care/:path*", "destination": "/health-care/index.html" },
    { "source": "/claims-status/:path*", "destination": "/claims-status/index.html" }
  ]
}
```

This can be auto-generated from the manifest files.

### Step 6: Add build script

Create `script/vercel-build.sh`:
1. Run `yarn build:webpack` with chosen apps
2. Copy `vendor.entry.js` to `shared-modules.entry.js` (existing requirement)
3. Output to `build/vagovprod/`

---

## Implementation Steps (in order)

1. **Create `vercel.json`** with build config, output dir, and Node 22
2. **Create `script/vercel-build.sh`** wrapper script
3. **Auto-generate rewrite rules** from `src/applications/*/manifest.json` rootUrls
4. **Pick 2-3 starter apps** to validate the build works (e.g., `static-pages`, `facility-locator`)
5. **Configure env vars** for API endpoints
6. **Test build locally** with `vercel build` or `yarn build:webpack --env entry=static-pages`
7. **Connect repo to Vercel** and deploy
8. **Iterate** — add more apps, tune routing, handle edge cases

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Build timeout (free tier: 45 min) | Build subset of apps with `--entry` flag |
| Missing HTML templates (content-build) | HtmlWebpackPlugin already generates per-app HTML |
| CORS issues with VA APIs | Use dev-api.va.gov which may allow CORS, or add Vercel rewrites as API proxy |
| Large bundle size | Vercel has no hard limit on static assets; use code splitting already in webpack config |
| Authentication (ID.me/Login.gov) | Won't work without proper OAuth redirect config; skip auth-dependent apps initially |
