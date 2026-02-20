# After Visit Summary (AVS)

The After Visit Summary app displays summaries of Veterans' healthcare appointments.

## Quick Start

### Run with mock API (no backend needed)

```bash
USE_MOCKS=true yarn watch --env entry=avs --env api=http://mock-vets-api.local
```

Then open http://localhost:3001/my-health/medical-records/summaries-and-notes/visit-summary/9A7AF40B2BC2471EA116891839113252

### Run with real API

```bash
# Start vets-api locally first, then:
yarn watch --env entry=avs
```

## Development

### Key Files

| Path | Description |
|------|-------------|
| `app-entry.jsx` | App entry point |
| `router.jsx` | Route configuration |
| `containers/` | Redux-connected page containers |
| `components/` | React components |
| `reducers/` | Redux state management |
| `mocks/` | MSW mock handlers |

### Mock Data

The `mocks/` directory contains MSW (Mock Service Worker) handlers:

- `data.js` - Shared mock data and error responses
- `browser.js` - MSW handlers for local development (browser)
- `server.js` - MSW handlers for unit tests (Node)

Test fixtures are in `tests/fixtures/`. The mock handlers use these fixtures by default.

## Testing

### Unit Tests

```bash
yarn test:unit --app-folder avs
```

With coverage:

```bash
yarn test:unit --app-folder avs --coverage --coverage-html
```

#### Using MSW in Unit Tests

```javascript
import { server } from 'platform/testing/unit/mocha-setup';
import { avsHandlers, handlers } from '../../mocks/server';

describe('My test', () => {
  beforeEach(() => server.use(...avsHandlers));
  afterEach(() => server.resetHandlers());

  it('handles success', async () => {
    // Uses default success handlers
  });

  it('handles not found', async () => {
    // Override with error handler
    server.use(handlers.avsNotFound());
  });
});
```

### E2E Tests

```bash
# Start the app first
yarn watch --env entry=avs

# Run Cypress tests (CLI)
yarn cy:run --spec "src/applications/avs/**/*.cypress.spec.js"

# Or use Cypress GUI
yarn cy:open
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /avs/v0/avs/:id` | Get AVS by ID |
| `GET /v0/feature_toggles` | Feature flags |

## Feature Flags

| Flag | Description |
|------|-------------|
| `avs_enabled` | Enables the AVS feature |
