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
There are 4 times tests can run:
1. At any time during local development by running one of the npm scripts specified in `package.json`
  - Any tests can be run during this time
2. During the pre-commit hook
  - Only linting is run automatically
3. Before merging a branch to master via Jenkins
  - Unit tests, e2e tests, and code coverage are automatically run during this time
4. Before merging a branch to production via Jenkins
  - Accessibility tests are automatically run during this time

#### How to debug
For unit tests:
- You can put a console.log in your test code. When you run the test, the output will be in the command line.
- Karma has some pretty great tools for running your tests in a browser so that you can set breakpoints and actually see the test execute. But we're not using Karma in vets-website, so if we wanted this functionality we would have to add it.

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

7. Code coverage reports

8. Browser environment
- **chromedriver**: a server that links the browser (Chrome) to the test driver (Selenium), enabling you to execute actions in the browser through a test
- **electron-prebuilt**: provides a headless browser to run nightwatch tests on, supposedly faster than using Chrome
- **jsdom**: JS headless browser that creates a realistic testing environment with a DOM to which elements can be mounted
- **nightwatch**: Node.js framework for e2e tests that runs on a selenium server
- **saucelabs**: automated cross-browser testing, allows you to run tests on a server
- **selenium-server**: automates browsers

9. Linting
- **eslint**: for linting purposes
- **eslint-config-airbnb**: Airbnb's lint rules
- **eslint-plugin-jsx-a11y**: catches potential accessibility issues
- **eslint-plugin-no-unsafe-innerhtml**: catches potential security vulnerabilities
- **eslint-plugin-react**: React specific linting rules
- **eslint-plugin-scanjs-rules**: static analysis of JS code
- **sass-lint**: linter for sass and scss

10. Visual regression testing
- **nightwatch**: Node.js framework for e2e tests that runs on a selenium server
- **resemble**: Image analysis

11. Accessibility testing
- **axe-core**: automated accessibility testing

12. Original libraries
- **jsonschema**: JSON Schema specification
- **react**: JS front-end framework
- **react-jsonschema-form**: react-jsonschema-form library
- **react-test-renderer**: renders React components to pure JavaScript objects


### Questions

1. How does jsdom fit into our testing environment?

Copied from README: 

Unittests are done via mocha with the chai assertion library run directly via the mocha test runner without going through karma or PhantomJS. This means they run very fast.

Unfortunately, it also means there is no true window or document provided which breaks ReactTestUtils's simulate calls. To rememdy, a fake window and document are provided using jsdom and bootstrapped in test/util/mocha-setup.js which is required via test/mocha.opts

2. Why Electron?

At the time we implemented it, it was supposedly faster to run the e2e tests in Electron than just using Nightwatch and Chrome. But it is also much harder to debug.

3. Does anyone ever use Saucelabs to run the tests?
