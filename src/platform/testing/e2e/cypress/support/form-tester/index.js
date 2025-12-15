import path from 'path';

import get from 'platform/utilities/data/get';

import disableFTUXModals from 'platform/user/tests/disableFTUXModals';
import { fillPatterns } from './patterns';

const APP_SELECTOR = '#react-root';
const ARRAY_ITEM_SELECTOR =
  'div[name^="topOfTable_"] ~ div.va-growable-background';
const ERROR_SELECTORS = [
  'fieldset [error]:not([error=""])', // For web components
  'fieldset .usa-input-error-message', // For non-web components
];
const FIELD_SELECTOR = 'input, select, textarea';
const WEB_COMPONENT_SELECTORS =
  'va-text-input, va-select, va-textarea, va-radio-option, va-checkbox, va-combo-box, va-date, va-memorable-date, va-telephone-input, va-file-input, va-file-input-multiple';

const LOADING_SELECTOR = 'va-loading-indicator';

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
    tagName: element.prop('tagName'),
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

    const indexNumber = parseInt(index, 10);
    return {
      arrayItemPath: arrayPath ? `${arrayPath}[${indexNumber}]` : '',
      index: indexNumber,
    };
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

const getFieldSelectors = () => {
  return cy
    .get('@useWebComponentFields', NO_LOG_OPTION)
    .then(
      useWebComponentFields =>
        useWebComponentFields
          ? `${FIELD_SELECTOR}, ${WEB_COMPONENT_SELECTORS}`
          : FIELD_SELECTOR,
    );
};

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
const performPageActions = (pathname, _13647Exception = false) => {
  cy.axeCheck('main', {
    _13647Exception,
    // Ignore heading order from the first axe check because headers
    // may be in the shadow dom which may not be loaded yet.
    // There is another axe check below which DOES check heading order.
    headingOrder: false,
  });

  cy.execHook(pathname).then(({ hookExecuted, postHook }) => {
    const shouldAutofill = !pathname.match(
      /\/(start|introduction|confirmation|review-and-submit)$/,
    );

    const continuePageProcessing = () => {
      cy.expandAccordions();
      cy.injectAxe();
      cy.axeCheck('main', { _13647Exception });

      const postHookPromise = new Promise(resolve => {
        postHook();
        resolve();
      });
      cy.wrap(postHookPromise, NO_LOG_OPTION);
    };

    if (!hookExecuted && shouldAutofill) {
      cy.fillPage().then(({ abortProcessing }) => {
        if (!abortProcessing) {
          continuePageProcessing();
        }
      });
    } else {
      continuePageProcessing();
    }
  });
};

const captureValidationErrors = () => {
  try {
    const errors = [];
    const $body = Cypress.$('body');

    ERROR_SELECTORS.forEach(selector => {
      const elements = $body.find(selector);
      elements.each((index, element) => {
        const $el = Cypress.$(element);
        const tagName = element.tagName.toLowerCase();

        let text = '';

        if (tagName.startsWith('va-') && $el.attr('error')) {
          text = $el.attr('error');
        } else {
          text = $el.text().trim();
          text = text.replace(/^Error\s+/, '');
        }

        if (text && $el.is(':visible')) {
          let fieldName = $el.attr('name') || $el.attr('id') || '';

          // When directly selecting '.usa-input-error-message'
          // remove the '-error-message' to refer to the actual field
          if (fieldName.endsWith('-error-message')) {
            fieldName = fieldName.replace('-error-message', '');
          }

          /**
           * Examples:
           * fieldName = "root_veteran_fullName_first"
           * tagName = "va-text-input"
           * text = "Please enter a first name"
           *
           * Example outputs web components:
           * "  • root_veteran_fullName_first" (va-text-input): "Please enter a first name"
           * "  • root_veteran_dateOfBirth" (va-memorable-date): "Please provide the date of birth"
           *
           * Example outputs non-web components:
           * "  • root_veteranFullName_first": "Please enter a first name"
           */
          const fieldPrefix = fieldName ? `"${fieldName}" ` : '';
          const tagNameSuffix = tagName.startsWith('va-') ? `(${tagName})` : '';
          errors.push(`  • ${fieldPrefix}${tagNameSuffix}: "${text}"`);
        }
      });
    });

    return errors;
  } catch (error) {
    // If error capture fails, return empty array to avoid breaking the test
    // The original navigation error will still be thrown
    return [];
  }
};

