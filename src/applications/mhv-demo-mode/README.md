# MHV Demo Mode

## URL
http://localhost:3001/demo-mode/my-health
https://staging.va.gov/demo-mode/my-health

## Common commands
```bash
# Development
yarn watch --env entry=mhv-demo-mode
yarn watch --env entry=mhv-demo-mode,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/mhv-demo-mode/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder mhv-demo-mode
yarn test:unit --app-folder mhv-demo-mode --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/mhv-demo-mode/tests/e2e/mhv-demo-mode.cypress.spec.js"
```