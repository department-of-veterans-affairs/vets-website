import get from '../../../../utilities/data/get';

const ARRAY_ITEM_SELECTOR =
  'div[name^="topOfTable_"] ~ div.va-growable-background';

const FIELD_SELECTOR = 'input, select, textarea';

// Suppress logs for most commands, particularly calls to wrap and get
// that are mainly there to support more specific operations.
const COMMAND_OPTIONS = { log: false };

/**
 * Builds an object from a form field with attributes that are used
 * to look up test data and enter that data into the field.
 *
 * typedef {Object} Field
 * @property {Element}  - An element returned from querying form elements.
 * @property {string} key - String that is used for data lookup.
 * @property {string} type - Field type for deciding how to input data.
 * @property {string} [arrayItemPath] - Prefix for resolving path when
 *     looking up data for fields in an array item.
 * @property {string} [data] - Data to enter into the field input.
 *
 * @param {Element} element
 * @returns {Field}
 */
const createFieldObject = element => {
  const field = {
    element,
    key: element.prop('name') || element.prop('id'),
    type: element.prop('type') || element.prop('tagName'),
  };

  const containerClass = element.parent().attr('class');

  if (containerClass && containerClass.includes('date')) {
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
  cy.get('@arrayPageObjects', COMMAND_OPTIONS).then(arrayPageObjects => {
    let index;

    const { arrayPath } =
      arrayPageObjects.find(({ regex }) => {
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
                  .click();
              }
            }
          });
        });
    });
  }
};

/**
 * Top level loop that invokes all of the processing for a form page
 * (either running a page hook or filling out its fields) and
 * continues on to the next page. When it gets to the review page,
 * it submits the form.
 */
