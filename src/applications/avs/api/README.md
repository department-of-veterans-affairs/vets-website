# AVS application

## Quick start to get running locally
Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.
  - clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
  - navigate to the check-in application `cd src/applications/avs`
  - run `yarn install`
  - turn on local mocks `yarn --cwd $( git rev-parse --show-toplevel ) mock-api --responses src/applications/avs/api/mocks/index.js`
  - start app `yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=avs`
  - visit the app: `http://localhost:3001/my-health/care-notes/avs/64aee349ceec8352f2403cb0`

## Mock data
Data is currently not checked into git to avoid PII/PHI concerns. Ask another developer for copies of the fixtures.

## Running tests
Unit tests for can be run using this command: `yarn test:unit --app-folder avs`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder avs --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `avs` to run just AVS end to end tests.

Run Cypress from command line:
- Run all `yarn cy:run --spec "src/applications/avs/**/**/*"`
- Specify browser `-b electron`
