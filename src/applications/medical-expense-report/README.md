# Medical Expense Report

## Commands:

| Option | Command |
| ------ | ----------- |
| Site   | http://localhost:3001/supporting-forms-for-claims/submit-medical-expense-report-form-21p-8416 |
| Watch  | yarn watch --env entry=medical-expense-report |
| Mock API (not implemented) | yarn mock-api --responses src/applications/medical-expense-report/tests/fixtures/mocks/local-mock-responses.js | 
| Unit tests | yarn test:unit --app-folder medical-expense-report --log-level all |

## Authentication
To see the form as either an authenticated/unauthenticated user, paste one of the following in your browser's console.

| Status | Cookie |
| ------ | ------ |
| Authenticated | `localStorage.setItem('hasSession', true)` |
| Unauthenticated | `localStorage.setItem('hasSession', false)` |
