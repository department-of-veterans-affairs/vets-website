# Mock Form with Prefill

## URL
http://localhost:3001/mock-form-prefill
https://staging.va.gov/mock-form-prefill

## Common commands
```bash
# Development
yarn watch --env entry=mock-form-prefill
yarn watch --env entry=mock-form-prefill,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/simple-forms/mock-form-prefill/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder simple-forms/mock-form-prefill
yarn test:unit --app-folder simple-forms/mock-form-prefill --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/simple-forms/mock-form-prefill/tests/e2e/mock-form-prefill.cypress.spec.js"
```