const processPage = () => {
  cy.location('pathname', COMMAND_OPTIONS).then(pathname => {
    if (pathname.endsWith('review-and-submit')) {
      // Run page hook for review page if any.
      cy.execHook(pathname);

      cy.findByLabelText(/accept/i).click();
      cy.findByText(/submit/i, { selector: 'button' }).click();
      cy.location('pathname').then(finalPathname => {
        expect(finalPathname).to.match(/confirmation$/);

        // Run page hook for confirmation page if any.
        cy.execHook(finalPathname);
      });
    } else {
      cy.execHook(pathname).then(hookExecuted => {
        if (!hookExecuted) cy.fillPage();
      });

      cy.findByText(/continue/i, { selector: 'button' })
        .click()
        .location('pathname', COMMAND_OPTIONS)
        .then(newPathname => {
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
 *
 * @param {string} pathname - The pathname for the current URL.
 * @returns {boolean} Resolves true if a hook ran and false otherwise.
 */
Cypress.Commands.add('execHook', pathname => {
  cy.get('@testConfig', COMMAND_OPTIONS).then(({ pageHooks }) => {
    const hook = pageHooks && pageHooks[pathname];
    if (hook) {
      if (typeof hook !== 'function') {
        throw new Error(`Page hook for ${pathname} is not a function`);
      }

      cy.wrap(
        new Promise(resolve => {
          hook();
          resolve(true);
        }),
        COMMAND_OPTIONS,
      );
    } else {
      cy.wrap(false, COMMAND_OPTIONS);
    }
  });
});

/**
 * Looks up data for a field.
 *
 * @param {Field}
 * @returns {*} Resolves to the field data if found or undefined otherwise.
 */
Cypress.Commands.add('findData', field => {
  let resolvedDataPath;

  cy.get('@testConfig', COMMAND_OPTIONS).then(({ dataPathPrefix }) => {
    cy.get('@testData', COMMAND_OPTIONS).then(testData => {
      const relativeDataPath = field.key
        .replace(/^root_/, '')
        .replace(/_/g, '.')
        .replace(/\._(\d+)\./g, (_, number) => `[${number}]`);

      // Prefix the path to the array item if this field belongs to one.
      resolvedDataPath = field.arrayItemPath
        ? `${field.arrayItemPath}.${relativeDataPath}`
        : relativeDataPath;

      // Prefix any specified path to find data in the test data structure.
      resolvedDataPath = dataPathPrefix
        ? `${dataPathPrefix}.${resolvedDataPath}`
        : resolvedDataPath;

      cy.wrap(get(resolvedDataPath, testData), COMMAND_OPTIONS);
    });
  });

  Cypress.log({
    message: field.key,
    consoleProps: () => ({ ...field, resolvedDataPath }),
  });
});

/**
 * Enters data for a field.
 *
 * @param {Field}
 */
Cypress.Commands.add('enterData', field => {
  switch (field.type) {
    // Select fields register as having a type === 'select-one'
    case 'select-one':
      cy.wrap(field.element).select(field.data);
      break;

    case 'checkbox': {
      // Only click the checkbox if we need to
      const checked = field.element.prop('checked');
      if ((checked && !field.data) || (!checked && field.data)) {
        cy.wrap(field.element).click();
      }
      break;
    }

    case 'textarea':
    case 'tel':
    case 'email':
    case 'number':
    case 'text': {
      cy.wrap(field.element)
        .clear()
        .type(field.data)
        .then(element => {
          // Get the autocomplete menu out of the way
          if (element.attr('role') === 'combobox') {
            cy.wrap(element).type('{downarrow}{enter}');
          }
        });
      break;
    }

    case 'radio': {
      cy.get(
        `input[name="${field.key}"][value="${
          // Use 'Y' / 'N' because of the yesNo widget
          // eslint-disable-next-line no-nested-ternary
          typeof field.data === 'boolean'
            ? field.data
              ? 'Y'
              : 'N'
            : field.data
        }"]`,
      ).click();
      break;
    }

    case 'date': {
      const dateComponents = field.data.split('-');

      cy.get(`input[name="${field.key}Year"]`)
        .clear()
        .type(dateComponents[0]);

      cy.get(`select[name="${field.key}Month"]`).select(
        parseInt(dateComponents[1], 10).toString(),
      );

      if (dateComponents[2] !== 'XX') {
        cy.get(`select[name="${field.key}Day"]`).select(
          parseInt(dateComponents[2], 10).toString(),
        );
      }

      break;
    }

    case 'file': {
      cy.get(`input[id="${field.key}"]`)
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
  cy.location('pathname', COMMAND_OPTIONS)
    .then(getArrayItemPath)
    .then(arrayItemPath => {
      const touchedFields = new Set();
      const snapshot = {};

      const fillAvailableFields = () => {
        cy.get('form.rjsf', COMMAND_OPTIONS)
          .then($form => {
            // Get the starting number of array items and fields to compare
            // after filling out every field that is currently visible.
            snapshot.arrayItemCount = $form.find(ARRAY_ITEM_SELECTOR).length;
            snapshot.fieldCount = $form.find(FIELD_SELECTOR).length;
          })
          .within(COMMAND_OPTIONS, $form => {
            const fields = $form.find(FIELD_SELECTOR);
            if (!fields.length) return;

            cy.wrap(fields).each(element => {
              cy.wrap(createFieldObject(element), COMMAND_OPTIONS).then(
                field => {
                  const shouldSkipField =
                    !field.key ||
                    touchedFields.has(field.key) ||
                    !field.key.startsWith('root_');

                  if (shouldSkipField) return;

                  cy.findData({ ...field, arrayItemPath }).then(data => {
                    if (typeof data !== 'undefined') {
                      cy.enterData({ ...field, data });
                    }

                    touchedFields.add(field.key);
                  });
                },
              );
            });

            // Compare the number of fields after filling all the available
            // fields from this iteration. If all currently visible fields
            // have been filled, try adding an array item if possible.
            if (snapshot.fieldCount === $form.find(FIELD_SELECTOR).length) {
              addNewArrayItem($form);
            }

            cy.wrap($form, COMMAND_OPTIONS);
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
 * @typedef {object} TestConfig
 * @property {array<ArrayPage>} arrayPaths
 * @property {string} dataPathPrefix - The path prefix for looking up form data
 *     to fill out fields. Used when the data is nested under a certain key.
 *     For example, if the test data looks like { data: { field1: 'value' } },
 *     dataPathPrefix should be set to 'data'.
 * @property {object} dataSets - The sets of data used to fill out fields during
 *     the form flow. A test is generated for each data set and uses that data
 *     for that run. Each data set should follow the same structure as the body
 *     of the API request sent for a form submission.
 * @property {object.<function>} pageHooks - Functions used to bypass the
 *     automatic form filling for specified pages. Each object key corresponds
 *     to the URL of the page the hook applies to.
 * @property {function} setup - Function that's called once before starting any
 *     tests. Corresponds to the before (all) hook.
 * @property {function} setupPerTest - Function that's called before each test.
 * @property {string} url - The URL for the form. All tests start by going here.
 * ---
 * @typedef {object} ArrayPage
 * @property {string} arrayPath - The arrayPath defined in the form config
 * @property {string} url - The URL for the array page
 * ---
 * @param {string} testDescription - Label to describe the test
 * @param {TestConfig} testConfig
 */
const testForm = (testDescription, testConfig) => {
  describe(testDescription, () => {
    // Supplement any array page objects from form config with regex patterns
    // for later processing when we match page URLs against them
    // in order to determine whether the pages are array pages, and if so,
    // which index in the array they correspond to.
    const arrayPageObjects = (testConfig.arrayPages || []).map(arrayPage => ({
      regex: new RegExp(arrayPage.path.replace(':index', '(\\d+)$')),
      ...arrayPage,
    }));

    before(() => {
      if (testConfig.setup) testConfig.setup();
    });

    // Aliases and the stub server reset before every test,
    // so those have to be set up _before each_ test.
    beforeEach(() => {
      cy.wrap(testConfig).as('testConfig');
      cy.wrap(arrayPageObjects).as('arrayPageObjects');

      cy.server()
        .route('GET', 'v0/maintenance_windows', [])
        .as('getMaintenanceWindows');
    });

    Object.keys(testConfig.dataSets).forEach(testKey => {
      context(testKey, () => {
        beforeEach(() => {
          cy.wrap(testConfig.dataSets[testKey]).as('testData');

          if (testConfig.setupPerTest) {
            testConfig.setupPerTest(testConfig);
          }
        });

        it('fills the form', () => {
          cy.visit(testConfig.url)
            .wait('@getMaintenanceWindows')
            .then(processPage);
        });
      });
    });
  });
};

export default testForm;
