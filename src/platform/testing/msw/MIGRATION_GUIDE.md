# MSW Migration Guide

This guide walks through migrating from the current three-mock setup to unified MSW.

## Current State

We currently have three separate mock systems:

1. **mocker-api** - Local development (`mocks/api/index.js`)
2. **mockFetch** - Unit tests (`platform-testing/helpers`)
3. **cy.intercept** - Cypress E2E tests

## Target State

Unified on **MSW** (Mock Service Worker) for all three contexts:

- **Local Dev**: MSW browser worker (replaces mocker-api)
- **Unit Tests**: MSW Node server (replaces mockFetch)
- **Cypress**: MSW browser worker + cy.intercept for network assertions only

## Why MSW?

1. **Single source of truth** - One set of handlers shared everywhere
2. **Network-level mocking** - Intercepts at fetch/XHR, not function level
3. **Realistic** - Matches real network behavior (timing, headers, etc.)
4. **Developer experience** - See mocked requests in browser DevTools
5. **Type-safe** - Enforces request/response contracts
6. **Scenario reuse** - Pre-built states (logged in, empty, error) work everywhere

## Migration Strategy

### Phase 1: Set Up MSW Infrastructure ✅ (POC Complete)

- [x] Create `src/platform/testing/msw/` directory structure
- [x] Create handlers for common endpoints (user, feature-toggles, medications)
- [x] Create reusable scenarios
- [x] Set up MSW server for unit tests
- [x] Set up MSW browser worker for Cypress/dev
- [x] Add Cypress commands (cy.startMsw, cy.loadMswScenario)

### Phase 2: Migrate mhv-medications (POC) ✅

- [x] Create medication handlers from mocker-api routes
- [x] Create medication scenarios (withActiveRx, empty, error, etc.)
- [x] Create POC Cypress tests using MSW
- [x] Create POC unit tests using MSW
- [x] Create MSW-based test helper (MedicationsSiteMSW)
- [x] Document side-by-side comparison

### Phase 3: Expand to Other Apps (Next Steps)

1. **Identify apps** - List all apps using mocker-api, mockFetch, cy.intercept
2. **Extract handlers** - Convert mocker-api routes to MSW handlers per app
3. **Create scenarios** - Build common scenarios for each app
4. **Migrate tests** - Update Cypress and unit tests app-by-app
5. **Update dev setup** - Replace mocker-api with MSW worker

### Phase 4: Remove Old Systems

1. Add deprecation warnings to mockFetch
2. Create ESLint rule discouraging new cy.intercept for data stubbing
3. Remove mocker-api dependency after all apps migrate
4. Remove mockFetch helper after all tests migrate
5. Update documentation

## Migration Patterns

### Pattern 1: mocker-api → MSW Handler

**Before (mocker-api):**
```javascript
// mocks/api/index.js
const responses = {
  'GET /my_health/v1/prescriptions': (req, res) => {
    res.json({ data: [...] });
  },
};
```

**After (MSW):**
```javascript
// msw/handlers/medications/prescriptions.js
import { rest } from 'msw';

export const prescriptionsHandler = (options = {}) => {
  return rest.get('/my_health/v1/prescriptions', (req, res, ctx) => {
    return res(
      ctx.delay(options.delay ?? 500),
      ctx.json({ data: [...] }),
    );
  });
};
```

### Pattern 2: mockFetch → MSW Server

**Before (mockFetch):**
```javascript
import { mockFetch, resetFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

describe('My Component', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch.onFirstCall(), { data: [] });
  });

  afterEach(() => {
    resetFetch();
  });
});
```

**After (MSW):**
```javascript
import { server } from '@department-of-veterans-affairs/platform-testing/msw/server';
import { rest } from 'msw';

describe('My Component', () => {
  // server.listen(), afterEach(), server.close() are in server.js
  
  it('does something', () => {
    // Override if needed
    server.use(
      rest.get('/my_health/v1/prescriptions', (req, res, ctx) => {
        return res(ctx.json({ data: [] }));
      }),
    );
  });
});
```

### Pattern 3: cy.intercept → MSW + Spy

**Before (cy.intercept for stubbing):**
```javascript
describe('My Test', () => {
  it('loads data', () => {
    cy.intercept('GET', '/my_health/v1/prescriptions', {
      fixture: 'prescriptions.json',
    }).as('prescriptions');
    
    cy.visit('/my-health/medications');
    cy.wait('@prescriptions');
  });
});
```

**After (MSW for stubbing):**
```javascript
import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';

describe('My Test', () => {
  beforeEach(() => {
    cy.startMsw();
    cy.login();
  });

  it('loads data', () => {
    cy.loadMswScenario(scenarios.medications.withActiveRx());
    cy.visit('/my-health/medications');
    cy.get('[data-testid="rx-card"]').should('exist');
  });
});
```

**cy.intercept for assertions only:**
```javascript
it('verifies API was called', () => {
  cy.loadMswScenario(scenarios.medications.withActiveRx());
  
  // Use cy.intercept as SPY
  cy.intercept('GET', '/my_health/v1/prescriptions*').as('prescriptions');
  
  cy.visit('/my-health/medications');
  
  cy.wait('@prescriptions').then(interception => {
    expect(interception.response.statusCode).to.equal(200);
    expect(interception.request.headers['authorization']).to.exist;
  });
});
```

