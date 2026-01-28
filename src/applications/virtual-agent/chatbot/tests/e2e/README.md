# VA Virtual Agent Chatbot E2E Tests

End-to-end tests for the VA Virtual Agent chatbot application (V2).

## Running Tests

### Prerequisites

1. Start the `vets-api` backend in a separate terminal (required for API mocking to work):

   ```bash
   # In vets-api directory
   bundle install
   bundle exec rails s
   ```

2. Start the frontend dev server in another terminal:

   ```bash
   yarn watch --env entry=virtual-agent
   ```

3. Run the chatbot e2e tests:
   ```bash
   yarn cy:run --spec "src/applications/virtual-agent/chatbot/tests/e2e/**/*.cypress.spec.js"
   ```

### Interactive Mode

```bash
yarn cy:open
```

Then select the `chatbot.cypress.spec.js` file.

## Directory Structure

```
tests/e2e/
├── chatbot.cypress.spec.js     # Main test file
├── fixtures/
│   └── mocks/
│       └── feature-toggles.json  # Feature toggle mock data
├── helpers/
│   └── chatbot-helpers.js      # Reusable test helpers
└── README.md
```

## Feature Toggles

The tests mock the `/v0/feature_toggles` endpoint. Toggle names in fixtures must use **snake_case** to match the API format:

```json
{
  "name": "virtual_agent_use_v2_chatbot",
  "value": true
}
```

## Helpers

### `mockFeatureToggles()`

Mocks feature toggles required for the V2 chatbot. Call in `beforeEach()`:

```javascript
import { mockFeatureToggles } from './helpers/chatbot-helpers';

beforeEach(() => {
  mockFeatureToggles();
});
```

## Accessibility

All tests include accessibility checks using `cy.injectAxeThenAxeCheck()` per VA platform standards.
