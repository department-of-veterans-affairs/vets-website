import { join, sep } from 'path';
import { LOADING_SELECTOR, NO_LOG_OPTION } from '../index';
import get from 'platform/utilities/data/get';

/**
 * Performs the following actions on a page:
 * 1. Run an initial axe check.
 * 2. Run the page hook if the page has one.
 * 3. Autofill if no hook ran and if the page is not review or confirmation.
 * 4. Expand any accordions and run the end-of-page aXe check.
 * 5. Run the post hook.
 *
 * @param {string} pathname - The pathname of the page to run the page hook on.
 */
const performPageActions = pathname => {
  cy.axeCheck();

  cy.execHook(pathname).then(({ hookExecuted, postHook }) => {
    const shouldAutofill = !pathname.match(
      /\/(introduction|confirmation|review-and-submit)$/,
    );

    if (!hookExecuted && shouldAutofill) cy.fillPage();

    cy.expandAccordions();
    cy.axeCheck();

    const postHookPromise = new Promise(resolve => {
      postHook();
      resolve();
    });

    cy.wrap(postHookPromise, NO_LOG_OPTION);
  });
};

/**
 * Top level loop that invokes all of the processing for a form page and
 * asserts that it proceeds to the next page until it gets to the confirmation.
 */
const processPage = () => {
  cy.location('pathname', NO_LOG_OPTION).then(pathname => {
    performPageActions(pathname);

    if (!pathname.endsWith('/confirmation')) {
      cy.location('pathname', NO_LOG_OPTION)
        .should(newPathname => {
          if (pathname === newPathname) {
            throw new Error(`Expected to navigate away from ${pathname}`);
          }
        })
        .then(processPage);
    }
  });
};

/**
 * Tests a form flow with the provided test data.
 *
 * @typedef {Object} TestConfig
 * @property {string} appName - Name of the app (form) to describe the test.
 * @property {Object[]} [arrayPages] - Objects that represent array pages
 *     in the form. For matching array pages to their corresponding test data.
 * @property {string} [dataPrefix] - The path prefix for accessing nested
 *     test data. For example, if the test data looks like
 *     { data: { field1: 'value' } }, dataPrefix should be set to 'data'.
 * @property {string[]} dataSets - Array of fixture file paths to test data
 *     relative to the "data" path loaded into fixtures. For example,
 *     if the fixtures object maps the "data" path to "some/folder/path",
 *     which contains a "test.json" file, dataSets can be set to ['test']
 *     to use that file as a data set. A test is generated for each data set
 *     and uses that data to fill out fields during the form flow.
 * @property {Object} fixtures - Paths to files or directories (relative to
 *     project root) to load as fixtures, with object keys as fixture paths.
 *     The "data" fixture path is _required_ to properly set up "dataSets".
 * @property {Object.<function>} [pageHooks] - Functions (hooks) that override
 *     the automatic form filling on specified pages. Each object key is the
 *     URL of the page that triggers the corresponding hook.
 * @property {string} rootUrl - The URL of the form.
 * @property {function} [setup] - Function that's called once before starting any
 *     tests in the spec module. Corresponds to the before (all) hook.
 * @property {function} [setupPerTest] - Function that's called before each test.
 * @property {(boolean|string[])} [skip] - Skips specific tests if it's an array
 *     that contains the test names as strings. Skips the whole suite
 *     if it's otherwise truthy.
 * ---
 * @param {TestConfig} testConfig
 */
const testForm = testConfig => {
  const {
    appName,
    arrayPages = [],
    dataPrefix,
    dataSets,
    fixtures,
    pageHooks = {},
    rootUrl,
    setup = () => {},
    setupPerTest = () => {},
    skip,
  } = testConfig;

  const skippedTests = Array.isArray(skip) && new Set(skip);
  const testSuite = skip && !skippedTests ? describe.skip : describe;
  const testCase = (testKey, callback) =>
    skippedTests.has?.(testKey)
      ? context.skip(testKey, callback)
      : context(testKey, callback);

  testSuite(appName, () => {
    before(() => {
      if (!fixtures.data) {
        throw new Error('Required data fixture is undefined.');
      }

      cy.syncFixtures({
        // Load example upload data as a fixture.
        'example-upload.png': 'src/platform/testing/example-upload.png',
        ...fixtures,
      }).then(setup);
    });

    // Aliases and the stub server reset before each test,
    // so those have to be set up _before each_ test.
    beforeEach(() => {
      // Dismiss any announcements.
      window.localStorage.setItem('DISMISSED_ANNOUNCEMENTS', '*');

      cy.wrap(arrayPages).as('arrayPages');

      // Resolve relative page hook paths as relative to the form's root URL.
      const resolvedPageHooks = Object.entries(pageHooks).reduce(
        (hooks, [path, hook]) => ({
          ...hooks,
          [path.startsWith(sep) ? path : join(rootUrl, path)]: hook,
        }),
        {},
      );

      cy.wrap(resolvedPageHooks).as('pageHooks');
    });

    const extractTestData = testData => get(dataPrefix, testData, testData);

    const createTestCase = testKey =>
      testCase(testKey, () => {
        beforeEach(() => {
          cy.wrap(testKey).as('testKey');
          cy.fixture(`data/${testKey}`)
            .then(extractTestData)
            .as('testData')
            .then(setupPerTest);
        });

        it('fills the form', () => {
          cy.visit(rootUrl).injectAxe();

          cy.get(LOADING_SELECTOR)
            .should('not.exist')
            .then(processPage);
        });
      });

    dataSets.forEach(createTestCase);
  });
};

export default testForm;
