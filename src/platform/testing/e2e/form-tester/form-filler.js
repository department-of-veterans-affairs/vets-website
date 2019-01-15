const { parse: parseUrl } = require('url');
const _ = require('lodash/fp');

const FIELD_SELECTOR = 'input, select';
const CONTINUE_BUTTON = '.form-progress-buttons .usa-button-primary';

/**
 * Finds the data in testData for a single field.
 */
const findData = (fieldSelector, testData) => {
  const dataPath = fieldSelector
    .replace(/^root_/, '')
    .replace(/_/g, '.')
    .replace(/\.(\d+)\./g, (match, number) => `[${number}]`);
  const result = _.get(dataPath, testData);
  return result;
};

/**
 * Enters data into a single field.
 */
const enterData = async (page, field, fieldData, log) => {
  const { type, selector } = field;
  if (fieldData === undefined) {
    log(`No data found for ${selector}`);
    return;
  }

  log(`${selector} (${type}):`, fieldData);

  switch (type) {
    case 'select-one': // Select fields register as having a type === 'select-one'
      await page.select(`select[name="${selector}"]`, fieldData);
      break;
    case 'checkbox': {
      // Only click the checkbox if we need to
      const checkbox = await page.$(
        `input[id="${selector}"]${fieldData ? ':not(checked)' : ':checked'}`,
      );
      if (checkbox) await checkbox.click();
      break;
    }
    case 'tel':
    case 'textarea':
    case 'text': {
      await page.type(`input[name="${selector}"]`, fieldData);
      // Get the autocomplete menu out of the way
      const role = await page.$eval(`input[name="${selector}"]`, textbox =>
        textbox.getAttribute('role'),
      );
      if (role === 'combobox') {
        await page.keyboard.press('Tab');
      }
      break;
    }
    case 'radio': {
      // Use 'Y' / 'N' if it's a boolean because of the yesNo widget
      let optionValue = fieldData;
      if (typeof fieldData === 'boolean') {
        optionValue = fieldData ? 'Y' : 'N';
      }
      await page.click(`input[name="${selector}"][value="${optionValue}"]`);
      break;
    }
    case 'date': {
      const date = fieldData.split('-');
      await page.select(
        `select[name="${selector}Month"]`,
        parseInt(date[1], 10).toString(),
      );
      if (date[2] !== 'XX') {
        await page.select(
          `select[name="${selector}Day"]`,
          parseInt(date[2], 10).toString(),
        );
      }
      await page.type(`input[name="${selector}Year"]`, date[0]);
      break;
    }
    case 'file': {
      if (fieldData) {
        // The upload endpoint should already be mocked; just click the button
        // TODO: Ensure the file we're uploading is valid for this input
        const fileField = await page.$(`input[id="${selector}"]`);
        // TODO: Change this to not assume the test is being run from the project root
        await fileField.uploadFile('./src/platform/testing/example-upload.png');
      }
      break;
    }
    default:
      throw new Error(`Unknown element type '${type}' for ${selector}`);
  }
};

/**
 * Returns a function that enters data for each field. When called subsequent times,
 *  it will only enter data into new fields (in the event that some fields have been
 *  expanded);
 */
const fillPage = async (page, testData, testConfig, log) => {
  const touchedFields = new Set();

  // Continue to fill out the fields until there are new fields shown
  let fieldCount;
  let newFieldCount;
  /* eslint-disable no-await-in-loop */
  do {
    fieldCount = await page.$$eval(FIELD_SELECTOR, elements => elements.length);
    log(
      'Field list:',
      await page.$$eval(FIELD_SELECTOR, elements =>
        elements.map(e => e.name || e.id),
      ),
    );
    const fields = (await page.$$eval(FIELD_SELECTOR, elements => {
      // This whole function is executed in the browser and can't contain references
      //  to anything outside of the local scope.
      const selectors = new Set();
      return elements.map(element => {
        // <select> elements have neither a type nor a name
        let type = element.type || element.tagName;
        let selector = element.name || element.id;

        // Date fields have one piece of data for two or three fields,
        //  so we only want the base selector to both find the data
        //  and use with our custom .fillDate() nightwatch command.
        const isDateField = sel =>
          sel.endsWith('Year') || sel.endsWith('Month') || sel.endsWith('Day');
        if (isDateField(selector)) {
          type = 'date';
          // We only have one date field in the test data, so we fill two or three
          //  fields with one enterData call
          selector = selector.replace(/(Year|Month|Day)$/, '');
        }

        // Make sure not to duplicate entries
        //  (specifically useful for radio buttons and date fields)
        if (selectors.has(selector)) {
          return null;
        }

        // Add the item to the set for easy lookup
        selectors.add(selector);

        return {
          type,
          selector,
        };
      });
    }))
      .filter(field => field) // Duplicates are null fields
      .filter(field => !touchedFields.has(field.selector))
      .filter(field => field.selector.startsWith('root_')); // Only grab form fields

    for (const field of fields) {
      touchedFields.add(field.selector);
      // We want these data entries to be performed synchronously
      // eslint-disable-next-line no-await-in-loop
      await enterData(page, field, findData(field.selector, testData), log);
    }

    // TODO: Check for arrays and click the appropriate add buttons
    // TODO: Check for multiple add buttons and warn if there are

    newFieldCount = await page.$$eval(
      FIELD_SELECTOR,
      elements => elements.length,
    );
  } while (fieldCount !== newFieldCount);
  /* eslint-enable no-await-in-loop */
};

const fillForm = async (page, testData, testConfig, log) => {
  // We want these actions to be performed synchronously, so the await
  //  statements in the loop make sense.
  /* eslint-disable no-await-in-loop */
  while (!page.url().endsWith('review-and-submit')) {
    log(page.url());
    // TODO: Run axe checker

    // If there's a page hook, run that
    const url = page.url();
    const hook = _.get(`pageHooks.${parseUrl(url).path}`, testConfig);
    if (hook) {
      if (typeof hook !== 'function') {
        throw new Error(
          `Bad testConfig: Page hook for ${url} is not a function`,
        );
      }
      const retVal = hook(page, testData, testConfig);
      if (retVal instanceof Promise) {
        await retVal;
      }
    } else {
      await fillPage(page, testData, testConfig, log);

      // Hit the continue button
      await page.click(CONTINUE_BUTTON);

      // Sometimes the pages isn't done re-rendering before we query for the
      //  elements on the next page, so wait a moment.
      // TODO: Figure out how to remove this arbitrary time
      await page.waitFor(500);

      // Sometimes an expanded field or something gets in the way
      //  Try again before failing the test
      if (page.url() === url) {
        await page.waitFor(300);
        page.click(CONTINUE_BUTTON);
      }

      if (page.url() === url) {
        try {
          await page.waitForNavigation({ timeout: 1000 });
        } catch (e) {
          throw new Error(`Expected to navigate away from ${url}`);
        }
      }
    }
  }
  /* eslint-enable no-await-in-loop */
};

module.exports = {
  enterData,
  fillPage,
  fillForm,
};
