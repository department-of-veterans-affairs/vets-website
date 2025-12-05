# Income Verification for Disability Benefits

## URL
http://localhost:3001/disability/verify-individual-unemployability-status/submit-employment-questionnaire-form-21-4140
https://staging.va.gov/disability/verify-individual-unemployability-status/submit-employment-questionnaire-form-21-4140

## Common commands
```bash
# Development
yarn watch --env entry=21-4140
yarn watch --env entry=21-4140,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/simple-forms/21-4140/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder simple-forms/21-4140
yarn test:unit --app-folder simple-forms/21-4140 --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/simple-forms/21-4140/tests/e2e/21-4140-income-verification.cypress.spec.js"
```