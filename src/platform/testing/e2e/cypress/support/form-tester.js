import get from '../../../../utilities/data/get';

const ARRAY_ITEM_SELECTOR =
  'div[name^="topOfTable_"] ~ div.va-growable-background';

const FIELD_SELECTOR = 'input, select, textarea';

const testForm = (testDescription, testConfig) => {
  const runHook = pathname => {
    const hook = testConfig.pageHooks[pathname];
    if (!hook) return false;

    if (typeof hook !== 'function') {
      throw new Error(
        `Bad testConfig: Page hook for ${pathname} is not a function`,
      );
    }

    hook();
    return true;
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

  const enterData = field => {
    switch (field.type) {
      // Select fields register as having a type === 'select-one'
      case 'select-one':
        cy.get(`select[name="${field.key}"]`).select(field.data);
        break;

      case 'checkbox': {
        // Only click the checkbox if we need to.
        const checked = field.element.prop('checked');
        if ((checked && !field.data) || (!checked && field.data)) {
          cy.wrap(field.element).click();
        }
        break;
      }

      case 'textarea':
        cy.get(`textarea[id="${field.key}"]`)
          .clear()
          .type(field.data);
        break;

      case 'tel':
      case 'email':
      case 'number':
      case 'text': {
        cy.get(`input[name="${field.key}"]`)
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
        throw new Error(
          `Unknown element type '${field.type}' for ${field.key}`,
        );
    }
  };

  const createFieldObject = element => {
    const field = {
      element,
      key: element.prop('name') || element.prop('id'),
      type: element.prop('type') || element.prop('tagName'),
    };

    // Date fields in form data combine all the date components
    // (year, month, day), so treat as one input when filling out dates.
    field.key = field.key.replace(/(Year|Month|Day)$/, () => {
      field.type = 'date';
      return '';
    });

    return field;
  };

  // Supplement array page objects from form config with regex patterns so that
  // we can match page URLs against them to determine if they're array pages.
  const arrayPageObjects = testConfig.arrayPages.map(arrayPage => ({
    regex: new RegExp(arrayPage.path.replace(':index', '(\\d+)$')),
    ...arrayPage,
  }));

  // Check if the current page maps to an array page from the form config.
  // If there is a match, get the index from the URL.
  // Set up the path prefix for looking up test data under the array item
  // that corresponds to this page.
  const getArrayItemPath = pathname => {
    let index;

    const { arrayPath } =
      arrayPageObjects.find(({ regex }) => {
        const match = pathname.match(regex);
        if (match) [, index] = match;
        return match;
      }) || {};

    return arrayPath ? `${arrayPath}[${parseInt(index, 10)}]` : '';
  };

  const addNewArrayItem = $form => {
    const arrayTypeDivs = $form.find('div[name^="topOfTable_root_"]');

    if (arrayTypeDivs.length) {
      cy.wrap(arrayTypeDivs).each(arrayTypeDiv => {
        const arrayPath = arrayTypeDiv.attr('name').replace('topOfTable_', '');

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
  };

  const fillPage = () => {
    cy.location('pathname')
      .then(getArrayItemPath)
      .then(arrayItemPath => {
        const touchedFields = new Set();
        const snapshot = {};

        const fillAvailableFields = () => {
          cy.get('form.rjsf')
            .then($form => {
              // Get the starting number of array items and fields to compare
              // after filling out every field that is currently visible.
              snapshot.arrayItemCount = $form.find(ARRAY_ITEM_SELECTOR).length;
              snapshot.fieldCount = $form.find(FIELD_SELECTOR).length;
            })
            .within($form => {
              const fields = $form.find(FIELD_SELECTOR);
              if (!fields.length) return;

              cy.wrap(fields).each(element => {
                const field = createFieldObject(element);

                const shouldSkipField =
                  !field.key ||
                  touchedFields.has(field.key) ||
                  !field.key.startsWith('root_');

                if (shouldSkipField) return;

                field.prefix = arrayItemPath;
                field.data = findData(field);

                if (typeof field.data !== 'undefined') enterData(field);

                touchedFields.add(field.key);
              });

              // Compare the number of fields after filling all the available
              // fields from this iteration. If all currently visible fields
              // have been filled, try adding an array item if possible.
              if (snapshot.fieldCount === $form.find(FIELD_SELECTOR).length) {
                addNewArrayItem($form);
              }

              cy.wrap($form);
            })
            .then($form => {
              const { arrayItemCount, fieldCount } = snapshot;

              // If there are new array items or fields to be filled,
              // iterate through the page again.
              const fieldsNeedInput =
                arrayItemCount !== $form.find(ARRAY_ITEM_SELECTOR).length ||
                fieldCount !== $form.find(FIELD_SELECTOR).length;

              if (fieldsNeedInput) fillAvailableFields();
            });
        };

        fillAvailableFields();
      });
  };

  const processPage = () => {
    cy.location('pathname').then(pathname => {
      if (!pathname.endsWith('review-and-submit')) {
        cy.wrap(
          new Promise(resolve => {
            // Run hooks if there are any for this page.
            // Otherwise, fill out the page as usual.
            if (!runHook(pathname)) fillPage();
            resolve();
          }),
        );

        cy.findByText(/continue/i, { selector: 'button' })
          .click()
          .location('pathname')
          .then(newPathname => {
            if (pathname === newPathname) {
              throw new Error(`Expected to navigate away from ${pathname}`);
            }
          })
          .then(processPage);
      } else {
        cy.findByLabelText(/accept/i).click();
        cy.findByText(/submit/i, { selector: 'button' }).click();
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
      cy.visit(testConfig.url)
        .wait('@getMaintenanceWindows')
        .then(processPage);
    });
  });
};

export default testForm;
