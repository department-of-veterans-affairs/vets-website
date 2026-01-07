# 22-0803 Request for reimbursement of licensing or certification test fees

## URL

http://localhost:3001/forms/22-0803/request-reimbursement-licensing-or-certification-test-fees-online
https://staging.va.gov/forms/22-0803/request-reimbursement-licensing-or-certification-test-fees-online

## Common commands

```bash
# Development
yarn watch --env entry=0803-edu-benefits
yarn watch --env entry=0803-edu-benefits,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/edu-benefits/0803/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder edu-benefits/0803
yarn test:unit --app-folder edu-benefits/0803 --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/edu-benefits/0803/tests/e2e/0803-edu-benefits.cypress.spec.js"
```
