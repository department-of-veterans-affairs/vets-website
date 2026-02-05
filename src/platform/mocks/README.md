# Platform Mocks

Mock data and handlers for local development and testing.

## Quick Start

**1. Create `src/applications/your-app/mocks/browser.js`:**

```javascript
import { setupWorker } from 'msw';
import { mockApi, delay, commonHandlers } from 'platform/mocks/browser';

const handlers = [
  mockApi.get('/v0/my-endpoint', (req, res, ctx) => res(delay(ctx), ctx.json({ data: [] }))),
  ...commonHandlers,
];

export async function startMocking() {
  await setupWorker(...handlers).start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}
```

**2. Update your entry file:**

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

if (process.env.USE_MOCKS === 'true') {
  import('./mocks/browser')
    .then(({ startMocking }) => startMocking())
    .then(initApp);
} else {
  initApp();
}
```

**3. Run:**

```bash
USE_MOCKS=true yarn watch --env entry=your-app --env api=http://mock-vets-api.local
```

---

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
import { mockApi, delay, commonHandlers } from 'platform/mocks/browser';

// Use mockApi.get/post for vets-api endpoints (auto-prefixes with API_URL)
// Use delay(ctx) to add realistic network latency (default 500ms)
const appHandlers = [
  mockApi.get('/v0/my-data', (req, res, ctx) => res(delay(ctx), ctx.json({ data: [] }))),
  mockApi.post('/v0/submit', (req, res, ctx) => res(delay(ctx), ctx.json({ success: true }))),
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

## Response Delays

All handlers include a default 500ms delay to simulate realistic network latency. You can customize or disable delays:

### Using the `delay` helper in custom handlers

```javascript
import { mockApi, delay, DEFAULT_DELAY } from 'platform/mocks/browser';

// Default delay (500ms)
mockApi.get('/v0/data', (req, res, ctx) =>
  res(delay(ctx), ctx.json({ data: [] }))
)

// Custom delay (2 seconds for slow endpoints)
mockApi.get('/v0/slow-endpoint', (req, res, ctx) =>
  res(delay(ctx, 2000), ctx.json({ data: [] }))
)

// No delay (instant response)
mockApi.get('/v0/fast-endpoint', (req, res, ctx) =>
  res(delay(ctx, 0), ctx.json({ data: [] }))
)
```

### Configuring delay for common handlers

```javascript
import { createCommonHandlers, apiUrl } from 'platform/mocks/browser';

// Default delay (500ms)
const handlers = createCommonHandlers();

// Custom delay (1 second)
const slowHandlers = createCommonHandlers(apiUrl, 1000);

// No delay (instant responses)
const fastHandlers = createCommonHandlers(apiUrl, 0);
```

---

## Available Mock Data

### User / Authentication

| Export | Description |
|--------|-------------|
| `mockUser` | Authenticated user (LOA3, verified) |
| `mockUserLOA1` | Authenticated but unverified user (LOA1) |
| `mockUserUnauthenticated` | 401 error response |
| `createUserResponse(overrides)` | Factory with deep merge (see below) |

#### Deep Merge for User Overrides

`createUserResponse()` uses deep merge, so you only need to specify the fields you want to change. Nested properties are preserved:

```javascript
// Only override signIn.serviceName - other signIn props (ssoe, transactionid) are preserved
createUserResponse({
  data: { attributes: { profile: { signIn: { serviceName: 'logingov' } } } }
})

// Override multiple nested fields
createUserResponse({
  data: {
    attributes: {
      profile: { firstName: 'Jane', loa: { current: 1 } },
      veteranStatus: { isVeteran: false }
    }
  }
})
```

**Note:** Arrays are replaced, not merged by index:

```javascript
// This replaces the entire services array
createUserResponse({
  data: { attributes: { services: ['my-custom-service'] } }
})
```

### Feature Toggles

| Export | Description |
|--------|-------------|
| `mockFeatureToggles` | Empty toggles (all disabled) |
| `createFeatureTogglesResponse(toggles)` | Factory with specific toggles |

To find available feature flag names, see [`src/platform/utilities/feature-toggles/featureFlagNames.json`](../../utilities/feature-toggles/featureFlagNames.json).

```javascript
// Enable specific flags for your app
createFeatureTogglesResponse({
  my_app_feature_flag: true,
  another_flag: false,
})
```

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
import { setupWorker } from 'msw';
import { mockApi, rest, apiUrl, delay, commonHandlers } from 'platform/mocks/browser';

// App handlers for vets-api - use mockApi.* (auto-prefixes with API_URL)
// Use delay(ctx) for realistic network latency (default 500ms)
const myVetsApiHandlers = [
  mockApi.get('/v0/my-endpoint', (req, res, ctx) => {
    return res(delay(ctx), ctx.json({ data: 'mocked response' }));
  }),
  mockApi.post('/v0/submit', (req, res, ctx) => {
    return res(delay(ctx), ctx.json({ success: true }));
  }),
  // Custom delay for slow endpoints
  mockApi.get('/v0/slow-endpoint', (req, res, ctx) => {
    return res(delay(ctx, 2000), ctx.json({ data: 'slow response' }));
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
USE_MOCKS=true yarn watch --env entry=your-app --env api=http://mock-vets-api.local
```

The `--env api=http://mock-vets-api.local` sets a mock domain that MSW intercepts - no real server needed.

---

## Browser Handlers Reference

Import from `platform/mocks/browser`:

### API Helper

| Export | Description |
|--------|-------------|
| `mockApi` | REST helper that auto-prefixes with `environment.API_URL` |
| `rest` | Re-exported from MSW for third-party handlers |
| `apiUrl` | The base URL (`environment.API_URL`) for reference |
| `delay` | Helper function to add response delay (default 500ms) |
| `DEFAULT_DELAY` | Default delay value in milliseconds (500) |

```javascript
import { mockApi, rest, apiUrl, delay, DEFAULT_DELAY } from 'platform/mocks/browser';

// mockApi.get/post/put/patch/delete auto-prefix with apiUrl
mockApi.get('/v0/user', handler)  // → matches apiUrl + '/v0/user'
mockApi.post('/v0/submit', handler)

// rest.* for third-party APIs with explicit URLs
rest.get('https://api.mapbox.com/*', handler)

// Add delay to responses (default 500ms)
mockApi.get('/v0/data', (req, res, ctx) =>
  res(delay(ctx), ctx.json({ data: [] }))
)

// Custom delay (2 seconds)
mockApi.get('/v0/slow', (req, res, ctx) =>
  res(delay(ctx, 2000), ctx.json({ data: [] }))
)

// No delay
mockApi.get('/v0/fast', (req, res, ctx) =>
  res(delay(ctx, 0), ctx.json({ data: [] }))
)
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
const handler = createVamcEhrHandler(vamcData);

// With simplified array
const handler = createVamcEhrHandler([
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
