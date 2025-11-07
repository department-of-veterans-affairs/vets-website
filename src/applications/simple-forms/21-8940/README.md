# Apply for additional compensation based on inability to work

## URL
http://localhost:3001/disability/eligibility/special-claims/unemployability/apply-form-21-8940
https://staging.va.gov/disability/eligibility/special-claims/unemployability/apply-form-21-8940

## Common commands
```bash
# Development
yarn watch --env entry=21-8940
yarn watch --env entry=21-8940,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/simple-forms/21-8940/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder simple-forms/21-8940
yarn test:unit --app-folder simple-forms/21-8940 --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/simple-forms/21-8940/tests/e2e/21-8940.cypress.spec.js"
```