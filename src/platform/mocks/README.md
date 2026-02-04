# Platform Mocks

Mock data and handlers for local development and testing.

## Structure

```
platform/mocks/
├── responses.js  # Pure mock data + factory functions (no dependencies)
├── browser.js    # MSW browser handlers (for local dev with setupWorker)
└── README.md
```

## Usage

### Mock Data (anywhere)

Import pure data for use with any mocking approach:

```javascript
import {
  mockUser,
  mockFeatureToggles,
  createUserResponse,
  createFeatureTogglesResponse,
} from 'platform/mocks/responses';

// Use with Cypress
cy.intercept('GET', '/v0/user', mockUser);

// Use with custom feature toggles
cy.intercept('GET', '/v0/feature_toggles*', createFeatureTogglesResponse({
  myFeature: true,
}));
```

### Browser Development (MSW)

For local development with MSW's service worker:

```javascript
import { setupWorker } from 'msw';
import { api, commonHandlers } from 'platform/mocks/browser';

// Use api.get/post for vets-api endpoints (auto-prefixes with API_URL)
const appHandlers = [
  api.get('/v0/my-data', (req, res, ctx) => res(ctx.json({ data: [] }))),
  api.post('/v0/submit', (req, res, ctx) => res(ctx.json({ success: true }))),
];

const worker = setupWorker(...appHandlers, ...commonHandlers);
worker.start();
```

See the full setup guide in [Browser Mocking](#browser-mocking) below.

### Unit Tests (msw-adapter)

For unit tests using the platform's msw-adapter:

```javascript
import { mockUser, createFeatureTogglesResponse } from 'platform/mocks/responses';
import { createGetHandler, jsonResponse } from 'platform/testing/unit/msw-adapter';

const handlers = [
  createGetHandler('/v0/user', () => jsonResponse(mockUser)),
  createGetHandler('/v0/feature_toggles*', () =>
    jsonResponse(createFeatureTogglesResponse({ myFeature: true }))
  ),
];
```

---

## Available Mock Data

### User / Authentication

| Export | Description |
|--------|-------------|
| `mockUser` | Authenticated user (LOA3, verified) |
| `mockUserUnauthenticated` | 401 error response |
| `createUserResponse(overrides)` | Factory with custom properties |

### Feature Toggles

| Export | Description |
|--------|-------------|
| `mockFeatureToggles` | Empty toggles (all disabled) |
| `createFeatureTogglesResponse(toggles)` | Factory with specific toggles |

### Maintenance Windows

| Export | Description |
|--------|-------------|
| `mockMaintenanceWindows` | Empty (no downtime) |
| `createMaintenanceWindowsResponse(windows)` | Factory with windows |

### VAMC EHR

| Export | Description |
|--------|-------------|
| `mockVamcEhr` | Empty facilities list |
| `createVamcEhrResponse(facilities)` | Factory with custom facilities |

---

## Browser Mocking

Full guide for setting up MSW browser mocking in your app.

### 1. Create your app's mock setup

**`src/applications/your-app/mocks/browser.js`:**

```javascript
import { rest, setupWorker } from 'msw';
import { api, apiUrl, commonHandlers } from 'platform/mocks/browser';

// App handlers for vets-api - use api.* (auto-prefixes with API_URL)
const myVetsApiHandlers = [
  api.get('/v0/my-endpoint', (req, res, ctx) => {
    return res(ctx.json({ data: 'mocked response' }));
  }),
  api.post('/v0/submit', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];

// Third-party handlers - use rest.* with explicit URLs
const thirdPartyHandlers = [
  rest.get('https://api.example.com/*', (req, res, ctx) => {
    return res(ctx.json({ external: true }));
  }),
];

// App handlers first, then platform common handlers
const handlers = [...myVetsApiHandlers, ...thirdPartyHandlers, ...commonHandlers];

const worker = setupWorker(...handlers);

export async function startMocking() {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
  console.log('[MSW] Mocking enabled');
}

export default startMocking;
```

### 2. Update your entry file

**`src/applications/your-app/your-app-entry.jsx`:**

```javascript
import 'platform/polyfills';
import startApp from 'platform/startup';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

function initApp() {
  startApp({
    url: manifest.rootUrl,
    reducer,
    routes,
    entryName: manifest.entryName,
  });
}

// Enable MSW mocking for local development
if (process.env.USE_MOCKS === 'true') {
  import('./mocks/browser')
    .then(({ startMocking }) => startMocking())
    .then(() => initApp())
    .catch(error => {
      console.error('Failed to load MSW mocks:', error);
      initApp();
    });
} else {
  initApp();
}
```

### 3. Run with mocks enabled

```bash
USE_MOCKS=true yarn watch --env entry=your-app --env api=http://localhost:3001
```

The `--env api=http://localhost:3001` flag makes API calls same-origin so MSW can intercept them.

---

## Browser Handlers Reference

Import from `platform/mocks/browser`:

### API Helper

| Export | Description |
|--------|-------------|
| `api` | REST helper that auto-prefixes with `environment.API_URL` |
| `apiUrl` | The base URL (`environment.API_URL`) for reference |

```javascript
import { api, apiUrl } from 'platform/mocks/browser';

// api.get/post/put/patch/delete auto-prefix with apiUrl
api.get('/v0/user', handler)  // → matches apiUrl + '/v0/user'
api.post('/v0/submit', handler)
```

### Pre-configured Handlers

| Handler | Endpoint | Description |
|---------|----------|-------------|
| `userHandler` | `GET /v0/user` | Authenticated user |
| `unauthenticatedUserHandler` | `GET /v0/user` | 401 error |
| `featureTogglesHandler` | `GET /v0/feature_toggles*` | Empty toggles |
| `maintenanceWindowsHandler` | `GET /v0/maintenance_windows` | No downtime |
| `vamcEhrProxyHandler` | `GET /data/cms/vamc-ehr.json` | Proxies to va.gov & caches |

### Handler Collections

| Export | Includes |
|--------|----------|
| `commonHandlers` | user, featureToggles, maintenanceWindows, vamcEhrProxy |
| `commonHandlersUnauthenticated` | Same but with 401 user |

### Factory Functions (optional)

If you need custom base URLs, use the factory functions:

```javascript
import { createCommonHandlers, createUserHandler } from 'platform/mocks/browser';

// Custom base URL (rarely needed)
const handlers = createCommonHandlers('http://custom-api.local');
```

### VAMC EHR Custom Handlers

```javascript
import { createVamcEhrHandler } from 'platform/mocks/browser';

// With your own fixture
import vamcData from './fixtures/vamc-ehr.json';
const handler = createVamcEhrHandler(undefined, vamcData);

// With simplified array
const handler = createVamcEhrHandler(undefined, [
  { id: 'vha_663', title: 'Seattle VA', system: 'vista' },
  { id: 'vha_687', title: 'Walla Walla VA', system: 'cerner' },
]);
```

---

## Troubleshooting

### mockServiceWorker.js not found

The service worker is copied during build. If missing:

```bash
cp node_modules/msw/lib/mockServiceWorker.js build/localhost/
```

### Requests not intercepted

1. Check DevTools > Application > Service Workers
2. Ensure `USE_MOCKS=true` is set
3. Use `--env api=http://mock-vets-api.local` for proper domain
4. Look for `[MSW] Mocking enabled` in console
