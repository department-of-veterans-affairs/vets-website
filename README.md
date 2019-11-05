# VA.gov [![Build Status](https://dev.vets.gov/jenkins/buildStatus/icon?job=testing/vets-website/master)](http://jenkins.vetsgov-internal/job/testing/job/vets-website/job/master/)

## What is this?

This is the front end repository for VA.gov. It contains application code and templates used across the site.

There are several repositories that contain the code and content used to build VA.gov. If you're looking to get started running VA.gov locally, you should read the [Getting Started](https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/getting-started) documentation.

## Common commands

Once you have the site set up locally, these are some common commands you might find useful:

| I want to...                             | Then you should...                       |
| ---------------------------------------- | ---------------------------------------- |
| fetch all dependencies                   | `yarn install`; run this any time `package.json` changes |
| Use the git hooks provided               | You can either copy the hooks as-is right now with `cp script/hooks/* .git/hooks` or make sure your git hooks by using a symbolic link to the hooks distributed with vets-website with `rm -rf .git/hooks && ln -s ../script/hooks .git/hooks`. On Linux, you may have to do `ln -rs` instead of just `-s`. |
| build the site with dev features enabled. | `npm run build`                          |
| build the production site (dev features disabled). | `NODE_ENV=production npm run build -- --buildtype vagovprod` Note the extra `--` is required otherwise npm eats the buildtype argument instead of passing it on. |
| build the site with the latest content from Drupal | `npm run build -- --pull-drupal` (requires SOCKS proxy access) |
| fetch the latest content cache from S3 | `npm run fetch-drupal-cache` (does not require SOCKS proxy access) |
| reset local environment (clean out node modules and runs npm install) | `npm run reset:env`                      |
| run the site for local development with automatic rebuilding of Javascript and sass without css sourcemaps | `npm run watch` then visit `http://localhost:3001/`. You may also set `buildtype` and `NODE_ENV` though setting `NODE_ENV` to production will make incremental builds slow. CSS sourcemaps are off by default to avoid an issue that causes the default watch task to crash after rebuilding |
| run the site for local development with automatic rebuilding of Javascript and sass with css sourcemaps| `npm run watch:css-sourcemaps` then visit `http://localhost:3001/`. You may also set `buildtype` and `NODE_ENV` though setting `NODE_ENV` to production will make incremental builds slow. |
| run the site for local development with automatic rebuilding of code and styles for specific apps | `npm run watch -- --entry disability-benefits,static-pages`. Valid application names are in each app's `manifest.json` under `entryName` |
| run the site for local development with automatic rebuilding of code and styles for static content | `npm run watch:static`. This is equivalent to running `npm run watch -- --entry static-pages` |
| run the site so that devices on your local network can access it  | `npm run watch -- --host 0.0.0.0 --public 198.162.x.x:3001` Note that we use CORS to limit what hosts can access different APIs, so accessing with a `192.168.x.x` address may run into problems |
| run all tests | `npm run test` |
| run only unit tests | `npm run test:unit` |
| run all unit tests and watch | `npm run test:watch` |
| run only unit tests for a subset of tests | `npm run test:unit -- path/to/my/test.unit.spec.jsx` <br> or <br> `npm run test:unit -- src/applications/disability-benefits/686/tests/**/*.unit.spec.js*` |
| run only e2e tests | Make sure the site is running locally (`npm run watch`) and run the tests with `npm run test:e2e` |
| run only e2e tests for a subset of tests | Make sure the site is running locally (`npm run watch`) and run the desired tests with `npm run test:e2e -- src/applications/edu-benefits/tests/1995/*.e2e.spec.js` (provide file paths) |
| run e2e tests in headless mode           | `npm run test:e2e:headless`              |
| run all linters                          | `npm run lint`                           |
| run only javascript linter               | `npm run lint:js`                        |
| run only sass linter                     | `npm run lint:sass`                      |
| run lint on JS and fix anything that changed | `npm run lint:js:changed:fix`      |
| run automated accessibility tests        | `npm run build && npm run test:accessibility` |
| run visual regression testing            | Start the site. Generate your baseline image set using `npm run test:visual:baseline`. Make your changes. Then run `npm run test:visual`.  |
| test for broken links                    | Build the site. Broken Link Checking is done via a Metalsmith plugin during build. Note that it only runs on *build* not watch. |
| add new npm modules                      | `yarn add my-module`. Use the `--dev` flag for modules that are build or test related. |
| get the latest json schema               | `npm run update:schema`. This updates our [vets-json-schema](https://github.com/department-of-veterans-affairs/vets-json-schema) vets-json-schema https://github.com/department-of-veterans-affairs/ to the most recent commit. |
| check test coverage                      | `npm run test:coverage`                  |
| run bundle analyzer on our production JS bundles | `npm run build-analyze`                  |
| generate a stats file for analysis by bundle analyzer | `NODE_ENV=production npm run build -- --buildtype=vagovprod --analyzer`. Note that if you get an error like `FetchError: request to http://prod.cms.va.gov/graphql failed` you need to be on the SOCKS proxy                  |
| load the analyzer tool on a stats file  | `npm run analyze`                  |
| add a new React app | `npm run new:app` (make sure you have [`vagov-content`](https://github.com/department-of-veterans-affairs/vagov-content/) sibling to `vets-website`) |

## Supported Browsers

| Browser                   | Minimum version | Note                                   |
| ------------------------- | --------------- | -------------------------------------- |
| Internet Explorer         | 11              |                                        |
| Microsoft Edge            | 13              |                                        |
| Safari / iOS Safari       | 9               |                                        |
| Chrome / Android Web view | 44              | _Latest version with >0.5% of traffic_ |
| Firefox                   | 52              | _Latest version with >0.5% of traffic_ |
