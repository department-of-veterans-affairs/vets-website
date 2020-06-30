# VA.gov [![Build Status](https://dev.vets.gov/jenkins/buildStatus/icon?job=testing/vets-website/master)](http://jenkins.vetsgov-internal/job/testing/job/vets-website/job/master/)

## What is this?

This is the front end repository for VA.gov. It contains application code and templates used across the site.

There are several repositories that contain the code and content used to build VA.gov. If you're looking to get started running VA.gov locally, you should read the [Getting Started](https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/getting-started) documentation.

## Common commands

Once you have the site set up locally, these are some common commands you might find useful:

| I want to...                                  | Then you should...                                       |
| ----------------------------------------      | ----------------------------------------                 |
| fetch all dependencies                        | `yarn install`; run this any time `package.json` changes |
| build both static HTML pages and applications | `yarn build`                                             |
| run the webpack dev server                    | `yarn watch`                                             |


## Building `vets-website`
The `vets-website` build has two main functions:
1. Build the application assets (JS, CSS)
1. Create the static HTML pages

### Building applications
`vets-website` uses [Webpack](https://webpack.js.org) to bundle application
assets.

To **build all applications**, run the following:

``` sh
yarn build:webpack
```

To **recompile your application when you make changes**, run:

``` sh
yarn watch
```

You can also **limit the applications Webpack builds** with `--env.entryname`:

``` sh
yarn watch --env.entryname static-pages,auth
```

The `entryname` for your application can be found in its `manifest.json` file.

If you're developing a feature that requires the API, but can't or don't want to
run it locally, you can specify `--env.api`:

``` sh
yarn watch --env.api https://dev-api.va.gov
```

**Note:** If you try to log on, ID.me will redirect you to the environment that
the API is set up for. So in the above example, you'd be **redirected back to
dev.va.gov.**

### Building static content
VA.gov is a static site with individual applications served up on certain pages.
When testing changes to static pages, or to see what your application looks like
on VA.gov, you'll need to build the static pages.

``` sh
yarn build:content
```

**Pro tip:** To see the same landing page for your application as what will be
on VA.gov, run `yarn build:content` once to build the static HTML files, then
`yarn watch` to watch for changes in your application and serve the site via
`webpack-dev-server`. Any time run `yarn build:webpack` or `yarn watch`, the
static HTML pages from the `build:content` task will not be overwritten.

To **pull the latest Drupal content**, run:

``` sh
yarn build:content --pull-drupal
```

**Note:** This requires access to the SOCKS proxy. If you do not have access to
the proxy, you can **fetch the latest cached version of the content** with the
following:

``` sh
yarn fetch-drupal-cache
```

### Building both together
CI will build both applications and content with the following:

``` sh
yarn build
```

## Running tests

### Unit tests
To **run all unit tests,** use:

``` sh
yarn test:unit
```

If you want to **run only one test file**, you can provide the path to it:

``` sh
yarn test:unit src/applications/path/to/test-file.unit.spec.js
```

To **run all tests in a directory**, you can use a glob pattern:

``` sh
yarn test:unit src/applications/path/to/tests/**/*.unit.spec.js*
```

### Browser tests
To **run all browser tests**, you first need three things:
1. Install the Java JDK on MacOS:
    ```
    brew update
    brew tap adoptopenjdk/openjdk
    brew cask install adoptopenjdk8
    ```
1. `vets-website` served locally on port 3001
    - You can do this with `yarn watch`
1. `vets-api` to **NOT** be running
    - The browser tests will use a simple mock api on port 3000, but only if
      nothing is already attached to that port

``` sh
yarn test:e2e
```

Just like with unit tests, you can also **specify the path to the test file**

``` sh
yarn test:e2e src/applications/path/to/test-file.e2e.spec.js
```

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

``` javascript
const commonResponses = require('src/platform/testing/local-dev-mock-api/common');

module.exports = {
  ...commonResponses,
  'GET path/to/endpoint': { foo: 'bar' },
};
```

## More commands

After a while, you may run into a less common task. We have a lot of commands
for doing very specific things.

| I want to...                                                                                                | Then you should...                                                                                                                                                                                                           |
| ----------------------------------------                                                                    | ----------------------------------------                                                                                                                                                                                     |
| build the production site (dev features disabled).                                                          | `NODE_ENV=production yarn build --buildtype vagovprod`                                                                                                                                                                       |
| fetch the latest content cache from S3                                                                      | `yarn fetch-drupal-cache` (does not require SOCKS proxy access)                                                                                                                                                              |
| reset local environment (clean out node modules and runs npm install)                                       | `yarn reset:env`                                                                                                                                                                                                             |
| run only the app pages on the site for local development without building content.                          | `yarn watch --env.scaffold`                                                                                                                                                                                                  |
| run the site for local development with automatic rebuilding of Javascript and sass **with** css sourcemaps | `yarn watch:css-sourcemaps` then visit `http://localhost:3001/`. You may also set `--env.buildtype` and `NODE_ENV` though setting `NODE_ENV` to production will make incremental builds slow.                                |
| run the site for local development with automatic rebuilding of code and styles for specific **apps**       | `yarn watch --env.entry disability-benefits,static-pages`. Valid application names are in each app's `manifest.json` under `entryName`                                                                                       |
| run the site for local development with automatic rebuilding of code and styles for static **content**      | `yarn watch:static`                                                                                                                                                                                                          |
| run the site so that devices on your local network can access it                                            | `yarn watch --env.host 0.0.0.0 --env.public 198.162.x.x:3001` Note that we use CORS to limit what hosts can access different APIs, so accessing with a `192.168.x.x` address may run into problems                           |
| run all unit tests and watch                                                                                | `yarn test:watch`                                                                                                                                                                                                            |
| run only e2e tests                                                                                          | Make sure the site is running locally (`yarn watch`) and run the tests with `yarn test:e2e`                                                                                                                                  |
| run e2e tests in headless mode                                                                              | `yarn test:e2e:headless`                                                                                                                                                                                                     |
| run all linters                                                                                             | `yarn lint`                                                                                                                                                                                                                  |
| run only javascript linter                                                                                  | `yarn lint:js`                                                                                                                                                                                                               |
| run only sass linter                                                                                        | `yarn lint:sass`                                                                                                                                                                                                             |
| run lint on JS and fix anything that changed                                                                | `yarn lint:js:changed:fix`                                                                                                                                                                                                   |
| run automated accessibility tests                                                                           | `yarn build && yarn test:accessibility`                                                                                                                                                                                      |
| run visual regression testing                                                                               | Start the site. Generate your baseline image set using `yarn test:visual:baseline`. Make your changes. Then run `yarn test:visual`.                                                                                          |
| test for broken links                                                                                       | Build the site. Broken Link Checking is done via a Metalsmith plugin during build. Note that it only runs on *build* not watch.                                                                                              |
| add new npm modules                                                                                         | `yarn add my-module`. Use the `--dev` flag for modules that are build or test related.                                                                                                                                       |
| get the latest json schema                                                                                  | `yarn update:schema`. This updates our [vets-json-schema](https://github.com/department-of-veterans-affairs/vets-json-schema) vets-json-schema https://github.com/department-of-veterans-affairs/ to the most recent commit. |
| check test coverage                                                                                         | `yarn test:coverage`                                                                                                                                                                                                         |
| run bundle analyzer on our production JS bundles                                                            | `yarn build-analyze`                                                                                                                                                                                                         |
| generate a stats file for analysis by bundle analyzer                                                       | `NODE_ENV=production yarn build:webpack --env.buildtype=vagovprod --env.analyzer`. Note that if you get an error like `FetchError: request to http://prod.cms.va.gov/graphql failed` you need to be on the SOCKS proxy       |
| load the analyzer tool on a stats file                                                                      | `yarn analyze`                                                                                                                                                                                                               |
| add a new React app                                                                                         | `yarn new:app` (make sure you have [`vagov-content`](https://github.com/department-of-veterans-affairs/vagov-content/) sibling to `vets-website`)                                                                            |





## Supported Browsers

| Browser                   | Minimum version | Note                                   |
| ------------------------- | --------------- | -------------------------------------- |
| Internet Explorer         | 11              |                                        |
| Microsoft Edge            | 13              |                                        |
| Safari / iOS Safari       | 9               |                                        |
| Chrome / Android Web view | 44              | _Latest version with >0.5% of traffic_ |
| Firefox                   | 52              | _Latest version with >0.5% of traffic_ |

## Additional Resources

1. [VA.gov Knowledge Hub](https://department-of-veterans-affairs.github.io/va.gov-team/)
1. [Docs Directory](./docs)
1. [Manual](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/accessibility/testing/508-manual-testing.md) and [Automated](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/accessibility/testing/508-automated-testing.md) 508 Testing
