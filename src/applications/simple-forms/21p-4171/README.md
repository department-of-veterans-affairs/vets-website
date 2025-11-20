# VA Form 21P-4171

## URL
http://localhost:3001/forms/21p-4171
https://staging.va.gov/forms/21p-4171

## Common commands
```bash
# Development
yarn watch --env entry=21p-4171
yarn watch --env entry=21p-4171,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/simple-forms/21p-4171/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder simple-forms/21p-4171
yarn test:unit --app-folder simple-forms/21p-4171 --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/simple-forms/21p-4171/tests/e2e/21p-4171.cypress.spec.js"
```