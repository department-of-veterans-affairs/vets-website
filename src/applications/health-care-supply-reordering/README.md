# Health Care Supply Reordering application

## Background Info

About: This app provides an interface to re-order Hearing Aid and Sleep Apnea accessories
Slack Channel: [#va-cto-supply-reordering](https://dsva.slack.com/archives/C05DFSM57FW/p1689711688225089)

## Quick start to get running locally

Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.

- clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
- navigate to the application `cd src/applications/health-care-supply-reordering`
- run `yarn install`
- turn on local mocks `yarn --cwd $( git rev-parse --show-toplevel ) mock-api --responses src/applications/health-care-supply-reordering/mocks/index.js`
- start app `yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=health-care-supply-reordering`
- Run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
- visit the app: `http://localhost:3001/health-care/order-hearing-aid-or-CPAP-supplies-form`

## Running tests

Unit tests can be run using this command: `yarn test:unit --app-folder health-care-supply-reordering`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder health-care-supply-reordering --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `health-care-supply-reordering` to run end to end tests for this app.

Run Cypress from command line:

- Run all `yarn cy:run --spec "src/applications/health-care-supply-reordering/**/**/*"`
- Specify browser `-b electron`
