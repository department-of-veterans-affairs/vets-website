# MSW Unified Mocking - Proof of Concept Summary

## Overview

This POC demonstrates unifying three separate mocking systems (mocker-api, mockFetch, cy.intercept) into a single MSW-based solution for the mhv-medications app.

## What Was Built

### 1. MSW Infrastructure (`src/platform/testing/msw/`)

- **Handlers** - Reusable request handlers for common APIs
  - `handlers/medications/prescriptions.js` - Medications API handlers
  - `handlers/user/index.js` - User profile handlers
  - `handlers/feature-toggles/index.js` - Feature toggle handlers

- **Scenarios** - Pre-configured application states
  - `scenarios/medications.js` - Medication states (active, empty, error, etc.)
  - `scenarios/user.js` - User states (authenticated, Cerner, etc.)

- **Runtime Setup**
  - `server.js` - MSW Node server for unit tests
  - `browser.js` - MSW browser worker for Cypress/dev

- **Cypress Integration**
  - `e2e/cypress/support/commands/msw.js` - Custom Cypress commands

### 2. POC Tests

#### Cypress E2E Tests
- `medications-msw-poc.cypress.spec.js` - Basic MSW integration examples
- `medications-comparison.cypress.spec.js` - Side-by-side old vs new patterns
- `helpers/MedicationsSiteMSW.js` - MSW-based test helper

#### Unit Tests
- `PrescriptionsList.msw-poc.unit.spec.jsx` - MSW in unit tests examples

### 3. Documentation

- `README.md` - Usage guide and benefits
- `MIGRATION_GUIDE.md` - Step-by-step migration instructions
- `POC_SUMMARY.md` - This file

## Key Features Demonstrated

### Unified Mocking Across Contexts

**Before:**
```
Local Dev      Unit Tests       Cypress
    ↓               ↓               ↓
mocker-api      mockFetch      cy.intercept
```

**After:**
```
Local Dev      Unit Tests       Cypress
    ↓               ↓               ↓
    └───────────────┴───────────────┘
                    ↓
                   MSW
```

### Scenario Reuse

```javascript
// Same scenario works in all contexts!
const activeRxScenario = scenarios.medications.withActiveRx();

// Unit test
server.use(...activeRxScenario);

// Cypress test
cy.loadMswScenario(activeRxScenario);

// Local dev
worker.use(...activeRxScenario);
```

### Flexible Customization

```javascript
// Generate 5 active, refillable prescriptions
scenarios.medications.withActiveRx({ 
  count: 5, 
  refillable: true 
})

// Empty state
scenarios.medications.empty()

// Error state
scenarios.medications.error(500)

// Custom attributes
scenarios.medications.singlePrescription({ 
  prescriptionName: 'Custom Med',
  dispStatus: 'Expired' 
})
```

### Hybrid Pattern: MSW + cy.intercept

```javascript
// MSW provides the data
cy.loadMswScenario(scenarios.medications.withActiveRx());

// cy.intercept spies (doesn't stub)
cy.intercept('GET', '/my_health/v1/prescriptions*').as('rx');

cy.visit('/my-health/medications');

// Assert network behavior
cy.wait('@rx').then(interception => {
  expect(interception.response.statusCode).to.equal(200);
  expect(interception.request.headers.authorization).to.exist;
});
```

## Files Created

```
src/platform/testing/msw/
├── README.md                                    # Usage guide
├── MIGRATION_GUIDE.md                           # Migration instructions
├── POC_SUMMARY.md                               # This file
├── server.js                                    # Unit test setup
├── browser.js                                   # Browser worker
├── handlers/
│   ├── index.js                                 # Handler exports
│   ├── medications/
│   │   └── prescriptions.js                     # Medications handlers
│   ├── user/
│   │   └── index.js                             # User handlers
│   └── feature-toggles/
│       └── index.js                             # Feature toggle handlers
└── scenarios/
    ├── index.js                                 # Scenario exports
    ├── medications.js                           # Medication scenarios
    └── user.js                                  # User scenarios

src/platform/testing/e2e/cypress/support/commands/
└── msw.js                                       # Cypress MSW commands

src/applications/mhv-medications/tests/
├── e2e/
│   ├── medications-msw-poc.cypress.spec.js      # Basic POC tests
│   ├── medications-comparison.cypress.spec.js   # Comparison tests
│   └── helpers/
│       └── MedicationsSiteMSW.js                # MSW test helper
└── components/
    └── PrescriptionsList.msw-poc.unit.spec.jsx  # Unit test POC
```

## Running the POC

### Prerequisites

```bash
# MSW is already installed (v0.35.0)
# No additional dependencies needed
```

### Run Unit Tests

```bash
yarn test:unit src/applications/mhv-medications/tests/components/PrescriptionsList.msw-poc.unit.spec.jsx
```

### Run Cypress Tests

```bash
# Terminal 1: Start dev server
yarn watch --env entry=medications

# Terminal 2: Run Cypress tests
yarn cy:run --spec "src/applications/mhv-medications/tests/e2e/medications-msw-poc.cypress.spec.js"

# Or run comparison tests
yarn cy:run --spec "src/applications/mhv-medications/tests/e2e/medications-comparison.cypress.spec.js"
```

### Try in Local Dev

```javascript
// In mhv-medications/app-entry.jsx (or any app entry)
import environment from 'platform/utilities/environment';

if (environment.isLocalhost()) {
  import('@department-of-veterans-affairs/platform-testing/msw/browser').then(
    ({ worker }) => {
      worker.start({ onUnhandledRequest: 'warn' });
      console.log('🎭 MSW worker started');
    },
  );
}
```

Then:
```bash
yarn watch --env entry=medications
# Visit http://localhost:3001/my-health/medications
# Check browser console for MSW logs
```

