# 22-0989 Entitlement restoration

## URL
http://localhost:3001/forms/0989
https://staging.va.gov/forms/0989

## Common commands
```bash
# Development
yarn watch --env entry=0989-edu-benefits
yarn watch --env entry=0989-edu-benefits,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/edu-benefits/0989/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder edu-benefits/0989
yarn test:unit --app-folder edu-benefits/0989 --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/edu-benefits/0989/tests/e2e/0989-edu-benefits.cypress.spec.js"
```