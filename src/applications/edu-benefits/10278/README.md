# Authorization to Disclose Personal Information

## URL
http://localhost:3001/education/10278/
https://staging.va.gov/education/10278/

## Common commands
```bash
# Development
yarn watch --env entry=10278-edu-benefits
yarn watch --env entry=10278-edu-benefits,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/edu-benefits/10278/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder edu-benefits/10278
yarn test:unit --app-folder edu-benefits/10278 --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/edu-benefits/10278/tests/e2e/10278-edu-benefits.cypress.spec.js"
```