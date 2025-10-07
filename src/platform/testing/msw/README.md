# MSW Unified Mock Layer

This directory contains shared MSW handlers used across unit tests, Cypress tests, and local development.

## Structure

```
msw/
├── handlers/
│   ├── medications/          # MHV Medications API handlers
│   ├── user/                 # User profile & auth handlers
│   ├── feature-toggles/      # Feature toggle handlers
│   └── index.js              # Exports all handlers
├── scenarios/
│   ├── medications.js        # Pre-configured medication scenarios
│   ├── user.js               # User state scenarios
│   └── index.js              # Exports all scenarios
├── browser.js                # MSW browser worker for dev & Cypress
├── server.js                 # MSW server for Node unit tests
└── README.md
```

## Usage

### Unit Tests (existing pattern - no change)

```javascript
import { server } from '@department-of-veterans-affairs/platform-testing/msw/server';
import { rest } from 'msw';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Override for specific test
server.use(
  rest.get('/my_health/v1/prescriptions', (req, res, ctx) => {
    return res(ctx.json({ data: [] }));
  }),
);
```

### Cypress Tests (new pattern)

```javascript
import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';

describe('My Test', () => {
  beforeEach(() => {
    cy.login();
    cy.loadMswScenario(scenarios.medications.withActiveRx());
  });

  it('displays medications', () => {
    cy.visit('/my-health/medications');
    // assertions...
  });
});
```

### Local Development (replaces mocker-api)

MSW worker is automatically started in `app-entry.jsx` when in dev mode:

```javascript
if (environment.isLocalhost()) {
  import('@department-of-veterans-affairs/platform-testing/msw/browser').then(
    ({ worker }) => worker.start(),
  );
}
```

## Scenarios

Scenarios are reusable combinations of handlers that represent common application states:

```javascript
// medications.js
export const medications = {
  withActiveRx: () => [
    prescriptionsHandler({ status: 'active', count: 5 }),
    refillableHandler({ count: 3 }),
  ],
  
  empty: () => [
    prescriptionsHandler({ data: [] }),
  ],
  
  withErrors: () => [
    prescriptionsErrorHandler(500),
  ],
};
```

## Migration Guide

### From mocker-api (local dev)

Before:
```javascript
// mocks/api/index.js
'GET /my_health/v1/prescriptions': (req, res) => {
  res.json({ data: [...] });
}
```

After:
```javascript
// msw/handlers/medications/prescriptions.js
export const prescriptionsHandler = rest.get(
  '/my_health/v1/prescriptions',
  (req, res, ctx) => {
    return res(ctx.json({ data: [...] }));
  },
);
```

### From cy.intercept (Cypress)

Before:
```javascript
cy.intercept('GET', '/my_health/v1/prescriptions', prescriptions).as('rx');
```

After:
```javascript
cy.loadMswScenario(scenarios.medications.withActiveRx());
```

Retain cy.intercept only for:
- Network-level assertions (spying)
- Testing network errors at socket level
- Throttling/latency testing

### From mockFetch (unit tests)

Before:
```javascript
mockFetch();
setFetchJSONResponse(global.fetch.onFirstCall(), { data: [] });
```

After:
```javascript
// MSW server is already set up, just override if needed
server.use(
  rest.get('/my_health/v1/prescriptions', (req, res, ctx) => {
    return res(ctx.json({ data: [] }));
  }),
);
```

## Benefits

1. **Single source of truth**: One set of mock data for all contexts
2. **Scenario reuse**: Share common states across unit & e2e tests
3. **Type safety**: Handlers validate request/response shapes
4. **Network realism**: MSW intercepts at fetch/xhr level
5. **Easier debugging**: See all mock requests in browser DevTools
