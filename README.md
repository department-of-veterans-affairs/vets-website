# VA.gov ![Build Status](https://github.com/department-of-veterans-affairs/vets-website/actions/workflows/continuous-integration.yml/badge.svg?branch=main)

## Table of Contents

- [VA.gov ](#vagov-)
  - [Table of Contents](#table-of-contents)
  - [What is this?](#what-is-this)
  - [Common commands](#common-commands)
  - [Building `vets-website`](#building-vets-website)
    - [Building applications](#building-applications)
    - [Building static content](#building-static-content)
    - [Building both together](#building-both-together)
  - [Working in GitHub Codespaces](#working-in-github-codespaces)
  - [Running tests](#running-tests)
    - [Unit tests](#unit-tests)
    - [End-to-end (E2E) / Browser tests](#end-to-end-e2e--browser-tests)
    - [Debugging Node 22 CI failures](#debugging-node-22-ci-failures)
  - [Running a mock API for local development](#running-a-mock-api-for-local-development)
  - [More commands](#more-commands)
  - [Supported Browsers](#supported-browsers)
  - [API Keys](#api-keys)
  - [Additional Resources](#additional-resources)
  - [Not a member of the repository and want to be added?](#not-a-member-of-the-repository-and-want-to-be-added)

## What is this?

This is the front end repository for VA.gov. It contains application code used across the site.

There are several repositories that contain the code and content used to build VA.gov. If you're looking to get started running VA.gov locally, you should read the [Getting Started](https://depo-platform-documentation.scrollhelp.site/developer-docs/Setting-up-your-local-frontend-environment.1844215878.html) documentation.

## Common commands

Once you have the site set up locally, these are some common commands you might find useful:

| I want to...               | Then you should...                                            |
| :------------------------- | :------------------------------------------------------------ |
| fetch all dependencies     | `yarn install-safe`; run this any time `package.json` changes |
| build applications         | `yarn build`                                                  |
| run the webpack dev server | `yarn watch`                                                  |
| build in codespaces        | `yarn build:codespaces`. Build with codespace options         |

## Building `vets-website`

### Building applications

`vets-website` uses [Webpack](https://webpack.js.org) to bundle application
assets.

To **build all applications**, run the following:

```sh
yarn build
```

To **build one or more applications**, you can use the `--entry` option:

```sh
yarn build --entry=static-pages,auth
```

To **recompile your application when you make changes**, run:

```sh
yarn watch
```

Stylelint is disabled by default in watch to improve performance. To enable it, pass:

```sh
yarn watch --env stylelint=true
```

You can also **limit the applications Webpack builds** with `--env entry`:

```sh
yarn watch --env entry=static-pages,auth
```

The `entryname` for your application can be found in its `manifest.json` file.

If you're developing a feature that requires the API, but can't or don't want to
run it locally, you can specify `--env api`:

```sh
yarn watch --env api=https://dev-api.va.gov
```

You will need to disable CORS in your browser when using a non-local API. Here are some helpful links that explain how to do this:

- https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome
- https://stackoverflow.com/questions/4556429/disabling-same-origin-policy-in-safari

**Note:** If you try to log on, ID.me will redirect you to the environment that
the API is set up for. So in the above example, you'd be **redirected back to
dev.va.gov.**

### Building static content

Static pages are created from the [content-build](https://github.com/department-of-veterans-affairs/content-build) repository. See the [building static content](https://github.com/department-of-veterans-affairs/content-build#building-static-content) documentation.

### Building both together

After [building the applications](#building-applications), running `yarn build` in the `../content-build` directory will build content using the generated app bundles from `vets-website/build/localhost/generated`. The full build can be seen in `../content-build/build/localhost`.

## Working in GitHub Codespaces

[Read the Codespaces documentation for this repository](https://depo-platform-documentation.scrollhelp.site/developer-docs/Using-GitHub-Codespaces.1909063762.html#UsingGitHubCodespaces-Codespacesinvets-websiteandcontent-buildrepositories).

## Running tests

### Unit tests

To **run all unit tests**, use:

```sh
yarn test:unit
```

If you want to **run only one test file**, you can provide the path to it:

```sh
yarn test:unit src/applications/path/to/test-file.unit.spec.js
```

To **run all tests for a folder in src/applications**, you can use app-folder:

```sh
yarn test:unit --app-folder hca
```

To **run all tests in a directory**, you can use a glob pattern:

```sh
yarn test:unit src/applications/path/to/tests/**/*.unit.spec.js*
```

To **run tests with stack traces**, pass log-level `trace`:

```sh
yarn test:unit --log-level trace
```

To **run tests with coverage output**, you can pass the coverage option:

```sh
yarn test:unit --coverage
```

To **run tests with coverage and open the coverage report in your browser for a specific app** from `src/applications`:

```sh
yarn test:coverage-app {app-name}
```

For **help with test runner usage**, you can run:

```sh
yarn test:unit --help
```

### End-to-end (E2E) / Browser tests

- E2E or browser tests run in Cypress.

**Before running Cypress tests**, first make sure that:

1. `vets-website` is served locally on port 3001
   - You can do this with `yarn watch`
1. `vets-api` is **NOT** running
   - Any required APIs will be mocked by the Cypress test that needs them.

To **open the Cypress test runner UI and run any tests within it**:

```sh
yarn cy:open
```

To **open the Cypress test runner UI in Codespaces and run any tests within it**:

```sh
yarn cy:open-codespaces
```

Then visit http://localhost:6080/ and log in with the password `vscode`.

To **run Cypress tests from the command line**:

```sh
yarn cy:run
```

To **run specific Cypress tests from the command line**:

```sh
# Running one specific test.
yarn cy:run --spec "path/to/test-file.cypress.spec.js"

# Running multiple specific tests.
yarn cy:run --spec "path/to/test-a.cypress.spec.js,path/to/test-b.cypress.spec.js"

# Running tests that match a glob pattern.
yarn cy:run --spec "src/applications/my-app/tests/*"
yarn cy:run --spec "src/applications/my-app/tests/**/*"

# Running tests that match multiple glob patterns.
yarn cy:run --spec "src/applications/a/tests/**/*,src/applications/b/tests/**/*"
```

To **run Cypress tests from the command line on a specific browser**:

```sh
yarn cy:run --browser chrome
yarn cy:run --browser firefox
```

To **run Cypress tests with reports**

```sh
yarn cy:run:localreports my-app-folder
```

Examples:

- `yarn cy:run:localreports appeals/995`
- `yarn cy:run:localreports ask-a-question`

Afterward, check `/mochawesome-report` contents.

**For other options with `yarn cy:run`,** [the same options for `cypress run` are applicable](https://docs.cypress.io/guides/guides/command-line.html#Commands).

### Debugging Node 22 CI failures

If your PR passes tests locally but fails the Node 22 compatibility check in CI, you can reproduce the issue locally:

```sh
# Switch to Node 22
nvm use 22
# OR install if you don't have it
nvm install 22 && nvm use 22

# Create a temporary branch from the Node 22 test branch
git checkout -b temp-test-node22 origin/node-22-bug-bash-testing

# Merge your feature branch into it (this replicates what CI does)
git merge your-feature-branch

# Install dependencies
yarn install-safe

# Run the failing test
yarn test:unit path/to/failing/test.unit.spec.jsx

# Make fixes to the test file(s) until tests pass

# Switch back to your feature branch
git checkout your-feature-branch

# Switch back to Node 14 for normal development
nvm use 14

# Apply the fixes (cherry-pick the commit or manually copy changes)
git cherry-pick <commit-hash-of-fix>

# Push your feature branch with the fixes
git push origin your-feature-branch

# Clean up temporary branch (optional)
git branch -D temp-test-node22
```

**Note:** The Node 22 branch uses happy-dom instead of jsdom, which can cause different behavior in tests, particularly with sessionStorage, web components, and async operations.

## Running a mock API for local development

In separate terminal from your local dev server, run

```sh
yarn mock-api --responses path/to/responses.js
```

See the [mocker-api usage
documentation](https://github.com/jaywcjlove/mocker-api#usage) for how to use
the `responses.js`.

**If you need to log in**, go to your browser dev tools console and enter
`localStorage.setItem('hasSession', true)` and refresh the page. This will then
trigger a `/v0/user` call, which will then get the mocked response of a logged-in
user. (Assuming you've mocked that response, of course.)

Responses to common API requests, such as `/v0/user` and
`/v0/maintenance_windows`, you can use
[`src/platform/testing/local-dev-mock-api/common.js`](src/platform/testing/local-dev-mock-api/common.js)

```javascript
const commonResponses = require('src/platform/testing/local-dev-mock-api/common');

module.exports = {
  ...commonResponses,
  'GET path/to/endpoint': { foo: 'bar' },
};
```

## More commands

After a while, you may run into a less common task. We have a lot of commands
for doing very specific things.

| I want to...                                                                                                | Then you should...                                                                                                                                                                                                                        |
| :---------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| build the production site (dev features disabled).                                                          | `yarn build:production`                                                                                                                                                                                                                   |
| deploy the production site (dev features disabled).                                                         | `node src/platform/testing/e2e/test-server.js --buildtype=vagovprod`                                                                                                                                                                      |
| reset local environment (clean out node modules, Babel cache, and runs `npm install`)                       | `yarn reset:env`                                                                                                                                                                                                                          |
| run the app pages on the site for local development                                                         | `yarn watch --env scaffold`                                                                                                                                                                                                               |
| run the site for local development with automatic rebuilding of Javascript and sass **with** css sourcemaps | `yarn watch:css-sourcemaps` then visit `http://localhost:3001/`. You may also set `--env buildtype` and `NODE_ENV` though setting `NODE_ENV` to production will make incremental builds slow.                                             |
| run the site for local development with automatic rebuilding of code and styles for specific **apps**       | `yarn watch --env entry=disability-benefits,static-pages`. Valid application names are in each app's `manifest.json` under `entryName`                                                                                                    |
| run the site so that devices on your local network can access it                                            | `yarn watch --env host=0.0.0.0 --env public=192.168.x.x:3001` Note that we use CORS to limit what hosts can access different APIs, so accessing with a `192.168.x.x` address may run into problems                                        |
| run the site so that it can be accessed from a public codespaces URL                                        | `yarn watch --env api=https://${CODESPACE_NAME}-3000.app.github.dev public=https://${CODESPACE_NAME}-3001.app.github.dev` (only works from a codespaces terminal with mocks running and public port visibility)                           |
| watch file changes without starting the server                                                              | `yarn watch:no-server`                                                                                                                                                                                                                    |
| run all unit tests and watch                                                                                | `yarn test:watch`                                                                                                                                                                                                                         |
| run only E2E tests (headless)                                                                               | Make sure the site is running locally (`yarn watch`) and run the tests with `yarn cy:run`                                                                                                                                                 |
| run only E2E tests (headless) in Codespaces                                                                | Make sure the site is running locally (`yarn watch`) and set up virtual display: `export DISPLAY=:99 && Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &` then run `export DISPLAY=:99 && yarn cy:run`        |
| run E2E tests in the browser                                                                                | `yarn cy:open`                                                                                                                                                                                                                            |
| count all Cypress E2E specs                                                                                 | `yarn cy:count`                                                                                                                                                                                                                           |
| run all linters                                                                                             | `yarn lint`                                                                                                                                                                                                                               |
| run only javascript linter                                                                                  | `yarn lint:js`                                                                                                                                                                                                                            |
| run only sass linter                                                                                        | `yarn lint:sass`                                                                                                                                                                                                                          |
| run lint on JS and fix anything that changed                                                                | `yarn lint:js:changed:fix`                                                                                                                                                                                                                |
| add new npm modules                                                                                         | `yarn add my-module`. Use the `--dev` flag for modules that are build or test related.                                                                                                                                                    |
| get the latest json schema                                                                                  | `yarn update:schema`. This updates our [`vets-json-schema`](https://github.com/department-of-veterans-affairs/vets-json-schema) to the most recent commit.                                                                                |
| check test coverage                                                                                         | `yarn test:coverage`                                                                                                                                                                                                                      |
| run [statoscope](https://github.com/statoscope/statoscope) on your app                                      | `yarn build-analyze-app static-pages`                                                                                                                                                                                                                       |
| add a new React app                                                                                         | `yarn new:app` (make sure you have [`vagov-content`](https://github.com/department-of-veterans-affairs/vagov-content/) and [`content-build`](https://github.com/department-of-veterans-affairs/content-build/) sibling to `vets-website`) |

## Supported Browsers

| Browser                   | Minimum version | Note                                   |
| :------------------------ | :-------------: | :------------------------------------- |
| Internet Explorer         |       11        |                                        |
| Microsoft Edge            |       13        |                                        |
| Safari / iOS Safari       |        9        |                                        |
| Chrome / Android Web view |       44        | _Latest version with >0.5% of traffic_ |
| Firefox                   |       52        | _Latest version with >0.5% of traffic_ |

## API Keys

In order to work with the Facility Locator locally, you will need a Mapbox API key with dev access. see [this link](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/working-with-vsp/policies-work-norms/sensitive-guidance.md) for details on handling non public keys and tokens. You will need to access the paramater store within AWS Systems manager, and get the dev mapbox token from this location: /dsva-vagov/vets-website/dev/mapbox_token.

Create a .env file in the root of vets-website, and assign the above token to a variable called MAPBOX_TOKEN. The .env file should already be configured to work with dotenv for webpack. Ensure that the .env file is in .gitigore and take care not to expose this token in any public commits. See [this link](https://github.com/department-of-veterans-affairs/va.gov-team/issues/new?assignees=&labels=external-request%2Coperations%2Cops-access-request&template=aws-access-request.yml&title=AWS+access+for+%5Bindividual%5D) for instructions on requesting AWS access.

## Additional Resources

1. [Frontend developer documentation home](https://depo-platform-documentation.scrollhelp.site/developer-docs/frontend-developer-documentation)
1. [Manual](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/accessibility/testing/508-manual-testing.md) and [Automated](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/accessibility/testing/508-automated-testing.md) 508 Testing
1. [Using yarn Workspaces](https://depo-platform-documentation.scrollhelp.site/developer-docs/yarn-workspaces)

## Not a member of the repository and want to be added?

- If you're on a VA.gov Platform team, contact your Program Manager.
- If you're on a VFS team, you must complete [Platform Orientation](https://depo-platform-documentation.scrollhelp.site/getting-started/platform-orientation) to be added to this repository. This includes completing your Platform Orientation ticket(s) in GitHub.