/**
 * Top level loop that invokes all of the processing for a form page and
 * asserts that it proceeds to the next page until it gets to the confirmation.
 */
const processPage = ({ _13647Exception, stopTestAfterPath }) => {
  cy.location('pathname', NO_LOG_OPTION).then(pathname => {
    if (pathname.endsWith(stopTestAfterPath)) {
      return;
    }

    performPageActions(pathname, _13647Exception);

    if (!pathname.endsWith('/confirmation')) {
      cy.location('pathname', NO_LOG_OPTION)
        .should(newPathname => {
          if (pathname === newPathname) {
            let errorMessage = `Expected to navigate away from ${pathname}`;

            const pageErrors = captureValidationErrors();
            if (pageErrors.length > 0) {
              errorMessage += `\n\nPage contains validation errors:\n${pageErrors.join(
                '\n',
              )}\n\nThis suggests required fields may be missing or invalid.`;
            }

            throw new Error(errorMessage);
          }
        })
        .then(() => processPage({ _13647Exception, stopTestAfterPath }));
    }
  });
};

/**
 * Provides the default post hook to run for the given pathname.
 * @param {string} pathname - The pathname for the current URL.
 * @returns {function} The post hook to be invoked after all other page actions.
 */
const defaultPostHook = pathname => {
  // On review pages, check the privacy agreement box if it exists and submit.
  if (pathname.endsWith('/review-and-submit')) {
    return () => {
      cy.get(APP_SELECTOR, NO_LOG_OPTION).then($form => {
        const privacyAgreement = $form.find('[name^="privacyAgreement"]');
        if (privacyAgreement.length) {
          cy.wrap(privacyAgreement).then($el => cy.selectVaCheckbox($el, true));
        }
      });

      cy.clickFormContinue();
    };
  }

  // No-op on introduction and confirmation pages.
  if (pathname.match(/\/(start|introduction|confirmation)$/)) {
    return () => {};
  }

  // Everything else should click on the 'Continue' button.
  return () => {
    cy.clickFormContinue();
  };
};

// Look for "/#" or "/#/" in the path
const REGEXP_PATH_INDEX = /\/\d+(?:\/|$)/;
const REGEXP_REMOVE_END_SLASH = /\/$/;

/**
 * Runs the page hook if there is one for the current page.
 * @param {string} pathname - The pathname for the current URL.
 * @returns {boolean} Resolves true if a hook ran and false otherwise.
 */
