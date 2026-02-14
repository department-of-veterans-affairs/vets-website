# CLAUDE.md — AI Assistant Guide for vets-website

This document describes the VA.gov frontend monorepo (`vets-website`) for AI assistants working in the codebase.

## Project Overview

This is the frontend repository for **VA.gov**, the U.S. Department of Veterans Affairs website. It contains 95+ React applications that serve veterans, their families, and caregivers. The codebase is a Yarn workspaces monorepo using React 17, Redux, and Webpack 5.

**Node version:** 22.22.0 (see `.nvmrc`)
**Package manager:** Yarn 1.x (not v2/v3)

## Repository Structure

```
vets-website/
├── src/
│   ├── applications/       # 95+ independent VA.gov applications
│   ├── platform/           # Shared platform code, utilities, and components
│   └── site/               # Site-wide static assets (JS, fonts, images)
├── config/                 # Webpack, Cypress, Mocha, and build configuration
├── script/                 # Build scripts, test runners, CI utilities
├── jenkins/                # Jenkins CI pipeline configuration
├── docs/                   # Internal documentation (Node upgrade, testing)
├── api/                    # API mock and landing page configs
├── patches/                # Yarn patch-package dependency patches
└── .github/                # GitHub Actions workflows and reusable actions
```

### Application Structure

Each application lives in `src/applications/<app-name>/` and follows this pattern:

```
src/applications/<app-name>/
├── manifest.json           # Required: app metadata (entryName, rootUrl, productId)
├── app-entry.jsx           # Entry point that initializes the app
├── routes.jsx              # React Router route definitions
├── components/             # React components
├── containers/             # Redux-connected container components
├── reducers/               # Redux reducers
├── actions/                # Redux action creators
├── selectors/              # Redux selectors
├── utils/                  # Utility functions
├── hooks/                  # Custom React hooks
├── config/                 # App-specific configuration (form config, etc.)
├── definitions/            # Form schema definitions (JSON Schema)
├── sass/                   # SCSS stylesheets
├── locales/                # i18n translation files (if applicable)
└── tests/
    ├── unit/               # Unit tests (*.unit.spec.jsx)
    ├── e2e/                # Cypress E2E tests (*.cypress.spec.js)
    └── fixtures/           # Test data and mocks
```

**manifest.json** is required for every app and must contain:
```json
{
  "appName": "Human-readable name",
  "entryFile": "./app-entry.jsx",
  "entryName": "kebab-case-id",
  "rootUrl": "/url/path",
  "productId": "uuid"
}
```

### Platform Directory (`src/platform/`)

Shared cross-application code organized by concern:

| Module | Purpose |
|--------|---------|
| `startup/` | App initialization (Redux store, routing, component mounting) |
| `forms/` | Form components, definitions, save-in-progress |
| `forms-system/` | VA Forms System (react-jsonschema-form based) |
| `form-renderer/` | Form rendering engine |
| `site-wide/` | Header, footer, mega-menu, alerts, banners, feature toggles |
| `user/` | Authentication, authorization, user profile |
| `utilities/` | API helpers, date utils, feature toggles, SSO, storage, accessibility |
| `monitoring/` | Datadog integration, downtime notifications |
| `mhv/` | My HealtheVet integration |
| `testing/` | Unit test helpers, Cypress setup, mock API |
| `mocks/` | Mock API responses (MSW-based) |
| `pdf/` | PDF generation utilities |
| `shared/` | Intent to File, calendar utilities |
| `static-data/` | Static data components |
| `polyfills/` | Browser polyfills |
| `landing-pages/` | Landing page templates |

## Essential Commands

### Development

```sh
yarn install-safe            # Install dependencies (safe mode, runs postinstall)
yarn watch                   # Start webpack dev server on port 3001
yarn watch --env entry=hca   # Watch specific app(s) only
yarn build                   # Build all applications
yarn build --entry=hca       # Build specific app(s)
```

### Testing

