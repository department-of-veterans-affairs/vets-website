### General information

#### Where they live
- Test directory contains all of the test code
  - Configuration and helpers for test libraries live under `test/util/`, minus a few files that live directly under `test/`
  - Unit tests and e2e tests live under each project directory
  - Helpers for e2e tests are under `test/e2e/`
  - Visual regression test config has it's own directory under `test/visual-regression`
- Test commands are specified in `package.json`, as well as in vets-website's `README.md`
- Configuration files for nightwatch and sass-lint live under `config/`
- Scripts for running nightwatch tests live under `script/`

#### When they run/ how they run
There are 5 times tests can run:
1. At any time during local development by running one of the npm scripts specified in `package.json`
  - Any tests can be run during this time
2. During the pre-commit hook
  - Only linting is run automatically
3. Before merging a branch to master via Jenkins
  - Unit tests, e2e tests, and code climate are automatically run during this time
4. Before merging a branch to production via Jenkins
  - Accessibility tests are automatically run during this time
5. After merging to production (this is planned for removal)
  - Unit tests and e2e tests are run automatically

#### How to debug
For unit tests:
- You can put a console.log in your test code. When you run the test, the output will be in the command line.
- Use Chrome devtools to debug unit tests
- VSCode's (or any other editor's) debugging tool for mocha tests
- Karma has some pretty great tools for running your tests in a browser so that you can set breakpoints and see the test execute. But we're not using Karma in vets-website, so if we wanted this functionality we would have to add it.

For e2e tests:
- It's possible to set an infinite pause (`.pause()`) in the test code and then see what's happening at a given point in the browser where the test is running. It is also possible to use the Chrome devtools and inspect what's going on (this is only possible when the browser is Chrome and not Electron, so you would need to disable Electron is `config/nightwatch.js`).


#### When we write them
Write tests as you go! New functionality added in a PR should ideally be covered by unit and e2e tests, where applicable.


### Libraries

1. Test environment
- **mocha**: testing framework

2. Test structure
- **mocha**: testing framework

3. Assertion functions
- **chai**: assertion library, can be used with an JS testing framework
- **chai-as-promised**: includes assertions for promises

4. Test utilities/helpers
- **enzyme**: testing utility for React, use in place of React test-utils
- **enzyme-adapter-react-15**
- **fs**: makes file system operations easier
- **lodash**: library with utility functions for commonly used tasks, using functional programming
- **moment**: library for parsing, manipulating, and displaying dates and times in JS
- **path**: utilities for working with file and directory paths
- **react-dom**: used for findDOMNode
- **react-dom/test-utils**: test utilities for React components, being replaced by Enzyme
- **skin-deep**: test helpers using React's shallowRender

5. Display and watch test results
- **mocha**: testing framework

6. Mocks, spies, stubs
- **sinon**: test spies, stubs, and mocks

7. Browser environment
- **chromedriver**: a server that links the browser (Chrome) to the test driver (Selenium), enabling you to execute actions in the browser through a test
- **jsdom**: JS headless browser that creates a realistic testing environment with a DOM to which elements can be mounted
- **nightwatch**: Node.js framework for e2e tests that runs on a selenium server
- **saucelabs**: automated cross-browser testing, allows you to run tests on a server
- **selenium-server**: automates browsers

8. Linting
- **eslint**: for linting purposes
- **eslint-config-airbnb**: Airbnb's lint rules
- **eslint-plugin-jsx-a11y**: catches potential accessibility issues
- **eslint-plugin-no-unsafe-innerhtml**: catches potential security vulnerabilities
- **eslint-plugin-react**: React specific linting rules
- **eslint-plugin-scanjs-rules**: static analysis of JS code
- **sass-lint**: linter for sass and scss

9. Visual regression testing
- **puppeteer**: Automates browser testing
- **resemble**: Image analysis

10. Accessibility testing
- **axe-core**: automated accessibility testing

11. Original libraries
- **jsonschema**: JSON Schema specification
- **react**: JS front-end framework
- **react-jsonschema-form**: react-jsonschema-form library
- **react-test-renderer**: renders React components to pure JavaScript objects


### Questions

1. How does jsdom fit into our testing environment?

Our unit tests are run on Node as opposed to in a browser. The benefit of this is that the tests run much faster. The downside is that we aren't provided with a window or DOM upon which to make calls or append elements. This will break ReactTestUtil's `simulate()` calls. To remedy, a fake window and document are provided using jsdom and bootstrapped in `test/util/mocha-setup.js`, which is required via `test/mocha.opts`.

2. Why Electron?

At the time we implemented Electron (Jan 2017), it was faster to run the e2e tests in Electron than in PhantomJS, which is what we were using before. However, there are some downsides to using Electron:
- It is harder to debug tests (no access to devtools)
- There are some known issues with resizing the window to test at different widths

Possible solutions:
- Offer a command line option to run the e2e tests either with Electron or just using Chrome's webdriver, as opposed to having to make a configuration change
- The headless option might be faster than Electron now (Jan 2018); investigate this further

3. Why Saucelabs?

Saucelabs was originally added to be used on a merge to production, for one-off testing situations, or for running tests on different window sizes and browsers. However, it was a huge lift to make this possible and is very difficult to get all tests to pass everywhere.

One benefit of Saucelabs is that it can be used to test on specific browsers to debug a problem. However, Browserstack may be easier to use for this. Automated testing is better supported in Saucelabs, but manual testing is easier to do in Browserstack.

4. How do we do accessibility testing?

We use both manual tests (VoiceOver, typically) and automated tests (using aXe).

NVDA another option for manual testing and is supposed to be a better tool than VoiceOver, but it is only available on Windows. It would be a huge lift to get NVDA set up using Browserstack or some other virtual environment.

5. How do you measure code coverage?

It is possible to measure code coverage by running the command line script `npm run test:coverage`.

We are planning to turn off code climate, which is currently run before merging to master during the PR review stage. However, it might be useful to replace it with something like coveralls in order to more consistently measure our code coverage with each addition of code.

6. How to use visual regression tests

Visual regression tests work by creating a baseline and then comparing screenshots against that master. The baseline images can be found at `logs/visual-regression/baseline/`, and the diffs (if any) can be found at `logs/visual-regression/diffs`.

Any part of the image that is pink is a visual change (including colors).


