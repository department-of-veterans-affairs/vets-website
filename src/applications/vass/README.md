# VASS
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
Local development of the application requires use of the [mock API](https://github.com/department-of-veterans-affairs/vets-website#running-a-mock-api-for-local-development). Run the following command to provide the mock API VASS specific mock data:

```
yarn mock-api --responses src/applications/vass/services/mocks/index.js
```

# Unit tests
yarn test:unit --app-folder vass
yarn test:unit --app-folder vass --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/vass/tests/e2e/vass.cypress.spec.js"
```

## Mock UUIDs
There are several different mock UUIDs that can be used as a value for the `uuid` URL param.

- Happy path (no existing appointment): `http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=c0ffee-1234-beef-5678`
  - uuid='c0ffee-1234-beef-5678'
  - lastname='Smith'
  - dob='1935-04-07'
  - otc='123456'
  - This user has **no** existing appointment and will continue through the scheduling flow

- User with existing appointment: `http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=has-appointment`
  - uuid='has-appointment'
  - lastname='Smith'
  - dob='1935-04-07'
  - otc='123456'
  - This user has an existing appointment and will be redirected to the already-scheduled page