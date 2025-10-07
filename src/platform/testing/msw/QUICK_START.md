# MSW Quick Start Guide

Get started with MSW in 5 minutes.

## For Cypress Tests

### 1. Import scenarios

```javascript
import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';
```

### 2. Start MSW and load scenario

```javascript
describe('My Test', () => {
  beforeEach(() => {
    cy.startMsw();
    cy.login();
    cy.loadMswScenario([
      ...scenarios.medications.withActiveRx({ count: 5 }),
    ]);
  });

  afterEach(() => {
    cy.resetMsw();
  });

  it('works', () => {
    cy.visit('/my-health/medications');
    cy.get('[data-testid="rx-card"]').should('exist');
  });
});
```

### 3. Run test

```bash
yarn cy:run --spec "path/to/test.cypress.spec.js"
```

## For Unit Tests

### 1. Import server and handlers

```javascript
import { server } from '@department-of-veterans-affairs/platform-testing/msw/server';
import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';
```

### 2. Use scenarios in tests

```javascript
describe('My Component', () => {
  // server.listen(), resetHandlers(), close() are automatic

  it('loads data', async () => {
    // Override default if needed
    server.use(...scenarios.medications.empty());

    const screen = render(<MyComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('No medications')).to.exist;
    });
  });
});
```

### 3. Run test

```bash
yarn test:unit path/to/test.unit.spec.js
```

## For Local Development

### 1. Add to app-entry.jsx

```javascript
import environment from 'platform/utilities/environment';

if (environment.isLocalhost()) {
  import('@department-of-veterans-affairs/platform-testing/msw/browser').then(
    ({ worker }) => {
      worker.start({ onUnhandledRequest: 'warn' });
      console.log('🎭 MSW started');
    },
  );
}
```

### 2. Start dev server

```bash
yarn watch --env entry=medications
```

### 3. Check browser console

```
🎭 MSW started
[MSW] Mocking enabled.
```

### 4. Change scenario in console (optional)

```javascript
import('/platform/testing/msw/scenarios').then(({ scenarios }) => {
  window.mswWorker.use(...scenarios.medications.empty());
  location.reload();
});
```

## Available Scenarios

### Medications

```javascript
scenarios.medications.withActiveRx()          // Active prescriptions
scenarios.medications.withActiveRx({ count: 5 }) // 5 active prescriptions
scenarios.medications.withRefillable(3)       // 3 refillable prescriptions
scenarios.medications.empty()                 // No prescriptions
scenarios.medications.error(500)              // Server error
scenarios.medications.refillSuccess()         // Successful refill
scenarios.medications.refillFailure()         // Failed refill
scenarios.medications.slow()                  // Slow response (loading state)
```

### User

```javascript
scenarios.user.authenticated()                // Logged in user
scenarios.user.unauthenticated()              // Not logged in
scenarios.user.cernerUser()                   // Cerner patient
scenarios.user.withToggles({ myToggle: true }) // Custom feature toggles
```

## Creating Custom Scenarios

```javascript
// In your test file
import { rest } from 'msw';
import { prescriptionsHandler } from '@department-of-veterans-affairs/platform-testing/msw/handlers';

// Option 1: Use existing handler with custom options
cy.loadMswScenario([
  prescriptionsHandler({ 
    count: 10, 
    status: 'Expired' 
  }),
]);

// Option 2: Create custom handler
cy.loadMswScenario([
  rest.get('/my_health/v1/prescriptions', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          // your custom data
        ],
      }),
    );
  }),
]);
```

## Debugging Tips

### See MSW requests in console

```javascript
worker.start({ quiet: false });
```

### See requests in DevTools

Open Chrome DevTools → Network tab → Filter by "MSW"

### Inspect current handlers

```javascript
// In browser console
window.mswWorker.listHandlers()
```

### Reset handlers

```javascript
// Cypress
cy.resetMsw()

// Unit tests
afterEach(() => server.resetHandlers())
```

## Common Issues

### "MSW worker not found"

**Solution:** Call `cy.startMsw()` before `cy.visit()`

```javascript
beforeEach(() => {
  cy.startMsw(); // ← Add this
  cy.visit('/my-app');
});
```

### "Request not intercepted"

**Solution:** Check handler URL matches exactly

```javascript
// ❌ Wrong - missing protocol
rest.get('my_health/v1/prescriptions', ...)

// ✅ Right - correct path
rest.get('/my_health/v1/prescriptions', ...)
```

### "Handlers not resetting"

**Solution:** Add afterEach cleanup

```javascript
afterEach(() => {
  cy.resetMsw(); // Cypress
  // or
  server.resetHandlers(); // Unit tests (automatic)
});
```

## Next Steps

1. Try the POC tests:
   - `medications-msw-poc.cypress.spec.js`
   - `PrescriptionsList.msw-poc.unit.spec.jsx`

2. Read the guides:
   - `README.md` - Full documentation
   - `MIGRATION_GUIDE.md` - Migration instructions
   - `EXAMPLE_MIGRATION.md` - Real-world example

3. Create your first MSW test!

## Cheat Sheet

```javascript
// CYPRESS

// Start
cy.startMsw()

// Load scenario
cy.loadMswScenario([...scenarios.medications.withActiveRx()])

// Reset
cy.resetMsw()

// UNIT TESTS

// Override
server.use(...scenarios.medications.empty())

// Custom handler
server.use(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json({ data: [] }))
  })
)

// LOCAL DEV

// In app-entry.jsx
if (environment.isLocalhost()) {
  import('@department-of-veterans-affairs/platform-testing/msw/browser')
    .then(({ worker }) => worker.start())
}

// In console
window.mswWorker.use(...handlers)
window.mswWorker.resetHandlers()
```

## Help & Support

- Read the docs: `src/platform/testing/msw/`
- Ask in Slack: `#vfs-platform-support`
- Check MSW docs: https://mswjs.io/
