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
yarn mock-api --responses src/applications/vass/services/mocks/index.js

# Unit tests
yarn test:unit --app-folder vass
yarn test:unit --app-folder vass --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/vass/tests/e2e/vass.cypress.spec.js"
```

## Mock UUIDs
There are several different mock UUIDs that can be used as a value for the `uuid` URL param.

- Happy path: 'http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=c0ffee-1234-beef-5678`
  - uuid='c0ffee-1234-beef-5678'
  - lastname='Smith'
  - dob='1935-04-07'
  - otc='123456'