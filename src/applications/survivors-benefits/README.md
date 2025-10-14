# 21P-534EZ Survivors Benefits

## Commands:

| Option | Command |
| ------ | ----------- |
| Site   | http://localhost:3001/supporting-forms-for-claims/apply-form-21p-534ez |
| Watch  | yarn watch --env entry=survivors-benefits |
| Mock API (not implemented) | yarn mock-api --responses src/applications/survivors-benefits/tests/fixtures/mocks/local-mock-responses.js | 
| Unit tests | yarn test:unit --app-folder survivors-benefits --log-level all |

## Authentication
To see the form as either an authenticated/unauthenticated user, paste one of the following in your browser's console.

| Status | Cookie |
| ------ | ------ |
| Authenticated | `localStorage.setItem('hasSession', true)` |
| Unauthenticated | `localStorage.setItem('hasSession', false)` |