```sh
# Unit tests (Mocha + Chai)
yarn test:unit                                    # Run all unit tests
yarn test:unit src/applications/hca/tests/unit/   # Run tests in a directory
yarn test:unit --app-folder hca                   # Run all tests for an app
yarn test:unit path/to/file.unit.spec.jsx         # Run a single test file
yarn test:watch                                   # Watch mode
yarn test:coverage                                # With coverage report

# E2E tests (Cypress) — requires yarn watch running on port 3001
yarn cy:open                 # Open interactive Cypress runner
yarn cy:run                  # Run headless
yarn cy:run --spec "path/to/test.cypress.spec.js"  # Run specific test
```

### Linting

```sh
yarn lint                    # Run ESLint + Stylelint
yarn lint:js                 # JavaScript only
yarn lint:sass               # SCSS only
yarn lint:js:changed:fix     # Auto-fix changed JS files
```

### Utilities

```sh
yarn new:app                 # Generate a new application (Yeoman)
yarn check-app-imports       # Check for cross-app import violations
yarn mock-api --responses path/to/responses.js  # Start mock API server
yarn reset:env               # Reset local environment
```

## Code Conventions

### File Naming

- **Components:** PascalCase (`MyComponent.jsx`)
- **Utilities/helpers:** camelCase (`formatDate.js`)
- **Unit tests:** `*.unit.spec.jsx` (must be `.jsx`, not `.js` — enforced by ESLint)
- **E2E tests:** `*.cypress.spec.js`
- **Stylesheets:** kebab-case (`my-component.scss`)

### JavaScript Style

- **ESLint config:** `.eslintrc.js` extending `@department-of-veterans-affairs/recommended` (Airbnb-based)
- **Prettier:** 80 char width, 2-space indent, single quotes, trailing commas, semicolons
- **camelCase** enforced for all properties (`camelcase: [2, { properties: 'always' }]`)
- **No `moment.js`** in new code — use `date-fns` instead (enforced via `you-dont-need-momentjs` ESLint plugin)
- **No cross-app imports** — applications must not import from other applications (`@department-of-veterans-affairs/no-cross-app-imports` rule)
- Prefer `++` only in for-loop afterthoughts (`no-plusplus: ['error', { allowForLoopAfterthoughts: true }]`)

### SCSS Style

- **Stylelint config:** `.stylelintrc.json`
- No hex colors — use CSS variables/design tokens
- No `@extend` — use mixins or utility classes
- Double quotes for strings in SCSS
- Variable/mixin naming: `^[a-z]+([a-z0-9-]+[a-z0-9]+)?$`

### Import Aliases

Babel module-resolver provides these key aliases (defined in `babel.config.json`):

| Alias | Maps to |
|-------|---------|
| `~` | `./src` |
| `@@vap-svc` | `./src/platform/user/profile/vap-svc` |
| `@@profile` | `./src/applications/personalization/profile` |
| `@department-of-veterans-affairs/platform-utilities/*` | Various `./src/platform/utilities/` modules |
| `@department-of-veterans-affairs/platform-startup/*` | `./src/platform/startup/` modules |
| `@department-of-veterans-affairs/platform-forms-system/*` | `./src/platform/forms-system/` modules |
| `@department-of-veterans-affairs/platform-site-wide/*` | `./src/platform/site-wide/` modules |
| `@department-of-veterans-affairs/platform-user/*` | `./src/platform/user/` modules |
| `@department-of-veterans-affairs/platform-monitoring/*` | `./src/platform/monitoring/` modules |
| `@department-of-veterans-affairs/platform-mhv/*` | `./src/platform/mhv/` modules |
| `@department-of-veterans-affairs/platform-testing/*` | `./src/platform/testing/` modules |

See `babel.config.json` for the full list of aliases.

### Component Library

Use VA Design System web components (prefixed with `va-`):
- `<va-modal>` instead of `@department-of-veterans-affairs/component-library/Modal` (the JS import is deprecated)
- Component library: `@department-of-veterans-affairs/component-library`
- CSS library: `@department-of-veterans-affairs/css-library`

### Accessibility Requirements

