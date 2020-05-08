import get from '../../../../utilities/data/get';

const FIELD_SELECTOR = 'input, select, textarea';
const ARRAY_ITEM_SELECTOR =
  'div[name^="topOfTable_"] ~ div.va-growable-background';

const testForm = (testDescription, testConfig) => {
  let currentPathname = testConfig.url;

  const runHook = (hook, pathname) => {
    if (typeof hook !== 'function') {
      throw new Error(
        `Bad testConfig: Page hook for ${pathname} is not a function`,
      );
    }

    hook();
  };

  const findData = field => {
    const dataPath = field.key
      .replace(/^root_/, '')
      .replace(/_/g, '.')
      .replace(/\._(\d+)\./g, (_, number) => `[${number}]`);

    return get(
      field.prefix ? `${field.prefix}.${dataPath}` : dataPath,
      testConfig.testData.data,
    );
  };

  const addNewArrayItem = () => {
    cy.get('body').then(body => {
      const arrayTypeDivs = body.find('div[name^="topOfTable_root_"]');
      if (arrayTypeDivs.length) {
        cy.wrap(arrayTypeDivs).each(arrayTypeDiv => {
          const arrayPath = arrayTypeDiv
            .attr('name')
            .replace('topOfTable_', '');

          cy.get(
            `div[name$="${arrayPath}"] ~ div:last-of-type > div[name^="table_root_"]`,
          ).then(arrayItemDiv => {
            const lastIndex = parseInt(
              arrayItemDiv.attr('name').match(/\d+$/g),
              10,
            );
            const arrayData = findData({ key: arrayPath });

            if (arrayData.length - 1 > lastIndex) {
              cy.get(
                `div[name="topOfTable_${arrayPath}"] ~ button.va-growable-add-btn`,
              ).click();
            }
          });
        });
      }
    });
  };

  const getElementSelector = field => {
    const inputSelector = `input[name="${field.key}"]`;

    const selectors = {
      'select-one': `select[name="${field.key}"]`,
      checkbox: `input[id="${field.key}"]${
        field.data ? ':not(checked)' : ':checked'
      }`,
      textarea: `textarea[id="${field.key}"]`,
      tel: inputSelector,
      text: inputSelector,
      email: inputSelector,
      number: inputSelector,
      radio: `${inputSelector}[value="${
        // Use 'Y' / 'N' because of the yesNo widget
        // eslint-disable-next-line no-nested-ternary
        typeof field.data === 'boolean' ? (field.data ? 'Y' : 'N') : field.data
      }"]`,
      // Date has two or three elements, but should always have a year
      // Return a valid selector so it doesn't get skipped
      date: `input[name="${field.key}Year"]`,
      file: inputSelector,
    };

    if (!selectors[field.type]) {
      throw new Error(`Unknown element type '${field.type}' for ${field.key}`);
    }

    return selectors[field.type];
  };

  const enterData = field => {
    const selector = getElementSelector(field);

    cy.get(selector).then(element => {
      switch (field.type) {
        case 'select-one': // Select fields register as having a type === 'select-one'
          // TODO: Error if it's not an option the select has
          cy.wrap(element).select(field.data);
          break;

        case 'checkbox': {
          // Only click the checkbox if we need to
          // const checkbox = await page.$(selector);
          // if (checkbox) await checkbox.click();
          cy.wrap(element).click();
          break;
        }

        case 'tel':
        case 'textarea':
        case 'email':
        case 'number':
        case 'text': {
          cy.wrap(element)
            .clear()
            .type(field.data)
            .then(() => {
              if (element.attr('role') === 'combobox') {
                cy.wrap(element).type('{downarrow}{enter}');
              }
            });
          /*
          // Get the autocomplete menu out of the way
          const role = await page.$eval(selector, textbox =>
            textbox.getAttribute('role'),
          );
          if (role === 'combobox') {
            await page.keyboard.press('Tab');
          }
          */
          break;
        }

        case 'radio': {
          cy.wrap(element).click();
          break;
        }

        case 'date': {
          const dateComponents = field.data.split('-');

          cy.wrap(element)
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
          /*
          if (fieldData) {
            // The upload endpoint should already be mocked; just click the button
            // TODO: Ensure the file we're uploading is valid for this input
            const fileField = await page.$(key);
            // TODO: Change this to not assume the test is being run from the project root
            await fileField.uploadFile('./src/platform/testing/example-upload.png');
          }
          */
          break;
        }

        default:
          break;
      }
    });
  };

  const createFieldObject = element => {
    const field = {
      element,
      key: element.prop('name') || element.prop('id'),
      type: element.prop('type') || element.prop('tagName'),
    };

    // Date fields in form data combine all the date components
    // (year, month, day), so we will process two or three elements at once
    // when entering dates.
    field.key = field.key.replace(/(Year|Month|Day)$/, () => {
      // Set type to 'date' if the pattern matches a date component.
      field.type = 'date';
      return '';
    });

    return field;
  };

  const fillPage = () => {
    const touchedFields = new Set();
    let arrayItemPath;

    cy.location('pathname').then(pathname => {
      let match;

      // Check if the current page maps to an array page from the form config.
      // If there is a match, get the index from the URL.
      const arrayPageObject = testConfig.arrayPages.find(arrayPage => {
        const re = new RegExp(
          arrayPage.path.replace(':index', '(?<index>\\d+)$'),
        );
        match = pathname.match(re);
        return match;
      });

      // Set up the path prefix for looking up test data under the array item
      // that corresponds to this page.
      if (arrayPageObject) {
        cy.log(
          `Current page ${pathname} matched with array page ${
            arrayPageObject.path
          }`,
        );
        const { arrayPath } = arrayPageObject;
        const index = parseInt(match.groups.index, 10);
        arrayItemPath = `${arrayPath}[${index}]`;
        cy.log(`Array item data at path: ${arrayItemPath}`);
      }
    });

    const fillAvailableFields = () => {
      let arrayItemCount;
      let fieldCount;

      // Get the starting number of fields.
      cy.get('body').then(body => {
        arrayItemCount = body.find(ARRAY_ITEM_SELECTOR).length;
        fieldCount = body.find(FIELD_SELECTOR).length;
      });

      cy.get(FIELD_SELECTOR).each(element => {
        const field = createFieldObject(element);
        cy.log(`Found field on page with key ${field.key}`);

        if (
          !field.key ||
          touchedFields.has(field.key) ||
          !field.key.startsWith('root_')
        )
          return;

        if (arrayItemPath) field.prefix = arrayItemPath;
        field.data = findData(field);

        if (typeof field.data === 'undefined') {
          cy.log(`No data found for ${field.key}`);
        } else {
          enterData(field);
        }

        touchedFields.add(field.key);
      });

      // Compare the number of fields before and after filling all the available
      // fields from this iteration. If there are new fields to be filled,
      // iterate through the page again.
      cy.get(FIELD_SELECTOR)
        .its('length')
        .then(length => {
          if (fieldCount === length) addNewArrayItem();
        });

      cy.get('body').then(body => {
        const fieldsNeedInput =
          arrayItemCount !== body.find(ARRAY_ITEM_SELECTOR).length ||
          fieldCount !== body.find(FIELD_SELECTOR).length;
        if (fieldsNeedInput) fillAvailableFields();
      });
    };

    fillAvailableFields();
  };

  const processPage = () => {
    cy.location('pathname')
      .then(pathname => {
        // Check if the form has advanced to the next page.
        if (pathname === currentPathname) {
          throw new Error(`Expected to navigate away from ${pathname}`);
        }

        // Update the current path name.
        currentPathname = pathname;

        // Run hooks if there are any for this page.
        // Otherwise, fill out the page as usual.
        const hook = testConfig.pageHooks[pathname];
        if (hook) runHook(hook, pathname);
        else fillPage();
      })
      .then(() => {
        if (!currentPathname.endsWith('review-and-submit')) {
          // Continue to the next page.
          cy.findByText(/continue/i, { selector: 'button' })
            .click()
            .then(processPage);
        }
      });
  };

  describe(testDescription, () => {
    before(() => {
      cy.server()
        .route('GET', 'v0/maintenance_windows', [])
        .as('getMaintenanceWindows')
        .then(testConfig.setup);
    });

    beforeEach(() => {
      testConfig.setupPerTest(testConfig);
    });

    it('fills the form', () => {
      cy.visit(testConfig.url).wait('@getMaintenanceWindows');
      processPage();
    });
  });
};

export default testForm;
