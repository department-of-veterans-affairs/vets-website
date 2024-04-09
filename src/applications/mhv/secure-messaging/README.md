# Secure-Messaging application

## Quick start to get running locally - Setup
Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.
  - clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
  - run `yarn install`

## Quick start to get running locally - Run
  - turn on local mocks `yarn --cwd $( git rev-parse --show-toplevel ) mock-api --responses src/applications/mhv/secure-messaging/api/mocks/index.js`
  - start app `yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=secure-messaging`
  - Run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
  - visit the app: `http://127.0.0.1:3001/my-health/secure-messages`

## Running tests
Unit tests for can be run using this command: `yarn test:unit --app-folder mhv/secure-messaging`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder secure-messaging --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI (cannot be used from codespaces, only local command line) using this command: `yarn cy:open`. From there you can filter by `secure-messages` to run just secure-messages end to end tests.

Run Cypress from command line:
- Run all `yarn cy:run --spec "src/applications/mhv/secure-messaging/**/**/*"`
- Specify browser `-b electron`
