# MHV Demo Mode

## Overview

This application is a **self-contained demo environment** for My HealtheVet on VA.gov. It renders the full MHV experience using static fixture data — no authentication, no backend, no mock server required. The goal is to demo all MHV apps (starting with the landing page) as if the user were a logged-in, verified VA patient.

## Architecture

### Entry flow
1. User visits `/demo-mode` and sees an **intro page** explaining this is a demo
2. Clicking "Continue" sets a `sessionStorage` flag (`mhvDemoModeAcknowledged`) and navigates to `/demo-mode/my-health`
3. The **App wrapper** (`containers/App.jsx`) checks for this flag on every route — if missing, it redirects back to `/demo-mode` (prevents direct bookmarking without acknowledging the demo)

### Routing (`routes.jsx`)
Uses React Router v3 plain-object config (same pattern as `src/applications/login/`):
- `path: '/'` — `App` wrapper (fragment, renders children)
- `indexRoute` — `IntroPage` (the demo acknowledgment page)
- `childRoutes`:
  - `'my-health'` — `LandingPageContainer` (the MHV landing page demo)
  - `'*'` — catch-all fallback to `IntroPage`
  - **Wildcard must always be last** (React Router v3 matches top-down)

### Fetch interception (`utils/mock-api.js`)
Instead of requiring a mock server, the app patches `window.fetch` **before** the platform bootstraps (`app-entry.jsx`). All API calls are intercepted and return static fixture data:

| URL pattern | Fixture file |
|---|---|
| `/v0/user` (not `/v0/user/mhv_user_account`) | `fixtures/user.json` |
| `/v0/user/mhv_user_account` | `fixtures/account-status.json` |
| `/v0/feature_toggles` | `fixtures/feature-toggles.json` |
| `/v0/maintenance_windows` | inline `{ data: [] }` |
| `/my_health/v1/messaging/folders` | `fixtures/folders.json` |
| `/v0/profile/personal_information` | `fixtures/personal-information.json` |
| `/data/cms/vamc-ehr.json` | inline empty string |

**Order matters** in `mockRoutes` — more specific patterns (e.g., `/v0/user/mhv_user_account`) must come before less specific ones (`/v0/user`).

### Session gate (`constants.js`, `containers/App.jsx`, `components/IntroPage.jsx`)
- `IntroPage` sets `sessionStorage.setItem('mhvDemoModeAcknowledged', 'true')` on click
- `App` checks `window.location.pathname` (with trailing slash stripped) and redirects via `window.location.replace('/demo-mode')` if the flag is missing and we're not on the index route
- Clears automatically when the browser session ends

### Reducers (`reducers/index.js`)
Exports the `myHealth` combined reducer (imported from `demo-apps/mhv-landing-page/reducers/`) so the Redux store has the correct state shape (`state.myHealth.accountStatus`, etc.).

### Demo apps (`demo-apps/`)
Contains copies of MHV apps modified for demo use. Currently:
- **`mhv-landing-page/`** — Copy of the real MHV landing page with `RequiredLoginView` removed from `LandingPageContainer.jsx` (since auth is mocked at the API level)

## Current status

### What's working
- Intro page with session gate
- Fetch interception returning mock data for all API endpoints
- Landing page renders without authentication
- Redux store populated via intercepted API responses

### What still needs work
- **Missing data on the landing page** — Some components may need additional fixture data or the existing fixtures may need adjustments. Debug by checking the browser console for errors and the Redux DevTools for the store state.
- **Future demo apps** — The architecture supports adding more child routes (e.g., `'my-health/secure-messaging'`, `'my-health/medications'`) with their own containers. Each new app may need additional fixture data and mock API routes.
- **Demo banner** — A persistent banner across all demo pages indicating this is a demo environment (planned for `App.jsx`).

## Key files

| File | Purpose |
|---|---|
| `app-entry.jsx` | Calls `setupMockApi()` then `startAppFromIndex()` |
| `routes.jsx` | Plain-object route config with childRoutes |
| `containers/App.jsx` | Session gate wrapper |
| `components/IntroPage.jsx` | Demo intro/acknowledgment page |
| `constants.js` | `DEMO_MODE_ACKNOWLEDGED` sessionStorage key |
| `utils/mock-api.js` | Fetch interceptor with URL pattern matching |
| `fixtures/*.json` | Static API response data |
| `reducers/index.js` | Exports `myHealth` reducer from landing page |
| `demo-apps/mhv-landing-page/` | Modified copy of MHV landing page |

## URLs
- Intro: http://localhost:3001/demo-mode
- Landing page: http://localhost:3001/demo-mode/my-health

## Commands
```bash
# Development (scaffold flag required for HTML generation)
yarn watch --env entry=mhv-demo-mode --env scaffold

# Unit tests
yarn test:unit --app-folder mhv-demo-mode

# E2E tests
yarn cy:run --spec "src/applications/mhv-demo-mode/tests/e2e/mhv-demo-mode.cypress.spec.js"
```

## Adding a new demo app

1. Copy the source app into `demo-apps/`
2. Remove `RequiredLoginView` from its main container
3. Add its reducers to `reducers/index.js`
4. Add any new API endpoints to `utils/mock-api.js` with corresponding fixtures
5. Add a child route in `routes.jsx` (before the `*` wildcard)
6. Add its entry to `registry.scaffold.json` if it needs its own HTML page