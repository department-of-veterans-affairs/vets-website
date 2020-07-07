import { join, sep } from 'path';

import get from 'platform/utilities/data/get';

const APP_SELECTOR = '#react-root';
const ARRAY_ITEM_SELECTOR =
  'div[name^="topOfTable_"] ~ div.va-growable-background';
const FIELD_SELECTOR = 'input, select, textarea';
const LOADING_SELECTOR = '.loading-indicator';

// Force interactions on elements, skipping the default checks for the
// "user interactive" state of an element, potentially saving some time.
// More importantly, this ensures the interaction will target the actual
// selected element, which overrides the default behavior that simulates
// how a real user might try to interact with a target element that has moved.
// https://github.com/cypress-io/cypress/issues/6165
const FORCE_OPTION = { force: true };

// Cypress does not officially support typing without delay.
// See the main support file for more details.
const NO_DELAY_OPTION = { delay: 0 };

// Suppress logs for most commands, particularly calls to wrap and get
// that are mainly there to support more specific operations.
const NO_LOG_OPTION = { log: false };

/**
 * Builds an object from a form field with attributes that are used
 * to look up test data and enter that data into the field.
 *
 * typedef {Object} Field
 * @property {Element} element - A form field element.
 * @property {string} key - String that is used for data lookup.
 * @property {string} type - Field type for deciding how to input data.
 * @property {string} [arrayItemPath] - Prefix for resolving path when
 *     looking up data for fields in an array item.
 * @property {string} [data] - Data to enter into the field input.
 * ---
 * @param {Element} element
 * @returns {Field}
 */
const createFieldObject = element => {
  const field = {
    element,
    key: element.prop('name') || element.prop('id'),
    type: element.prop('type') || element.prop('tagName'),
  };

  const isDateField = element
    .parent()
    .attr('class')
    ?.includes('date');

  if (isDateField) {
    // Dates in form data combine all the date components (year, month, day),
    // so treat filling out date fields as a single step for entering data.
    field.key = field.key.replace(/(Year|Month|Day)$/, '');
    field.type = 'date';
  }

  return field;
};

/**
 * Checks if the current page maps to an array page from the form config,
 * and if there is a match, build the path prefix for looking up test data
 * with the index of the array item that corresponds to this page.
 *
 * @param {string} pathname - The pathname of the current page.
 */
const getArrayItemPath = pathname => {
  cy.get('@arrayPages', NO_LOG_OPTION).then(arrayPages => {
    let index;

    const { arrayPath } =
      arrayPages.find(({ regex }) => {
        const match = pathname.match(regex);
        if (match) [, index] = match;
        return match;
      }) || {};

    return arrayPath ? `${arrayPath}[${parseInt(index, 10)}]` : '';
  });
};

/**
 * Adds a new item for every array type field on the current page
 * that still has more array items to be added and filled out.
 *
 * @param {Element} $form - The form element returned from querying the DOM.
 */
const addNewArrayItem = $form => {
  // Get all array types on the current page.
  const arrayTypeRoots = $form.find('div[name^="topOfTable_root_"]');

  // Find the last entry for each array type, use its index to figure out
  // whether the test data still has more items to be entered, and click
  // the add button if so.
  if (arrayTypeRoots.length) {
    cy.wrap(arrayTypeRoots).each(arrayTypeRoot => {
      cy.wrap(arrayTypeRoot)
        .siblings('div')
        .last()
        .find('div[name^="table_root_"]')
        .then(lastArrayItemRoot => {
          const key = arrayTypeRoot.attr('name').replace('topOfTable_', '');

          cy.findData({ key }).then(arrayData => {
            if (typeof arrayData !== 'undefined') {
              const lastIndex = parseInt(
                lastArrayItemRoot.attr('name').match(/\d+$/g),
                10,
              );

              if (arrayData.length - 1 > lastIndex) {
                cy.wrap(arrayTypeRoot)
                  .siblings('button.va-growable-add-btn')
                  .first()
                  .click(FORCE_OPTION);
              }
            }
          });
        });
    });
  }
};

/**
 * Run the page hook if the page has one, optionally automatically fill the page
 * if no hook ran, expand any accordions, and run an aXe check. Finally, if the
 * page was automatically filled, also automatically continue to the next page.
 *
 * @param {string} pathname - The pathname of the page to run the page hook on.
 * @param {boolean} [autofill] - If true, and if no page hook ran, automatically
 *     fill the page. If false, don't fill the page, even if no page hook ran.
 */
