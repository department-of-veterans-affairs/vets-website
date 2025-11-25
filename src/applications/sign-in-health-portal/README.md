# sign-in-health-portal

## URL
http://localhost:3001/sign-in-health-portal
https://staging.va.gov/sign-in-health-portal

## Common commands
```bash
# Development
yarn watch --env entry=sign-in-health-portal
yarn watch --env entry=sign-in-health-portal,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/sign-in-health-portal/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder sign-in-health-portal
yarn test:unit --app-folder sign-in-health-portal --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/sign-in-health-portal/tests/e2e/sign-in-health-portal.cypress.spec.js"
```