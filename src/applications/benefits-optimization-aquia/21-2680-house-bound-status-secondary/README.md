# 21-2680 House Bound Status (Medical Professional)

## URL
http://localhost:3001/pension/aid-attendance-housebound/apply-form-21-2680-secondary
https://staging.va.gov/pension/aid-attendance-housebound/apply-form-21-2680-secondary

## Common commands
```bash
# Development
yarn watch --env entry=21-2680-house-bound-status-secondary
yarn watch --env entry=21-2680-house-bound-status-secondary,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/benefits-optimization-aquia/21-2680-house-bound-status-secondary/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status-secondary
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status-secondary --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-2680-house-bound-status-secondary/tests/e2e/21-2680-house-bound-status-secondary.cypress.spec.js"
```