const performPageActions = (pathname, autofill = true) => {
  cy.execHook(pathname).then(hookExecuted => {
    if (!hookExecuted && autofill) cy.fillPage();

    cy.expandAccordions();
    cy.axeCheck();

    if (!hookExecuted && autofill) {
      cy.findByText(/continue/i, { selector: 'button' }).click(FORCE_OPTION);
    }
  });
};

/**
 * Top level loop that invokes all of the processing for a form page and
 * proceeds to the next page. When it gets to the end, it submits the form.
 */
const processPage = () => {
  // Run aXe check before doing anything on the page.
  cy.axeCheck();

  cy.location('pathname', NO_LOG_OPTION).then(pathname => {
    if (pathname.endsWith('review-and-submit')) {
      performPageActions(pathname, false);

      // Check the privacy agreement box if it exists.
      cy.get(APP_SELECTOR, NO_LOG_OPTION).then($form => {
        const privacyAgreement = $form.find('input[name^="privacyAgreement"]');
        if (privacyAgreement.length) {
          cy.wrap(privacyAgreement)
            .first()
            .check(FORCE_OPTION);
        }
      });

      cy.findByText(/submit/i, { selector: 'button' }).click(FORCE_OPTION);

      // The form should end up at the confirmation page after submitting.
      cy.location('pathname').then(endPathname => {
        expect(endPathname).to.match(/confirmation$/);
        cy.axeCheck();
        performPageActions(endPathname, false);
      });
    } else {
      performPageActions(pathname);
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
 * Runs the page hook if there is one for the current page.
 * @param {string} pathname - The pathname for the current URL.
 * @returns {boolean} Resolves true if a hook ran and false otherwise.
 */
Cypress.Commands.add('execHook', pathname => {
  cy.get('@pageHooks', NO_LOG_OPTION).then(pageHooks => {
    const hook = pageHooks?.[pathname];
    if (!hook) return cy.wrap(false, NO_LOG_OPTION);

    if (typeof hook !== 'function') {
      throw new Error(`Page hook for ${pathname} is not a function`);
    }

    const hookPromise = new Promise(resolve => {
      hook();
      resolve(true);
    });

    return cy.wrap(hookPromise, NO_LOG_OPTION);
  });
});

/**
 * Looks up data for a field.
 * @param {Field}
 * @returns {*} Resolves to the field data if found or undefined otherwise.
 */
Cypress.Commands.add('findData', field => {
  let resolvedDataPath;

  cy.get('@testData', NO_LOG_OPTION).then(testData => {
    const relativeDataPath = field.key
      .replace(/^root_/, '')
      .replace(/_/g, '.')
      .replace(/\._(\d+)\./g, (_, number) => `[${number}]`);

    // Prefix the path to the array item if this field belongs to one.
    resolvedDataPath = field.arrayItemPath
      ? `${field.arrayItemPath}.${relativeDataPath}`
      : relativeDataPath;

    cy.wrap(get(resolvedDataPath, testData), NO_LOG_OPTION);
  });

  Cypress.log({
    message: field.key,
    consoleProps: () => ({ ...field, resolvedDataPath }),
  });
});

/**
 * Enters data for a field.
 * @param {Field}
 */
Cypress.Commands.add('enterData', field => {
  switch (field.type) {
    // Select fields register as having type 'select-one'.
    case 'select-one':
      cy.wrap(field.element).select(field.data, FORCE_OPTION);
      break;

    case 'checkbox': {
      if (field.data) cy.wrap(field.element).check(FORCE_OPTION);
      else cy.wrap(field.element).uncheck(FORCE_OPTION);
      break;
    }

    case 'textarea':
    case 'tel':
    case 'email':
    case 'number':
    case 'text': {
      cy.wrap(field.element)
        .clear(FORCE_OPTION)
        .type(field.data, { ...FORCE_OPTION, ...NO_DELAY_OPTION })
        .then(element => {
          // Get the autocomplete menu out of the way.
          if (element.attr('role') === 'combobox') {
            cy.wrap(element).type('{downarrow}{enter}');
          }
        });
      break;
    }

    case 'radio': {
      let value = field.data;
      // Use 'Y' / 'N' because of the yesNo widget.
      if (typeof value === 'boolean') value = value ? 'Y' : 'N';
      const selector = `input[name="${field.key}"][value="${value}"]`;
      cy.get(selector).check(FORCE_OPTION);
      break;
    }

    case 'date': {
      const [year, month, day] = field.data
        .split('-')
        .map(
          dateComponent =>
            isFinite(dateComponent)
              ? parseInt(dateComponent, 10).toString()
              : dateComponent,
        );

      // Escape non-standard characters like dots and colons.
      const baseSelector = Cypress.$.escapeSelector(field.key);

      cy.get(`#${baseSelector}Year`)
        .clear()
        .type(year, { ...FORCE_OPTION, ...NO_DELAY_OPTION });

      cy.get(`#${baseSelector}Month`).select(month, FORCE_OPTION);

      if (day !== 'XX') cy.get(`#${baseSelector}Day`).select(day, FORCE_OPTION);

      break;
    }

    case 'file': {
      cy.get(`#${Cypress.$.escapeSelector(field.key)}`)
        .upload('example-upload.png', 'image/png')
        .get('.schemaform-file-uploading')
        .should('not.exist');
      break;
    }

    default:
      throw new Error(`Unknown element type '${field.type}' for ${field.key}`);
  }

  Cypress.log({
    message: field.data,
    consoleProps: () => field,
  });
});

/**
 * Fills all of the fields on a page, looping until no more fields appear.
 */
Cypress.Commands.add('fillPage', () => {
  cy.location('pathname', NO_LOG_OPTION)
    .then(getArrayItemPath)
    .then(arrayItemPath => {
      const touchedFields = new Set();
      const snapshot = {};

      /**
       * Fills out a field (or set of fields) using the created field object,
       * if it's eligible, and exempts it from further processing.
       *
       * There are several reasons a field might not be eligible:
       * 1. No key was derived; the element has no name or id.
       * 2. The field was already processed individually or as part of a set.
       * 3. The element isn't part of the form schema.
       * 4. The element detached from the DOM, possibly due to re-rendering.
       *    It also may have changed as a result of interacting with another
       *    field. It will be processed in a later iteration.
       *
       * @param {Field}
       */
      const processFieldObject = field => {
        const shouldSkipField =
          !field.key ||
          field.element.prop('disabled') ||
          touchedFields.has(field.key) ||
          !field.key.startsWith('root_') ||
          Cypress.dom.isDetached(field.element);

        if (shouldSkipField) return;

        cy.findData({ ...field, arrayItemPath }).then(data => {
          if (typeof data !== 'undefined') cy.enterData({ ...field, data });
          touchedFields.add(field.key);
        });
      };

      const fillAvailableFields = () => {
        cy.get(APP_SELECTOR, NO_LOG_OPTION)
          .then($form => {
            // Get the starting number of array items and fields to compare
            // after filling out all currently visible fields, as new fields
            // may get added or expanded after this iteration.
            snapshot.arrayItemCount = $form.find(ARRAY_ITEM_SELECTOR).length;
            snapshot.fieldCount = $form.find(FIELD_SELECTOR).length;
          })
          .within(NO_LOG_OPTION, $form => {
            // Fill out every field that's currently on the page.
            const fields = $form.find(FIELD_SELECTOR);
            if (!fields.length) return;
            cy.wrap(fields).each(element => {
              cy.wrap(createFieldObject(element), NO_LOG_OPTION).then(
                processFieldObject,
              );
            });

            // Once all currently visible fields have been filled, add an array
            // item if there are more to be added according to the test data.
            if (snapshot.fieldCount === $form.find(FIELD_SELECTOR).length) {
              addNewArrayItem($form);
            }

            cy.wrap($form, NO_LOG_OPTION);
          })
          .then($form => {
            // If there are new array items or fields to be filled,
            // iterate through the page again.
            const { arrayItemCount, fieldCount } = snapshot;
            const fieldsNeedInput =
              arrayItemCount !== $form.find(ARRAY_ITEM_SELECTOR).length ||
              fieldCount !== $form.find(FIELD_SELECTOR).length;
            if (fieldsNeedInput) fillAvailableFields();
          });
      };

      fillAvailableFields();
    });
});

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

      // Save a couple of seconds by definitively responding with
      // no maintenance windows instead of letting the request time out.
      cy.server().route('GET', '/v0/maintenance_windows', []);

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
