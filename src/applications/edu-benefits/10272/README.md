# 22-10272 Application for reimbursement of preparatory (prep) course for licensing or certification test

## URL
http://localhost:3001/education/other-va-education-benefits/reimbursements/test-reimbursement-22-10272
https://staging.va.gov/education/other-va-education-benefits/reimbursements/test-reimbursement-22-10272

## Common commands
```bash
# Development
yarn watch --env entry=10272-edu-benefits
yarn watch --env entry=10272-edu-benefits,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/edu-benefits/10272/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder edu-benefits/10272
yarn test:unit --app-folder edu-benefits/10272 --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/edu-benefits/10272/tests/e2e/10272-edu-benefits.cypress.spec.js"
```