Accessibility is a first-class concern throughout the codebase:
- ESLint `jsx-a11y` rules are enforced (aria-role is an error, others are warnings)
- Cypress E2E tests should include `cy.axeCheck()` accessibility checks (enforced by `axe-check-required` ESLint rule)
- Use ARIA labels, keyboard navigation support, and proper focus management
- Platform utilities in `src/platform/utilities/accessibility/` provide helpers for keyboard events and focus management

### Global Variables

These webpack-defined globals are available in application code:
- `__BUILDTYPE__` — Current build type (localhost, vagovdev, vagovstaging, vagovprod)
- `__API__` — API base URL
- `__MEGAMENU_CONFIG__` — Mega menu configuration
- `__REGISTRY__` — Application registry

## Architecture Patterns

### State Management

- **Redux** with `redux-thunk` middleware
- Common reducers are registered site-wide (user, featureToggles, navigation, etc.)
- App-specific reducers are injected via the startup system
- Use Redux Toolkit (`@reduxjs/toolkit`) for new code where appropriate
- Selectors pattern with `reselect` for computed state

### Forms System

Many applications use the VA Forms System (built on react-jsonschema-form):
- Form config defines chapters, pages, and fields using JSON Schema
- UI schema (`uiSchema`) customizes rendering and validation
- Save-in-progress support lets users resume forms later
- Prefill from user profile data
- Located in `src/platform/forms-system/`

### API Integration

- Use `apiRequest()` from `@department-of-veterans-affairs/platform-utilities/api`
- Automatically handles CSRF tokens, session management, and error tracking
- Sends `X-Key-Inflection: camel` header for camelCase response keys
- For local development, use MSW (Mock Service Worker) — see `src/platform/mocks/`

### Routing

- React Router v3 (with compatibility layers for v5)
- Each application defines its own routes in `routes.jsx`
- The forms system generates routes from form config chapters/pages

### Feature Toggles

- Feature flags managed via `src/platform/utilities/feature-toggles/`
- Toggle names defined in `featureFlagNames.js`
- Use the `useFeatureToggle` hook or connect to the `featureToggles` Redux state

## Testing Patterns

### Unit Tests

- **Framework:** Mocha + Chai + Sinon
- **Component testing:** React Testing Library (preferred for new tests) or Enzyme
- **File pattern:** `*.unit.spec.jsx` (JSX extension is required)
- Test utilities available in `src/platform/testing/unit/`
- Form testing utilities in `src/platform/testing/unit/schemaform-utils.jsx`

### E2E Tests

- **Framework:** Cypress v13
- **File pattern:** `*.cypress.spec.js`
- **Viewport:** 1920x1080 by default, with configurable mobile/tablet sizes
- Must include accessibility checks via `cy.axeCheck()`
- Mock APIs using Cypress intercepts; do not run `vets-api` during E2E tests
- Cypress config: `config/cypress.config.js`

### Mock API for Testing

- **MSW (recommended):** Browser-level request interception, no separate server
  ```sh
  USE_MOCKS=true yarn watch --env entry=your-app --env api=http://mock-vets-api.local
  ```
- **mocker-api (legacy):** Separate Node server process
  ```sh
  yarn mock-api --responses path/to/responses.js
  ```

## Vercel Preview Deployments

The repo includes a Vercel deployment setup for preview/review environments with a built-in mock API.

### How It Works

- **`vercel.json`** configures the build, output directory, and URL rewrites
- **`script/vercel-build.sh`** builds only `static-pages`, `facilities`, and `hca` apps with the Vercel deployment URL as the API base
- **`api/mock.js`** is a Vercel serverless function that serves mock VA API responses
- **`api/landing.js`** renders a landing page with links to the deployed apps and a mock session toggle

### Mock API Routes (`api/mock.js`)

The serverless function handles these endpoints:

