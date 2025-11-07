# VASS
// TODO: ADD description

## URL
http://localhost:3001/service-member/benefits/solid-start/schedule
https://staging.va.gov/service-member/benefits/solid-start/schedule

## Common commands
```bash
# Development
yarn watch --env entry=vass-entry
yarn watch --env entry=vass-entry,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/vass/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder vass
yarn test:unit --app-folder vass --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/vass/tests/e2e/vass-entry.cypress.spec.js"
```