## When to Keep cy.intercept

**Retain cy.intercept for:**

1. **Network-level assertions** (spy pattern)
   - Verifying request was made
   - Asserting headers, query params
   - Counting requests
   - Checking request timing

2. **Transport-layer simulation**
   - True network errors (DNS fail, connection reset)
   - Throttling/latency edge cases
   - Upload/download progress events
   - Binary/streaming responses
   - Socket-level errors

**Example - Spy pattern:**
```javascript
it('sends auth header', () => {
  cy.loadMswScenario(scenarios.medications.withActiveRx());
  
  cy.intercept('GET', '/my_health/v1/prescriptions*').as('rx');
  cy.visit('/my-health/medications');
  
  cy.wait('@rx').its('request.headers.authorization').should('match', /Bearer/);
});
```

**Example - Network error:**
```javascript
it('handles network error', () => {
  cy.intercept('GET', '/my_health/v1/prescriptions*', {
    forceNetworkError: true,
  });
  
  cy.visit('/my-health/medications');
  cy.contains('network error', { matchCase: false }).should('be.visible');
});
```

## Creating New Handlers

### Step 1: Analyze Existing Route

Look at existing mocker-api route:
```javascript
'GET /my_health/v1/prescriptions/:id': (req, res) => {
  const { id } = req.params;
  const data = { ... };
  res.json(data);
}
```

### Step 2: Create MSW Handler

```javascript
// msw/handlers/medications/prescriptions.js
export const prescriptionDetailsHandler = (options = {}) => {
  return rest.get('/my_health/v1/prescriptions/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    // Use createPrescription helper or custom logic
    const prescription = createPrescription(parseInt(id, 10), options);
    
    return res(
      ctx.delay(options.delay ?? 500),
      ctx.json({ data: prescription }),
    );
  });
};
```

### Step 3: Create Scenario

```javascript
// msw/scenarios/medications.js
export const medications = {
  singlePrescription: (attrs = {}) => [
    prescriptionDetailsHandler(attrs),
  ],
};
```

### Step 4: Export in index.js

```javascript
// msw/handlers/index.js
export * from './medications/prescriptions';

// Add to defaultHandlers
export const defaultHandlers = [
  // ... other handlers
  prescriptionDetailsHandler(),
];
```

## Testing Your Migration

### Unit Test

```bash
yarn test:unit src/applications/mhv-medications/tests/components/PrescriptionsList.msw-poc.unit.spec.jsx
```

### Cypress Test

```bash
# Start dev server
yarn watch --env entry=medications

# In another terminal
yarn cy:run --spec "src/applications/mhv-medications/tests/e2e/medications-msw-poc.cypress.spec.js"
```

### Local Dev

```javascript
// In app-entry.jsx
if (environment.isLocalhost()) {
  import('@department-of-veterans-affairs/platform-testing/msw/browser').then(
    ({ worker }) => {
      worker.start({
        onUnhandledRequest: 'warn',
      });
    },
  );
}
```

## Common Issues

### Issue: MSW not intercepting requests

**Solution:** Make sure MSW worker is started before the app makes requests.

```javascript
// Cypress
cy.startMsw();
cy.visit('/app'); // MSW is ready

// Unit tests
beforeAll(() => server.listen());
```

### Issue: cy.intercept overriding MSW

**Solution:** Don't provide response body in cy.intercept, use it as spy only.

```javascript
// ❌ Wrong - overrides MSW
cy.intercept('GET', '/api/data', { body: {...} });

// ✅ Right - spies without stubbing
cy.intercept('GET', '/api/data').as('data');
```

### Issue: Handlers not resetting between tests

**Solution:** Call resetHandlers in afterEach.

```javascript
// Unit tests - already in server.js
afterEach(() => server.resetHandlers());

// Cypress
afterEach(() => cy.resetMsw());
```

### Issue: Can't see MSW requests in DevTools

**Solution:** Set quiet: false in worker.start().

```javascript
worker.start({ quiet: false });
```

## Next Steps

1. **Review POC** - Run the medications POC tests
2. **Plan rollout** - Identify high-value apps to migrate first
3. **Create handlers** - Extract mocker-api routes to MSW handlers
4. **Train team** - Share this guide and run workshop
5. **Migrate incrementally** - One app at a time, one test at a time
6. **Monitor** - Track adoption, identify pain points
7. **Clean up** - Remove old systems after full migration

## Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW Recipes](https://mswjs.io/docs/recipes)
- POC Files:
  - `src/platform/testing/msw/`
  - `src/applications/mhv-medications/tests/e2e/medications-msw-poc.cypress.spec.js`
  - `src/applications/mhv-medications/tests/components/PrescriptionsList.msw-poc.unit.spec.jsx`
  - `src/applications/mhv-medications/tests/e2e/medications-comparison.cypress.spec.js`

## Questions?

Reach out to the platform team or open a discussion in #vfs-platform-support.
