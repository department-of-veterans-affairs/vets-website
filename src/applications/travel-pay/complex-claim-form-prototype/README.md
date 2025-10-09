# Complex Claim Form Prototype

## URL
http://localhost:3001/my-health/travel-pay/complex-claim-form-prototype
https://staging.va.gov/my-health/travel-pay/complex-claim-form-prototype

## Common commands
```bash
# Development
yarn watch --env entry=complex-claim-form-prototype
yarn watch --env entry=complex-claim-form-prototype,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/travel-pay/complex-claim-form-prototype/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder travel-pay/complex-claim-form-prototype
yarn test:unit --app-folder travel-pay/complex-claim-form-prototype --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/travel-pay/complex-claim-form-prototype/tests/e2e/complex-claim-form-prototype.cypress.spec.js"
```