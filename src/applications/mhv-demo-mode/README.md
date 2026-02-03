# MHV Demo Mode

## Overview

This application is a **self-contained demo environment** for My HealtheVet on VA.gov, designed for **training purposes**. Medical professionals can use this to show Veterans where to find health tools and features in their own accounts.

The demo renders the full MHV experience using static fixture data — no authentication, no backend, no mock server required. The header intentionally shows "Sign in" (not a logged-in user) to avoid confusion, while the page content displays as if viewed by a verified VA patient.

## Architecture

### Entry flow
1. User visits `/mhv-demo-mode` and sees an **intro page** explaining this is a demo
2. Clicking "Continue" sets a `sessionStorage` flag (`mhvDemoModeAcknowledged`) with a timestamp and navigates to `/mhv-demo-mode/my-health`
3. The **App wrapper** (`containers/App.jsx`) checks for this flag on every route — if missing or expired (30 min timeout), it redirects back to `/mhv-demo-mode`
4. A **demo banner** appears at the top of all demo pages (after intro) indicating this is a training environment

### Demo banner (`components/DemoModeAlert.jsx`)
A fixed-position, full-width banner that appears above the VA.gov header on all demo pages (not the intro page):
- Uses React Portal to render at `document.body` level
- Gold background (`#ffbe2e`) from VA Design System
- WCAG compliant: `role="region"`, `aria-label`, sufficient color contrast
- Dynamically adds body padding when mounted to prevent header overlap
- Includes "Exit demo" link back to intro page

### Routing (`routes.jsx`)
Uses React Router v3 plain-object config:
- `path: '/'` — `App` wrapper (fragment, renders children)
- `indexRoute` — `IntroPage` (the demo acknowledgment page)
- `childRoutes`:
  - `'my-health'` — `LandingPageContainer` (the MHV landing page demo)
  - `'*'` — catch-all fallback to `IntroPage`
  - **Wildcard must always be last** (React Router v3 matches top-down)

### Fetch interception (`utils/mock-api.js`)
The app patches `window.fetch` before the platform bootstraps. API calls are intercepted and return static fixture data.

Routes marked with `requiresAcknowledgment: true` only return mock data **after** the user acknowledges the demo. This prevents showing logged-in state on the intro page.

| URL pattern | Fixture file | Requires acknowledgment |
|---|---|---|
| `/v0/user` | `fixtures/user.json` | Yes |
| `/v0/user/mhv_user_account` | `fixtures/account-status.json` | Yes |
| `/v0/feature_toggles` | `fixtures/feature-toggles.json` | No |
| `/v0/maintenance_windows` | inline `{ data: [] }` | No |
| `/my_health/v1/messaging/folders` | `fixtures/folders.json` | Yes |
| `/v0/profile/personal_information` | `fixtures/personal-information.json` | Yes |
| `/data/cms/vamc-ehr.json` | inline empty string | No |

**Order matters** in `mockRoutes` — more specific patterns (e.g., `/v0/user/mhv_user_account`) must come before less specific ones (`/v0/user`).

### Redux hydration (`app-entry.jsx`)
After acknowledgment, the app dispatches fixture data to Redux:
- `UPDATE_PROFILE_FIELDS` — populates user profile data
- `FETCH_TOGGLE_VALUES_SUCCEEDED` — populates feature toggles

**Note:** `UPDATE_LOGGEDIN_STATUS` is intentionally **not** dispatched, so the header shows "Sign in" rather than displaying a logged-in user. This prevents confusion during training demos.

### Session gate (`constants.js`, `containers/App.jsx`, `components/IntroPage.jsx`)
- `IntroPage` sets `sessionStorage.setItem('mhvDemoModeAcknowledged', timestamp)` on click
- `App` checks the timestamp and redirects if missing or expired (30 min timeout)
- Session refreshes on user activity (click, keydown, scroll)
- Clears automatically when the browser session ends

### Reducers (`reducers/index.js`)
Exports the `myHealth` combined reducer so the Redux store has the correct state shape (`state.myHealth.accountStatus`, etc.).

### Demo apps (`demo-apps/`)
Contains copies of MHV apps modified for demo use. Currently:
- **`mhv-landing-page/`** — Copy of the real MHV landing page with `RequiredLoginView` removed and `DemoModeAlert` added

## Fixture requirements

### Email confirmation
The `MhvAlertConfirmEmail` component checks `vet360_contact_information.email.confirmationDate`. To hide the "confirm your email" prompt, ensure dates are **after** `2025-03-01`:

```json
"vet360_contact_information": {
  "email": {
    "confirmationDate": "2025-04-01T12:00:00.000+00:00",
    "updatedAt": "2025-04-01T12:00:00.000+00:00",
    "emailAddress": "ginny.doe@example.com"
  }
}
```

**Note:** Use camelCase field names (`confirmationDate`, not `confirmation_date`).

## Key files

| File | Purpose |
|---|---|
| `app-entry.jsx` | Calls `setupMockApi()`, starts app, dispatches fixture data to Redux |
| `routes.jsx` | Plain-object route config with childRoutes |
| `containers/App.jsx` | Session gate wrapper with timeout logic |
| `components/IntroPage.jsx` | Demo intro/acknowledgment page |
| `components/DemoModeAlert.jsx` | Fixed-position demo banner (React Portal) |
| `constants.js` | Session storage key and timeout duration |
| `utils/mock-api.js` | Fetch interceptor with URL pattern matching |
| `fixtures/*.json` | Static API response data |
| `reducers/index.js` | Exports `myHealth` reducer from landing page |
| `demo-apps/mhv-landing-page/` | Modified copy of MHV landing page |

## URLs
- Intro: http://localhost:3001/mhv-demo-mode
- Landing page: http://localhost:3001/mhv-demo-mode/my-health

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
3. Import and render `DemoModeAlert` at the top of the container
4. Add its reducers to `reducers/index.js`
5. Add any new API endpoints to `utils/mock-api.js` with corresponding fixtures (set `requiresAcknowledgment: true` for user-specific data)
6. Add a child route in `routes.jsx` (before the `*` wildcard)
7. Add its entry to `registry.scaffold.json` if it needs its own HTML page
