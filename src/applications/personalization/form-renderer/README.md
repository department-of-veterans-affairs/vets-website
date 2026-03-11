# form-renderer

## URL
http://localhost:3001/form-renderer
https://staging.va.gov/form-renderer

## Common commands
```bash
# Development
yarn watch --env entry=form-renderer
yarn watch --env entry=form-renderer,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/form-renderer/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder form-renderer
yarn test:unit --app-folder form-renderer --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/form-renderer/tests/e2e/form-renderer.cypress.spec.js"
```