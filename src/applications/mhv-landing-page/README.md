# mhv-landing-page

## App

This app serves as the landing page for My HealtheVet (MHV) on VA.gov, providing veterans quick access to their health-related tools and information.

## Quick start to get running locally

Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.

- clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
- run `yarn install`
- turn on local mocks `yarn mock-api --responses src/applications/mhv-landing-page/mocks/api/index.js`
- start app `yarn watch --env entry=mhv-landing-page`
- Run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
- visit the app: `http://localhost:3001/my-health`

## Running tests

Unit tests can be run using this command: `yarn test:unit --app-folder mhv-landing-page`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder mhv-landing-page --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `mhv-landing-page` to run end to end tests for this app.

Run Cypress from command line:

- Run all `yarn cy:run --spec "src/applications/mhv-landing-page/**/**/*"`
- Use the `-b electron` option to specify the Electron browser, which is lightweight, tightly integrated with Cypress, and comes pre-installed, removing the need for separate installation.

### Test coverage

```bash
$ yarn test:unit --app-folder mhv-landing-page --coverage --coverage-html
$ cd ./coverage
$ npx http-server
$ open http://localhost:8080
```
