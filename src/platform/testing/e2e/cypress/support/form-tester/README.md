# Cypress Form Tester

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
   1. [`createTestConfig`](#createtestconfig)
   2. [Settings](#settings)
      1. [`appName`](#appname-required)
      2. [`arrayPages`](#arraypages-optional)
      3. [`dataPrefix`](#dataprefix-optional)
      4. [`dataSets`](#datasets-required)
      5. [`fixtures`](#fixtures-required)
      6. [`pageHooks`](#pagehooks-required)
      7. [`rootUrl`](#rooturl-required)
      8. [`setup`](#setup-optional)
      9. [`setupPerTest`](#setuppertest-optional)
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

@property {Array} [arrayPages] - Objects that represent array pages
    in the form. For matching array pages to their corresponding test data.

@property {string} [dataPrefix] - The path prefix for accessing nested
    test data. For example, if the test data looks like
    { data: { field1: 'value' } }, dataPrefix should be set to 'data'.

@property {Array} dataSets - Array of fixture file paths to test data, which
    are relative to the "data" path loaded into fixtures. For example,
    if the fixtures object maps the "data" path to "some/folder/path",
    which contains a "test.json" file, dataSets can be set to ['test']
    to use that file as a data set. A test is generated for each data set
    and uses that data to fill out fields during the form flow.

@property {Object} fixtures - Paths to files or directories (relative to
    project root) to load as fixtures, with object keys as fixture paths.
    The "data" fixture path is _required_ to properly set up "dataSets".

@property {Object.<function>} [pageHooks] - Functions (hooks) that override
    the automatic form filling on specified pages. Each object key is the
    URL of the page that triggers the corresponding hook.

@property {string} rootUrl - The URL of the form.

@property {function} [setup] - Function that's called once before starting any
    tests in the spec module. Corresponds to the before (all) hook.

@property {function} [setupPerTest] - Function that's called before each test.
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

#### `dataSets` (required)

This is an array of file paths for the JSON (test data) files to be included in the test suite.

The file paths are relative to the path that the `data` fixture points to. File extensions are optional.

Each file represents a separate test with its own set of data to fill the form. Effectively, the values in this array determine which tests to run.

[See the following section on the `fixtures` setting](#fixtures-required) for more details and an example of how the `dataSets` and `fixtures` settings interact.

#### `fixtures` (required)

This object sets up arbitrary paths as Cypress fixtures.

The object values are file or directory paths, relative to the project root, to set as fixtures. As fixtures, they can be accessed dynamically during a test via `cy.fixtures` by passing the corresponding object key as the fixture path.

Fixtures are shared across all tests in the suite and do not reset in between.

**The `data` fixture path is special and required for the `dataSets` setting to work properly, which is necessary for any tests to run at all.**

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

  data: path.join(__dirname, 'some-folder'), // => 'src/applications/some-form-app/tests/data'
},
```

**It is possible to set other fixtures when needed for special cases**, but the `data` fixture path is generally the only requirement for this setting.

```js
// testConfig

fixtures: {
  data: path.join(__dirname, 'data'),
  'example-file': 'src/platform/testing/e2e/file.txt',
  'example-folder': 'src/platform/testing/e2e/folder',
},

// Fixtures can then be accessed from setup functions or page hooks.
setup: () => {
  cy.fixtures('example-file').then(file => { ... });
  cy.fixtures('example-folder/some-file').then(file => { ... });
  cy.fixtures('example-folder/subfolder/another-file').then(file => { ... });
},
```

**When the object value is a path that points to a directory,** all of the files within it (and within subdirectories) can be accessed as fixtures with `cy.fixtures` by passing in their paths relative to that directory, prefixed by the fixture path for the directory.

In this example, if `src/platform/testing/e2e/folder` contains `some-file.txt`, it can be accessed with `cy.fixtures('example-folder/some-file')`.

This can also work for files that exist deeper within the directory structure: `cy.fixtures('example-folder/subfolder/another-file')`.

**To provide a default behavior for simulating file uploads, the form tester automatically includes an `example-upload.png` fixture.** No extra configuration is needed to simulate file uploads.

```js
// form-tester/index.js

cy.syncFixtures({
  // Load example upload data as a fixture.
  'example-upload.png': 'src/platform/testing/example-upload.png',
  ...fixtures,
}).then(setup);
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

  // http://localhost:3001/some-form-app-url/path
  '/some-form-app-url/path': () => { ... },

  // http://localhost:3001/outside-of-form
  '/outside-of-form': () => { ... },
},
```

There are various use cases for this setting, but a couple of common ones are:

1. Special or non-standard pages in the form, like the introduction, where the automatic form filling doesn't work or apply. Virtually every form will have an introduction page, which will require a page hook to proceed.
   ```js
   pageHooks: {
     introduction: () => {
       cy.findAllByText(/get started/i)
         .first()
         .click();
     },
   },
   ```

2. "Prepping" a page, as in performing any necessary interactions to get the page in the desired state, before invoking the usual automatic filling.

   `cy.fillPage` is a custom command bundled with the form tester that performs the automatic form filling on the current page. This is the same command that's used in the form tester's default handling of a page. It does not include interactions with any "continue" buttons to proceed to the next page.

   ```js
   pageHooks: {
     '/some-form-app-url/some-page': () => {
       cy.get('.expand-button').click();
       cy.fillPage();
       cy.findAllByTest(/continue/i)
         .first()
         .click();
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

Before `setupPerTest` runs, the form tester will have automatically started `cy.server()` and stubbed the `GET /v0/maintenance_windows` request to return `[]`.

Default stubs (like the maintenance windows request) can be overriden simply by setting up another `cy.route` on the same endpoint.

This is also generally the place to set anything in `localStorage` and `sessionStorage` before the test runs.

Authenticated sessions are generally set up here as well with `cy.login()`. This is a custom command that sets the `hasSession` flag in `localStorage` and stubs the `GET v0/user` endpoint.

If your test requires a specific `localStorage` or `sessionStorage` state or authenticated session at a later point in the test, as in the middle instead of the beginning, you may set those on a page hook, but be aware that you **may need to reload the page for see the effects**.

In particular, the `hasSession` flag to activate an authenticated session needs to be `true` when the page loads, so setting it to `true` after it has already loaded will not change the page to a logged in state.

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
// test-data.json

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

    dataSets: ['minimal-test', 'maximal-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures'),
      'sample-file': path.join(__dirname, 'some-folder/some-file.json'),
      'sample-folder': path.join(__dirname, 'other-folder'),
    },

    pageHooks: {
      // Due to automatic path resolution, this URL expands to:
      // '/some-form-app-url/introduction'. Either format can be used.
      introduction: () => {
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },

      'sub-page/do-stuff-before-filling': () => {
        // The `@testData` alias is available in `pageHooks` and `setupPerTest`.
        cy.get('@testData').then(testData => {
          if (testData.isSomethingTrue) doSomething();
        });

        // Fill out the rest of the page like normal.
        cy.fillPage();

        // Don't forget to click continue!
        cy.findAllByTest(/continue/i, { selector: 'button' })
          .first()
          .click();
      },

      // Use files synced to fixtures, either individually or from folders.
      'fun-with-fixtures': () => {
        cy.fixture('sample-file').then(fileContent => {
        });

        cy.fixture('sample-folder/json-file').then(fileContent => {
        });

        // Example of uploading a fixture. For general uploading purposes,
        // 'example-file.png' is already included in the form tester by default
        // if you don't have any specific requirements for file upload data.
        cy.get(`input[id="root_upload_field"]`)
          .upload('sample-folder/png-file', 'image/png')
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