Cypress.Commands.add('execHook', pathname => {
  cy.get('@pageHooks', NO_LOG_OPTION).then(pageHooks =>
    cy
      .location('pathname', NO_LOG_OPTION)
      .then(getArrayItemPath)
      .then(({ index }) => {
        const pathnameKey = REGEXP_PATH_INDEX.test(pathname)
          ? pathname
              .split(REGEXP_PATH_INDEX)
              .join('/:index/')
              .replace(REGEXP_REMOVE_END_SLASH, '') // remove trailing `/`
          : pathname;

        const hook = pageHooks?.[pathname] || pageHooks?.[pathnameKey];
        let hookExecuted = false;
        let postHook = defaultPostHook(pathname);

        if (!hook) return cy.wrap({ hookExecuted, postHook }, NO_LOG_OPTION);

        if (typeof hook !== 'function') {
          throw new Error(`Page hook for ${pathnameKey} is not a function`);
        }

        // Give the page hook the option to set a custom post hook.
        const overridePostHook = fn => {
          if (typeof fn !== 'function') {
            throw new Error(`Post hook for ${pathnameKey} is not a function`);
          }
          postHook = fn;
        };

        // Context object that's available all page hooks as the first argument.
        const context = {
          afterHook: overridePostHook,
          pathname: pathnameKey,
          index,
        };

        const hookPromise = new Promise(resolve => {
          hook(context);
          hookExecuted = true;
          resolve({ hookExecuted, postHook });
        });

        return cy.wrap(hookPromise, NO_LOG_OPTION);
      }),
  );
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
function enterData(field) {
  switch (field.type) {
    // Select fields register as having type 'select-one'.
    case 'select-one':
      cy.wrap(field.element)
        .select(field.data, FORCE_OPTION)
        .should('have.value', field.data);
      break;

    case 'checkbox': {
      if (field.data)
        cy.wrap(field.element)
          .check(FORCE_OPTION)
          .should('be.checked');
      else
        cy.wrap(field.element)
          .uncheck(FORCE_OPTION)
          .should('not.be.checked');
      break;
    }

    case 'textarea':
    case 'tel':
    case 'email':
    case 'number':
    case 'text': {
      cy.get(field.element).should('not.be.disabled');
      cy.wrap(field.element)
        .clear({ ...FORCE_OPTION, ...NO_DELAY_OPTION })
        .type(field.data, { ...FORCE_OPTION, ...NO_DELAY_OPTION })
        .then(element => {
          // masked SSN appears on blur, so it won't match the field.data
          if (element.val() && !element[0].classList.contains('masked-ssn')) {
            cy.get(element).should('have.value', field.data);
          }
          // Get the autocomplete menu out of the way.
          if (element.attr('role') === 'combobox') element.blur();
        });
      break;
    }

    case 'radio': {
      let value = field.data;
      // Use 'Y' / 'N' because of the yesNo widget.
      if (typeof value === 'boolean') value = value ? 'Y' : 'N';
      const selector = `input[name="${field.key}"][value="${value}"]`;
      cy.get(selector)
        .check(FORCE_OPTION)
        .should('be.checked');
      break;
    }

    case 'date': {
      const [year, month, day] = field.data.split('-').map(
        dateComponent =>
          // eslint-disable-next-line no-restricted-globals
          isFinite(dateComponent)
            ? parseInt(dateComponent, 10).toString()
            : dateComponent,
      );

      // Escape non-standard characters like dots and colons.
      const baseSelector = Cypress.$.escapeSelector(field.key);

      cy.get(`#${baseSelector}Year`)
        .clear({ ...FORCE_OPTION, ...NO_DELAY_OPTION })
        .type(year, { ...FORCE_OPTION, ...NO_DELAY_OPTION })
        .should('have.value', year);

      cy.get(`#${baseSelector}Month`)
        .select(month, FORCE_OPTION)
        .should('have.value', month);

      if (day !== 'XX')
        cy.get(`#${baseSelector}Day`)
          .select(day, FORCE_OPTION)
          .should('have.value', day);

      break;
    }

    case 'file': {
      cy.get(`#${Cypress.$.escapeSelector(field.key)}`)
        .upload('platform/testing/example-upload.png', 'image/png')
        .get('.schemaform-file-uploading')
        .should('not.exist');
      break;
    }

    default:
      throw new Error(`Unknown element type '${field.type}' for ${field.key}`);
  }
}

/**
 * Enters data for a field or web component field.
 * @param {Field}
 */
Cypress.Commands.add('enterData', field => {
  if (field.tagName?.includes('VA-')) {
    cy.enterWebComponentData(field);
  } else {
    enterData(field);
  }

  Cypress.log({
    message: field.data,
    consoleProps: () => field,
  });
});

/**
 * Fills all of the fields on a page, looping until no more fields appear.
 * @returns {Promise<{abortProcessing: boolean}>} Resolves with processing status.
 */
Cypress.Commands.add('fillPage', () => {
  return cy
    .location('pathname', NO_LOG_OPTION)
    .then(getArrayItemPath)
    .then(({ arrayItemPath }) => {
      const touchedFields = new Set();
      const snapshot = {};
      let fillAvailableFields;
      let shouldAbortProcessing = false;

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

      const countFormElements = (fieldSelector, $form) => {
        // Get the starting number of array items and fields to compare
        // after filling out all currently visible fields, as new fields
        // may get added or expanded after this iteration.
        snapshot.arrayItemCount = $form.find(ARRAY_ITEM_SELECTOR).length;
        snapshot.fieldCount = $form.find(fieldSelector).length;
      };

      const fillFormFields = fieldSelector => {
        return cy
          .get(APP_SELECTOR, NO_LOG_OPTION)
          .within(NO_LOG_OPTION, $form => {
            // Fill out every field that's currently on the page.
            const fields = $form.find(fieldSelector);
            if (!fields.length) return;
            cy.wrap(fields).each(element => {
              cy.wrap(createFieldObject(element), NO_LOG_OPTION).then(
                processFieldObject,
              );
            });

            // Once all currently visible fields have been filled, add an array
            // item if there are more to be added according to the test data.
            if (snapshot.fieldCount === $form.find(fieldSelector).length) {
              addNewArrayItem($form);
            }

            cy.wrap($form, NO_LOG_OPTION);
          });
      };

      const fillAdditionalFields = fieldSelector => {
        return cy.get(APP_SELECTOR, NO_LOG_OPTION).then($form => {
          // If there are new array items or fields to be filled,
          // iterate through the page again.
          const { arrayItemCount, fieldCount } = snapshot;
          const fieldsNeedInput =
            arrayItemCount !== $form.find(ARRAY_ITEM_SELECTOR).length ||
            fieldCount !== $form.find(fieldSelector).length;
          if (fieldsNeedInput) fillAvailableFields();
        });
      };

      const fillFormPatternFields = () => {
        return cy.get(APP_SELECTOR, NO_LOG_OPTION).then($form => {
          return fillPatterns($form, arrayItemPath, touchedFields);
        });
      };

      fillAvailableFields = () => {
        return getFieldSelectors().then(fieldSelector => {
          return cy
            .get(APP_SELECTOR, NO_LOG_OPTION)
            .then($form => countFormElements(fieldSelector, $form))
            .then(() => fillFormPatternFields())
            .then(({ abortProcessing } = {}) => {
              if (abortProcessing) {
                shouldAbortProcessing = true;
                return;
              }
              fillFormFields(fieldSelector);
              fillAdditionalFields(fieldSelector);
            });
        });
      };

      return fillAvailableFields().then(() => ({
        abortProcessing: shouldAbortProcessing,
      }));
    })
    .then(result => {
      Cypress.log();
      return result;
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
 * @property {string} dataDir - Path to test data directory.
 * @property {string[]} dataSets - Test data file paths relative to dataDir.
 *     A test is generated for each data set and uses that data to fill out fields.
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
 * @property {string} [stopTestAfterPath] - The pathname of the page to stop the
 *     e2e test on. Useful for testing a set range of pages within a form. See
 *     setupInProgressReturnUrl in the utilities folder to set a start page.
 * ---
 * @param {TestConfig} testConfig
 */
const testForm = testConfig => {
  const {
    appName,
    arrayPages = [],
    dataPrefix,
    dataDir,
    dataSets,
    fixtures, // Deprecated in favor of `dataDir`.
    pageHooks = {},
    rootUrl,
    setup = () => {},
    setupPerTest = () => {},
    skip,
    // null prevents endsWith string comparison returning true
    stopTestAfterPath = null,
    _13647Exception = false,
    // whether or not to auto fill web component fields
    // (using RJSF naming convention #root_field_subField)
    useWebComponentFields = true,
  } = testConfig;

  const skippedTests = Array.isArray(skip) && new Set(skip);
  const testSuite = skip && !skippedTests ? describe.skip : describe;
  const testCase = (testKey, callback) =>
    skippedTests.has?.(testKey)
      ? context.skip(testKey, callback)
      : context(testKey, callback);
  const getTestTitle = testKey =>
    typeof testKey === 'object' ? testKey.title : testKey;
  const getTestData = testKey =>
    typeof testKey === 'object'
      ? cy.wrap(testKey.data)
      : cy.fixture(`${dataDir || fixtures.data}/${testKey}`);

  testSuite(appName, () => {
    before(() => {
      if (
        typeof dataDir === 'undefined' &&
        typeof fixtures.data === 'undefined'
      ) {
        throw new Error('Required data directory is undefined.');
      }

      setup();
    });

    // Aliases and the stub server reset before each test,
    // so those have to be set up _before each_ test.
    beforeEach(() => {
      // Dismiss any announcements.
      disableFTUXModals();

      cy.wrap(arrayPages).as('arrayPages');
      cy.wrap(useWebComponentFields).as('useWebComponentFields');

      // Resolve relative page hook paths as relative to the form's root URL.
      const resolvedPageHooks = Object.entries(pageHooks).reduce(
        (hooks, [pagePath, hook]) => ({
          ...hooks,
          [pagePath.startsWith(path.sep)
            ? pagePath
            : path.join(rootUrl, pagePath)]: hook,
        }),
        {},
      );

      cy.wrap(resolvedPageHooks).as('pageHooks');
    });

    const extractTestData = testData => get(dataPrefix, testData, testData);

    const createTestCase = testKey => {
      const title = getTestTitle(testKey);
      testCase(title, () => {
        beforeEach(() => {
          cy.wrap(title).as('testKey');
          getTestData(testKey)
            .then(extractTestData)
            .as('testData')
            .then(setupPerTest);
        });

        it('fills the form', () => {
          cy.visit(rootUrl).injectAxe();

          cy.get(LOADING_SELECTOR)
            .should('not.exist')
            .then(() => processPage({ stopTestAfterPath, _13647Exception }));
        });
      });
    };

    dataSets.forEach(createTestCase);
  });
};

export default testForm;