| Method | Path | Response |
|--------|------|----------|
| GET | `/v0/user` | Mock authenticated LOA3 user |
| GET | `/v0/feature_toggles` | Empty feature toggles |
| GET | `/v0/maintenance_windows` | Empty maintenance windows |
| GET | `/csrf_token` | Mock CSRF token |
| GET | `/v0/in_progress_forms/1010ez` | Prefilled HCA form data |
| PUT | `/v0/in_progress_forms/1010ez` | Save-in-progress response |
| GET | `/v0/health_care_applications/rating_info` | Disability rating |
| POST | `/v0/health_care_applications/enrollment_status` | Enrollment status |
| POST | `/v0/health_care_applications` | Form submission response |
| POST | `/facilities_api/v2/va` | Facility search results |
| POST | `/facilities_api/v2/ccp/*` | Community care provider results |
| GET | `/facilities_api/v2/ccp/specialties` | Provider specialties |
| GET | `/facilities_api/v2/va/:id` | Single facility detail |

### URL Rewrite Pattern

Vercel rewrites route API paths to the serverless function:
- `/v0/*` and `/facilities_api/*` and `/data/*` and `/csrf_token` are all rewritten to `/api/mock?__original_path=<original-path>`
- App paths like `/find-locations/*` and `/health-care/apply-for-health-care-form-10-10ez/*` are rewritten to their respective `index.html` for SPA routing

### Adding New Mock Routes

To add a new mock endpoint, edit `api/mock.js`:
1. Add mock response data as a const at the top of the file
2. Add a route entry in the `routes` object inside `matchRoute()`
3. If the route has path parameters, add prefix matching logic below the exact-match block
4. Add a rewrite rule in `vercel.json` if the path prefix isn't already covered

## CI/CD

- **GitHub Actions** handles most CI/CD (`.github/workflows/`)
- Key pipelines: `pull-request.yml`, `continuous-integration.yml`, `continuous-deploy-production.yml`
- PRs run: cross-app import checks, linting, unit tests, E2E tests, security scanning
- Jenkins used for some legacy pipelines (`jenkins/common.groovy`)

## Git Hooks

- **Husky** manages pre-commit and pre-push hooks
- **Pre-commit:** Runs `lint-staged` (ESLint fix + Stylelint fix on staged files), regenerates manifest and web component pattern catalogs if relevant files changed
- **Pre-push:** Validates commits exist on branch before push
- **lint-staged config:** JS/JSX files get ESLint auto-fix; SCSS files get Stylelint auto-fix

## Key Dependencies

| Library | Version | Notes |
|---------|---------|-------|
| React | 17.0.2 | Not React 18 |
| Redux | 4.1.1 | With redux-thunk |
| React Router | 3.x / 5.x compat | Legacy v3 with v5 compatibility layer |
| Webpack | 5.91.0 | With extensive plugin configuration |
| Babel | 7.26+ | With 15+ plugins and module-resolver aliases |
| Cypress | 13.15+ | E2E testing |
| Mocha | 10.7.3 | Unit test runner |
| Chai | 4.3.4 | Assertion library |
| Sinon | 3.2.1 / 20.0.0 | Mocking (legacy and newer versions coexist) |
| date-fns | 2.24.0 | Preferred date library (replacing moment.js) |
| Lodash | 4.17.21 | Utility library |
| Sentry | 6.13.2 | Error tracking |
| Mapbox GL | 1.12.0 / 3.9.4 | Maps (requires API key in `.env`) |

## Common Pitfalls

- **Unit test files must use `.jsx` extension:** `*.unit.spec.jsx`, not `*.unit.spec.js`. This is enforced by ESLint and will fail CI.
- **No cross-app imports:** Applications must not import from `src/applications/<other-app>/`. Use platform modules for shared code.
- **Don't use `moment.js`** in new code. Use `date-fns` instead.
- **Cypress tests need `yarn watch` running** on port 3001 before execution. Do not run `vets-api` simultaneously.
- **Node 22 compatibility:** Some tests behave differently under Node 22 (uses happy-dom instead of jsdom in some CI configurations). See `docs/node-22-testing-guidelines.md`.
- **`yarn install --ignore-scripts`:** The project disables lifecycle scripts by default for security. Use `yarn install-safe` to properly install.
- **Import aliases are required:** Use the `@department-of-veterans-affairs/platform-*` aliases or `~` prefix for cross-module imports rather than relative paths to platform code.
- **Deprecated component imports:** Use VA Design System web components (`<va-modal>`, `<va-text-input>`, etc.) instead of importing from the old component library directly.