## Benefits Demonstrated

### 1. Single Source of Truth

- Medication data structure defined once in `createPrescription()`
- Same handlers used in unit tests, E2E, and local dev
- Changes to API shape updated in one place

### 2. Scenario Reuse

- Pre-built scenarios like `withActiveRx()`, `empty()`, `error()`
- Shareable across team and projects
- Composable for complex states

### 3. Better Developer Experience

- See mocked requests in browser DevTools Network tab
- Easy to switch scenarios without fixtures
- Clear, declarative test setup

### 4. More Realistic Mocking

- Intercepts at network level (fetch/XHR)
- Preserves request/response timing
- Can inspect/modify real request objects

### 5. Type Safety (Future)

- Can add TypeScript types to handlers
- Validates request/response contracts
- Catches API mismatches early

### 6. Easier Testing

**Before (cy.intercept):**
```javascript
cy.intercept('GET', '/my_health/v1/prescriptions*', {
  body: {
    data: [
      { id: '1', type: 'prescriptions', attributes: { ... } },
      { id: '2', type: 'prescriptions', attributes: { ... } },
      // ... manual fixture creation
    ],
  },
});
```

**After (MSW):**
```javascript
cy.loadMswScenario(scenarios.medications.withActiveRx({ count: 5 }));
```

## Comparison: Old vs New

### Local Development

| Aspect | mocker-api | MSW |
|--------|-----------|-----|
| Setup | Custom server, separate port | Browser worker, same origin |
| DevTools | Not visible | Visible in Network tab |
| Hot reload | Restart required | Dynamic handler updates |
| Reusability | None | Share with tests |
| Type safety | No | Yes (with TS) |

### Unit Tests

| Aspect | mockFetch | MSW |
|--------|-----------|-----|
| Setup | mockFetch(), resetFetch() | server.listen/close (auto) |
| Flexibility | Limited, function stubs | Full request/response control |
| Debugging | Hard to inspect | Easy, matches real network |
| Reusability | Per-test | Shared scenarios |
| Network realism | No | Yes |

### Cypress Tests

| Aspect | cy.intercept | MSW + cy.intercept |
|--------|-------------|-------------------|
| Data mocking | Yes | MSW handles this |
| Network spying | Yes | cy.intercept for this |
| Fixture management | Manual, many files | Scenarios, generated |
| Reusability | None | Share with unit tests |
| Maintenance | High | Low |

## Limitations & Considerations

### MSW Cannot Replace cy.intercept For:

1. **True network errors** - DNS failures, connection resets
2. **Throttling/latency** - Fine-grained timing control
3. **Binary streams** - Upload/download progress events
4. **Socket-level errors** - Intentional aborts, timeouts

### When to Use cy.intercept:

```javascript
// Network error testing
cy.intercept('GET', '/api/data', { forceNetworkError: true });

// Latency testing
cy.intercept('GET', '/api/data', { delay: 5000 });

// Spying on requests
cy.intercept('GET', '/api/data').as('data');
cy.wait('@data').its('request.headers').should(...);
```

### Migration Effort

**Per App:**
- Extract mocker-api routes → MSW handlers (2-4 hours)
- Create scenarios (1-2 hours)
- Update Cypress tests (4-8 hours depending on test count)
- Update unit tests (2-4 hours)
- Test & validate (2-4 hours)

**Estimated: 11-22 hours per app**

**Platform-wide:**
- ~15-20 apps use mocker-api
- Total estimate: 165-440 hours (1-2 months for a team)

## Next Steps

### Immediate (This Sprint)

1. ✅ Create POC infrastructure
2. ✅ Demonstrate in mhv-medications
3. ✅ Document patterns and benefits
4. ⬜ Team review and feedback
5. ⬜ Present to stakeholders

### Short-term (Next 2-4 Sprints)

1. Migrate 2-3 high-value apps completely
2. Create handlers for common platform APIs (user, toggles, etc.)
3. Add ESLint rule discouraging cy.intercept for data stubbing
4. Create codemods for common patterns
5. Train team on MSW patterns

### Long-term (Next Quarter)

1. Migrate remaining apps
2. Remove mocker-api dependency
3. Deprecate/remove mockFetch
4. Update onboarding docs
5. Add TypeScript types to handlers

## Feedback Requested

1. Does the API feel intuitive?
2. Are scenarios flexible enough?
3. Is the Cypress integration smooth?
4. What's missing?
5. Any concerns about the migration path?

## Questions & Answers

**Q: Why not just improve mocker-api?**  
A: mocker-api is dev-only and can't be shared with tests. MSW works everywhere.

**Q: Can we migrate incrementally?**  
A: Yes! MSW and old systems can coexist. Migrate app-by-app, test-by-test.

**Q: What about performance?**  
A: MSW has negligible overhead. Runs in service worker, doesn't block main thread.

**Q: Does this require updating vets-api?**  
A: No. This is frontend-only. vets-api unchanged.

**Q: What if MSW doesn't work for our use case?**  
A: Fallback to cy.intercept is always available for edge cases.

## Success Metrics

### After Full Migration:

- ✅ Single mock system (MSW)
- ✅ Reduced test maintenance (fewer fixtures)
- ✅ Faster test authoring (reusable scenarios)
- ✅ Better debugging (visible in DevTools)
- ✅ Improved reliability (network-realistic)
- ✅ Removed dependencies (mocker-api, mockFetch helpers)

## Conclusion

The POC demonstrates that MSW can successfully unify our three separate mocking systems while providing better developer experience, improved test reliability, and reduced maintenance burden. The migration path is incremental and low-risk, with clear benefits at each step.

**Recommendation: Proceed with phased migration, starting with high-traffic apps.**
