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

## Migration to TypeScript

1. Rename a component to .tsx, `import * as React from 'react';`, create `interface YourComponentProps`. Add input and return types to your component. Remove prop-types.
2. Run `yarn tsc`, address errors, repeat until you have a clean build.
3. Run `yarn test:unit --app-folder [application-name]` or one file `run yarn test:unit ./src/applications/[application-name]/path/to/Component.unit.spec.jsx` to verify tests are passing. Add `--log-level trace` and/or `node --trace-warnings` for more detail.
4. Add .jsx file to `./src/applications/[application-name]/.gitignore`, delete the .jsx and commit your changes!


## Develop

Every application folder within `vets-website/src/applications` defines a `manifest.json` which defines object properties for `entryName`, the name of your bundled/transpiled app, and `entryFile`, the root of your React application.

```json
// manifest.json
{
  "appName": "My HealtheVet on VA.gov",
  "entryFile": "./app-entry.jsx",
  "entryName": "mhv-landing-page",
  "rootUrl": "/my-health",
  "productId": "4d8b0801-dd86-4728-9609-9d794c923e03"
}
```

The `yarn watch` command uses webpack to bundle and serve your application when developing.

`yarn watch --env entry=[manifest.entryName]` ->
  `node ./script/watch.js` ->
  `webpack serve --config config/webpack.config.js --env scaffold`

The `--env scaffold` option informs webpack to execute `generateHtmlFiles()`, creating the necessary `index.html` which loads assets on the client and contains the `div#react-root` placeholder element.

webpack is configured to transform matching source files and output to `./build/[environment]/generated/[manifest.entryName].entry.js`.

- `/.jsx?$/` matching filenames are processed by `babel-loader`
- `/.tsx?$/` matching filenames are processed by `babel-loader` and `ts-loader` -- Q: Do we need both of these loaders?

babel is configured (via `babel.config.json`) to use the following presets

- [`@babel/env`](https://babeljs.io/docs/babel-preset-env)
- [`@babel/react`](https://babeljs.io/docs/babel-preset-react)


## Questions

- When does an `app-entry.jsx` file transform?
- What if we used `index.d.ts` files for defining types, migrating away from prop-types?
