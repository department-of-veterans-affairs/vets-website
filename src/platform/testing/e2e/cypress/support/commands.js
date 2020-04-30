/* eslint-disable no-console */

import get from '../../../../utilities/data/get';

const FIELD_SELECTOR = 'input, select, textarea';

Cypress.Commands.add('testForm', testConfig => {
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
    console.log('dataPath');
    console.log(testConfig.testData);
    console.log(dataPath);
    return get(dataPath, testConfig.testData);
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
      if (!cy.wrap(element)) return;

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
            .type(field.data);
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
      key: element.attr('name') || element.attr('id'),
      type: element.attr('type') || element.attr('tagName'),
    };

    // Date fields in form data combine all the date components
    // (year, month, day), so we will process two or three elements at once
    // when entering data for dates.
    field.key = field.key.replace(/(Year|Month|Day)$/, () => {
      // Set type to 'date' if the pattern matches a date component.
      field.type = 'date';
      return '';
    });

    return field;
  };

  const fillPage = () => {
    const touchedFields = new Set();

    cy.get(FIELD_SELECTOR).each(element => {
      const field = createFieldObject(element);

      const shouldSkip =
        !field.key ||
        touchedFields.has(field.key) ||
        !field.key.startsWith('root_');

      if (shouldSkip) return;

      field.data = findData(field);
      console.log('Built field object');
      console.log(field);
      if (typeof field.data !== 'undefined') enterData(field);
      touchedFields.add(field.key);
    });
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
        if (hook) {
          runHook(hook, pathname);
        } else {
          fillPage();
        }
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

  cy.visit(testConfig.url);
  processPage();
});
