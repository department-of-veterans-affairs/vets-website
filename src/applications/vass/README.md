# VASS
<!-- This is a feature branch while main is locked -->
// TODO: ADD description

## URL
http://localhost:3001/service-member/benefits/solid-start/schedule
https://staging.va.gov/service-member/benefits/solid-start/schedule

## Common commands
```bash
# Development
yarn watch --env entry=vass
yarn watch --env entry=vass,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/vass/tests/fixtures/mocks/local-mock-responses.js

# Unit tests
yarn test:unit --app-folder vass
yarn test:unit --app-folder vass --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/vass/tests/e2e/vass.cypress.spec.js"
```