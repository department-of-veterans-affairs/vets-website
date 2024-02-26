----
# We're moving our docs!
### Find [the latest version of this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/Cypress-Form-Tester.1870331957.html) on the Platform website.
### Still can't find what you're looking for? Reach out to [#vfs-platform-support](https://dsva.slack.com/archives/CBU0KDSB1) on Slack.

----
# Cypress Form Tester

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
   1. [`createTestConfig`](#createtestconfig)
   2. [Settings](#settings)
      1. [`appName`](#appname-required)
      2. [`arrayPages`](#arraypages-optional)
      3. [`dataPrefix`](#dataprefix-optional)
      4. [`dataDir`](#datadir-required)
      5. [`dataSets`](#datasets-required)
      6. [`fixtures`](#fixtures-deprecated)
      7. [`pageHooks`](#pagehooks-required)
      8. [`rootUrl`](#rooturl-required)
      9. [`setup`](#setup-optional)
      10. [`setupPerTest`](#setuppertest-optional)
      11. [`skip`](#skip-optional)
3. [Aliases](#aliases)
  1. [`arrayPages`](#arraypages)
  2. [`pageHooks`](#pagehooks)
  3. [`testData`](#testdata)
4. [Sample Code](#sample-code)

## Overview

The form tester is a utility that automates Cypress end-to-end (E2E) tests on a VA.gov form app, which is an application built using the forms system.

It automatically fills out forms using data from JSON files that represent the body of the API request that's sent upon submitting the form.

It's invoked as a function (`testForm`) that requires a configuration object (test config) as its only argument.

```js
// some-form-app.cypress.spec.js

import testForm from 'platform/testing/e2e/cypress/support/form-tester';

const testConfig = { ... };
testForm(testConfig);
```

See some [sample code](#sample-code) as a reference for your own test.

## Configuration

The test config has settings or properties that are summarized by this typedef:

```js
@typedef {Object} TestConfig

@property {string} appName - Name of the app (form) to describe the test.

@property {Object[]} [arrayPages] - Objects that represent array pages
    in the form. For matching array pages to their corresponding test data.

@property {string} [dataPrefix] - The path prefix for accessing nested
    test data. For example, if the test data looks like
    { data: { field1: 'value' } }, dataPrefix should be set to 'data'.

@property {string} dataDir - Path to test data directory.

@property {string[]} dataSets - Test data file paths relative to dataDir.
    A test is generated for each data set and uses that data to fill out fields.

@property {Object.<function>} [pageHooks] - Functions (hooks) that override
    the automatic form filling on specified pages. Each object key is the
    URL of the page that triggers the corresponding hook.

@property {string} rootUrl - The URL of the form.

@property {function} [setup] - Function that's called once before starting any
    tests in the spec module. Corresponds to the before (all) hook.

@property {function} [setupPerTest] - Function that's called before each test.

@property {(boolean|string[])} [skip] - Skips specific tests if it's an array
    that contains the test names as strings. Skips the whole suite
    if it's otherwise truthy.
```

### `createTestConfig`

There is a convenient helper function (`createTestConfig`) that will automatically fill in certain settings (`appName`, `arrayPages`, `rootUrl`) based on the app's manifest and form config.

When using this helper, it won't be necessary to explicitly define those settings.

Using `createTestConfig` is recommended, as it will keep your test lean and consistent with other configs.

```js
// some-form-app.cypress.spec.js

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

// `appName`, `arrayPages`, and `rootUrl` don't need to be explicitly defined.
const testConfig = createTestConfig({
  dataPrefix: 'data',
  dataSets: [ ... ],
  fixtures: {
    data: path.join(__dirname, 'data'),
  },
  pageHooks: { ... },
}, manifest, formConfig)

testForm(testConfig);
```

### Settings

#### `appName` (required)

This describes the form being tested and will be the label for the top level `describe` block in the test.

It can technically be defined as any string you'd like, but it's recommended to have it correspond to the `appName` from the app's `manifest.json`. The easy way to ensure this is to use `createTestConfig`.

#### `arrayPages` (optional)

This is an array of objects that correspond to the array pages defined in the form config. Each of these objects have two properties:

1. `arrayPath`, which is the `arrayPath` for the page from the form config
2. `regex`, which is a regex pattern based on the `path` for the page from the form config

When the test gets to an array page (matched by the `regex`), it uses `arrayPath` to look up the appropriate data to fill out the page's fields.

**Although this is technically an optional setting, it's required in order to pass tests that involve filling out array pages.**

It's recommended to use `createTestConfig` to automatically generate the values for this setting.

#### `dataPrefix` (optional)

The data that's used to fill out the form may have a structure where the actual data is buried under a path.

In addition to the example from the `typedef`, consider data that's structured like this:

```json
{
  "a": {
    "b": {
      "firstName": "First",
      "lastName": "Last",
      "dateOfBirth": "2000-01-01"
    }
  }
}
```

If all of the relevant data is found under `b`, the `dataPrefix` would be `a.b`.

On the other hand, this setting does not need to be defined if the data looks like this:

```json
{
  "firstName": "First",
  "lastName": "Last",
  "dateOfBirth": "2000-01-01"
}
```

#### `dataDir` (required)

This is the path to the directory where the test can find the [data sets](#datasets-required) for the test.

#### `dataSets` (required)

This is an array of file paths for the JSON (test data) files to be included in the test suite.

The file paths are relative to the `dataDir`. File extensions are optional.

Each file represents a separate test with its own set of data to fill the form. Effectively, the values in this array determine which tests to run.

For an example of how `dataDir` and `dataSets` interact, consider the following structure for your test directory.

```
tests
|-- data
|   |-- some-folder
|   |   |-- c-test.json
|   |   `-- d-test.json
|   |-- a-test.json
|   `-- b-test.json
`-- some-form-app.cypress.spec.js
```

If you wanted to run a suite of tests based on data from `a-test.json`, `b-test.json`, `c-test.json`, and `d-test.json`, you may write your test configuration as such:

```js
// `__dirname` can be used to return the current directory path relative to project root.
dataDir: path.join(__dirname, 'data'), // => 'src/applications/some-form-app/tests/data'

dataSets: ['a-test', 'b-test', 'some-folder/c-test', 'some-folder/d-test'],
```

#### `fixtures` (deprecated)

**This feature is deprecated, and only the `data` fixture path can still be used. If possible, use the `dataDir` property instead.**

**To otherwise use Cypress fixtures, you may use `cy.fixture` with a path starting from the project root.**

```js
const myData = path.join(__dirname, 'fixtures', 'mocks', 'my-data.json');
cy.fixtures(myData).then(data => { ... });
```

For a more involved example of the interaction with the `dataSets` setting, consider the following `tests` directory structure containing the spec file:

```
tests
|-- some-folder
|   |-- another-folder
|   |   |-- c-test.json
|   |   `-- d-test.json
|   |-- a-test.json
|   `-- b-test.json
`-- some-form-app.cypress.spec.js
```

Let's say we wanted to run a suite of tests based on data from `a-test.json`, `b-test.json`, `c-test.json`, and `d-test.json`. The test config would include these settings:

```js
dataSets: ['a-test', 'b-test', 'another-folder/c-test', 'another-folder/d-test'],
fixtures: {
  // `__dirname` can be used to return the current directory path
  // relative to the project root.

  data: path.join(__dirname, 'some-folder'), // => 'src/applications/some-form-app/tests/some-folder'
},
```

#### `pageHooks` (required)

This is an object that maps URL pathnames to functions. When the test gets to a page that matches the pathname, it executes the function (or hook) instead of doing the automatic form filling for that page.

Pathnames that start with `/` are interpreted as full paths relative to the base URL of the site.

Pathnames that don't start with `/` are interpreted to be relative to the `rootUrl` of the form.

Assuming the site is served at `http://localhost:3001`, and the form is served at `/some-form-app-url`, URLs for hooks resolve like so:

```js
pageHooks: {
  // http://localhost:3001/some-form-app-url/introduction
  introduction: () => { ... },

  // http://localhost:3001/some-form-app-url/some/path
  'some/path': () => { ... },

  // http://localhost:3001/some-form-app-url/array/1
  'array/:index': () => { ... },

  // http://localhost:3001/some-form-app-url/path
  '/some-form-app-url/path': () => { ... },

  // http://localhost:3001/outside-of-form
  '/outside-of-form': () => { ... },
},
```

The functions **all have access to a context object as a first argument**, which currently provides three things:

1. `pathname`: a convenient reference to the full pathname that got matched for this page hook.

2. `index`: index of the page from the array data. This value is obtained from the pathname, e.g. `array-page/1` would set the index to `1`.

3. `afterHook`: a helper function that takes a function and uses it to **override the usual end-of-page behavior**.

   Typically, the standard flow for processing a page follows these steps:

   1. Run an initial axe check.
   2. Run the page hook if the page has one.
   3. Autofill if no hook ran and if the page is not review or confirmation.
   4. Expand any accordions and run the end-of-page aXe check.
   5. Run the post hook.

   The default "post hook" for a page is to just click the 'Continue' button to proceed to the next page. For the review page, the post hook checks the privacy agreement box if there is one and then submits the form.


   The function passed to `afterHook` will override what is normally run for that post hook in step 5. It can be considered an override that does the job of **moving from the current page to the next**. If the page follows the default post hook behavior, this helper is not needed at all.

   The **most common usage for the after hook** would be to pass a function that simply clicks the appropriate button to proceed to the next page.
   - This is useful if the that button does not match the standard button in the default post hook (e.g., the text doesn't say 'Continue').
   - This is practically **mandatory for the introduction page**, where the flow to start a form can vary between forms.
   - Note that the second aXe check is still guaranteed to run before this override.

   ##### Examples for using the after hook

   ```js
   pageHooks: {
    introduction: ({ afterHook }) => {
      afterHook(() => {
        cy.findByText(/begin/i, { selector: 'button' })
          .first()
          .click();
      });
    },

    'some-other-page': ({ afterHook, pathname, index }) => {
      // Do whatever you need to in the "main body" of the hook,
      // which replaces the default autofilling behavior.
      cy.log(`Look, I'm on ${pathname}!`);

      afterHook(() => {
        cy.findByText(/next/i, { selector: 'button' })
          .first()
          .click();
      });
    },
   },
   ```

##### Common usage for page hooks

There are various use cases for the `pageHooks` setting, but a couple of common ones are:

1. Special or non-standard pages in the form, like the introduction, where the automatic form filling doesn't work or apply. Virtually every form will have an introduction page, which will require a page hook to proceed. See the `afterHooks` section above for an example.

2. "Prepping" a page, as in performing any necessary interactions to get the page in the desired state, before invoking the usual automatic filling.

   `cy.fillPage` is a custom command bundled with the form tester that performs the automatic form filling on the current page. This is the same command that's used in the form tester's default handling of a page. It does not include interactions with any "continue" buttons to proceed to the next page.

   ```js
   pageHooks: {
     '/some-form-app-url/some-page': () => {
       cy.get('.expand-button').click();
       cy.fillPage();
     },
   },
   ```

3. Uploading a custom file. By default, file uploads automatically use `src/platform/testing/example-upload.png`. No extra configuration is needed to simulate file uploads, but you can use a page hook to upload a different file.

   ```js
   pageHooks: {
     'upload/pdf': () => {
       const filePath = path.join(__dirname, 'fixtures', 'data', 'example-upload.pdf');
       cy.get('input[type="file"]')
         .upload(filePath, 'application/pdf')
         .get('.schemaform-file-uploading')
         .should('not.exist');
     },
   },
   ```

#### `rootUrl` (required)

This is the base URL for the form app and the URL that each test visits first. This should match the `rootUrl` from the app's `manifest.json`, which can automatically be set by using `createTestConfig`.

#### `setup` (optional)

Function that performs setup once before starting the test suite. Can be thought of as a "before all".

Fixtures defined in the test config `fixtures` will be available at this point and can be referenced from `setup` with `cy.fixtures`.

#### `setupPerTest` (optional)

Function that performs setup before each test in the suite. Can be thought of as a "before each".

Cypress aliases and routes should get created here instead of `setup`, since those are reset before each test.

Before `setupPerTest` runs, the shared Cypress setup will have automatically started `cy.server()` and stubbed the `GET /v0/maintenance_windows` and `GET /v0/feature_toggles` requests to return empty arrays.

Default stubs (like the maintenance windows and feature toggles requests) can be overriden by setting up another `cy.route` on the same endpoint.

This is also generally the place to set anything in `localStorage` and `sessionStorage` before the test runs.

Authenticated sessions are typically set up here as well with `cy.login()`. This is a custom command that sets the `hasSession` flag in `localStorage` and stubs the `GET /v0/user` endpoint.

If your test requires a specific `localStorage` or `sessionStorage` state or authenticated session at a later point in the test, as in the middle instead of the beginning, you may set those in a page hook, but you **may need to reload the page (`cy.reload()`) to see the effects**.

In particular, the `hasSession` flag to activate an authenticated session needs to be `true` when the page loads, so setting it to `true` after it has already loaded will not change the page to a logged in state.

#### `skip` (optional)

Boolean or array that determines whether tests should be skipped. By default, no tests are skipped.

If it's an array of strings, including values that match the strings in `dataSets` will result in skipping the corresponding tests.

If it's a truthy value that's not an array, the entire test suite will be skipped.

```js
dataSets: ['a-test', 'b-test', 'c-test'],

// Skips 'b-test', but allows 'a-test' and 'c-test' to run.
skip: ['b-test'],

// Skips 'a-test' and 'b-test', but allows 'c-test' to run.
skip: ['a-test', 'c-test'],

// Skips everything.
skip: true,
```

It can be useful to skip tests only in CI so you can continue running them locally. The environment variable `CI` should be present in CI environments.

```js
skip: Cypress.env('CI'),
```

## Aliases

The following aliases are available to `pageHooks` and `setupPerTest`.

### `arrayPages`

Same as the test config setting `arrayPages`.

### `pageHooks`

The test config setting `pageHooks` but with resolved pathnames. That is, all the paths start with `/` and are relative to the base URL of the site.

Any paths in the test config that did not start with `/` will have the form's `rootUrl` prepended here.

### `testData`

The data set currently being used to fill the form. This data is what drives each test in the suite, so its value will be specific to the test that's currently running.

It will be the object structure that's returned from resolving the path with `dataPrefix`, so when using this alias, there is no need to qualify the object path with the prefix to get to the actual form data.

```json
minimal-test.json

{
  "data": {
    "firstName": "First",
    "lastName": "Last",
    "dateOfBirth": "2000-01-01",
  }
}
```

```js
// testConfig

dataPrefix: 'data',

pageHooks: {
  'veteran-information': () => {
    cy.get('@testData').then(({ firstName, lastName, dateOfBirth }) => {
      ...
    });
  },
},

setupPerTest: () => {
  cy.get('@testData').then(({ firstName, lastName, dateOfBirth }) => {
    ...
  });
},
```

### `testKey`

The string key associated with the test data being used to fill the form.

It will correspond to one of the strings in the `dataSet` array and is specific to the test that's currently running.

This can be useful if you have to perform different actions in certain tests.

This example shows how you might conditionally apply page hooks or setups depending on the test:

```js
// testConfig

dataSets: ['a-test', 'b-test', 'c-test', 'd-test'],

pageHooks: {
  'veteran-information': () => {
    cy.get('@testKey').then(testKey => {
      switch (testKey) {
        case 'a-test':
          // Do things specific to 'a-test'.
        case 'b-test':
          // Do things specific to 'b-test'.
        case 'c-test':
          // Do things specific to 'c-test'.
        default:
          // Do other things for any other test.
      }
    });
  },
},

setupPerTest: () => {
  cy.get('@testKey').then(testKey) => {
    if (testKey === 'd-test') {
      // You may want to set up different routes for certain tests.
      cy.route('GET', '/v0/user', specialTestUser);
    }
  });
},
```

## Accessibility

An aXe check is automatically performed on every page before and after the page is processed (either running a page hook or filling the page automatically).

For now, violations will be skipped to unblock test execution. Violations will be allowed to fail tests once we have determined a plan and timeline for resolving the aXe issues that the tests encounter.

## Sample Code

For reference, here is what a full spec file might look like.

```js
// some-form-app.cypress.spec.js

import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    // This will be derived from the manifest using `createTestConfig`,
    // so it doesn't need to be explicitly included.
    // appName: 'ID-001-99 example form',

    // This will be derived from the form config using `createTestConfig`,
    // so it doesn't need to be explicitly included.
    // arrayPages: {},

    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'data'),

    dataSets: ['minimal-test', 'maximal-test'],

    pageHooks: {
      // Due to automatic path resolution, this URL expands to:
      // '/some-form-app-url/introduction'. Either format can be used.
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-button[text*="start"]')
            .first()
            .click();
        });
      },

      'sub-page/do-stuff-before-filling': () => {
        // The `@testData` alias is available in `pageHooks` and `setupPerTest`.
        cy.get('@testData').then(testData => {
          if (testData.isSomethingTrue) doSomething();
        });

        // Fill out the rest of the page like normal.
        cy.fillPage();
      },

      'fun-with-fixtures': () => {
        const sampleA = path.join(__dirname, 'sample-folder', 'sample-a.json');
        cy.fixture(sampleA).then(fileContent => {
        });

        const sampleB = path.join(__dirname, 'sample-folder', 'sample-b.json');
        cy.fixture(sampleB).then(({ attrA, attrB }) => {
        });

        // Example of uploading a fixture. For general uploading purposes,
        // `cy.fillPage()` autofills upload fields with `example-upload.png`.
        // Use that if you have no specific requirements for file upload data.
        const pdf = path.join(__dirname, 'fixtures', 'example-upload.pdf');
        cy.get(`input[id="root_upload_field"]`)
          .upload(pdf, 'application/pdf')
          .get('.schemaform-file-uploading')
          .should('not.exist');
      },
    },

    // This will be derived from the manifest using `createTestConfig`,
    // so it doesn't need to be explicitly included.
    // rootUrl: '/some-form-app-url',

    setup: () => {
      cy.log("Logging something before starting tests.");
    },

    setupPerTest: () => {
      // `cy.server` is already set up by default, so just start adding routes.

      // Start an auth'd session here if your form requires it.
      cy.login();

      cy.route({
        method: 'GET',
        url: '/v0/endpoint',
        response: { body: 'mock body' },
      });

      cy.route({
        method: 'POST',
        url: '/v0/endpoint',
        status: 200,
      })
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
```
