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

const getElementSelector = (field, fieldData) => {
  const inputSelector = `input[name="${field.selector}"]`;
  const selectors = {
    'select-one': `select[name="${field.selector}"]`,
    checkbox: `input[id="${field.selector}"]${
      fieldData ? ':not(checked)' : ':checked'
    }`,
    tel: inputSelector,
    textarea: inputSelector,
    text: inputSelector,
    email: inputSelector,
    number: inputSelector,
    radio: `${inputSelector}[value="${
      // Use 'Y' / 'N' because of the yesNo widget
      // eslint-disable-next-line no-nested-ternary
      typeof fieldData === 'boolean' ? (fieldData ? 'Y' : 'N') : fieldData
    }"]`,
    // Date has two or three elements, but should always have a year
    // Return a valid selector so it doesn't get skippeG
    date: `input[name="${field.selector}Year"]`,
    file: inputSelector,
  };
  if (!selectors[field.type]) {
    throw new Error(
      `Unknown element type '${field.type}' for ${field.selector}`,
    );
  }

  return selectors[field.type];
};

/**
 * Enters data into a single field.
 */
const enterData = async (page, field, fieldData, log) => {
  const { type } = field;
  if (fieldData === undefined) {
    log(`No data found for ${field.selector}`);
    return;
  }

  log(`${field.selector} (${type}):`, fieldData);

  const selector = getElementSelector(field, fieldData);

  const element = await page.$(selector);

  if (!element) {
    log(`Skipping ${selector}; no element found.`);
    return;
  }

  switch (type) {
    case 'select-one': // Select fields register as having a type === 'select-one'
      // TODO: Error if it's not an option the select has
      await page.select(selector, fieldData);
      break;
    case 'checkbox': {
      // Only click the checkbox if we need to
      const checkbox = await page.$(selector);
      if (checkbox) await checkbox.click();
      break;
    }
    case 'tel':
    case 'textarea':
    case 'email':
    case 'number':
    case 'text': {
      // Clear text before typing
      await page.evaluate(sel => {
        document.querySelector(sel).value = '';
      }, selector);
      await page.type(selector, `${fieldData}`);
      // Get the autocomplete menu out of the way
      const role = await page.$eval(selector, textbox =>
        textbox.getAttribute('role'),
      );
      if (role === 'combobox') {
        await page.keyboard.press('Tab');
      }
      break;
    }
    case 'radio': {
      await page.click(selector);
      break;
    }
    case 'date': {
      const date = fieldData.split('-');
      await page.select(
        `select[name="${field.selector}Month"]`,
        parseInt(date[1], 10).toString(),
      );
      if (date[2] !== 'XX') {
        await page.select(
          `select[name="${field.selector}Day"]`,
          parseInt(date[2], 10).toString(),
        );
      }
      await page.type(`input[name="${field.selector}Year"]`, date[0]);
      break;
    }
    case 'file': {
      if (fieldData) {
        // The upload endpoint should already be mocked; just click the button
        // TODO: Ensure the file we're uploading is valid for this input
        const fileField = await page.$(selector);
        // TODO: Change this to not assume the test is being run from the project root
        await fileField.uploadFile('./src/platform/testing/example-upload.png');
      }
      break;
    }
    default:
      break;
  }
};

/**
 * Checks for array inputs and hits the add button for all the arrays that still have
 *  more data.
 * @param {Page} page - The page from puppeteer.
 * @param {Object} testData - The test data.
 */
const addNewArrayItem = async (page, testData) => {
  const arrayPaths = await page.$$eval('div[name^="topOfTable_root_"]', divs =>
    divs.map(d => d.name.replace('topOfTable_', '')),
  );

  arrayPaths.forEach(async path => {
    const lastIndex = await page.$eval(
      `div[name$="${path}"] > div:last-child > div[name^="table_root_"]`,
      // Grab the number at the very end
      div => parseInt(div.name.match(/\d+$/g), 10),
    );
    // Check the testData to see if it has more data
    const arrayData = findData(path, testData);
    if (arrayData.length >= lastIndex) {
      // If so, poke the appropriate add button
      await page.click(
        `div[name="topOfTable_${path}"] + button.va-growable-add-btn`,
      );
    }
  });
};

/**
 * Returns a function that enters data for each field. When called subsequent times,
 *  it will only enter data into new fields (in the event that some fields have been
 *  expanded);
 */
const fillPage = async (page, testData, testConfig, log = () => {}) => {
  // TODO: Make make log use getLogger
  // TODO: Remove testConfig from params
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
        let type = element.type || element.tagName;
        let selector = element.name || element.id;

        const isDateField = sel =>
          sel.endsWith('Year') || sel.endsWith('Month') || sel.endsWith('Day');
        if (isDateField(selector)) {
          type = 'date';
          // We only have one date field in the test data, so we fill two or three
          //  fields with one enterData call
          selector = selector.replace(/(Year|Month|Day)$/, '');
        }

        // Make sure not to duplicate entries
        //  (Specifically useful for radio buttons and date fields)
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
      await enterData(page, field, findData(field.selector, testData), log);
    }

    addNewArrayItem(page, testData);

    newFieldCount = await page.$$eval(
      FIELD_SELECTOR,
      elements => elements.length,
    );
  } while (fieldCount !== newFieldCount);
  /* eslint-enable no-await-in-loop */
};

/**
 * This is the main entry point. After all the setup has been performed, this function
 *  loops through the pages, filling in all the data it can until it gets to the review
 *  page.
 */
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

      // If we're still on the page, it may be because an element was expanded
      //  and we tried to enter data too fast; try again
      // NOTE: This won't trigger if the field we missed isn't required!
      if (page.url() === url) {
        // TODO: Figure out how to remove this arbitrary time
        await page.waitFor(300);
        await fillPage(page, testData, testConfig, log);
      }
    }

    if (page.url() === url) {
      try {
        await page.waitForNavigation({ timeout: 1000 });
      } catch (e) {
        throw new Error(`Expected to navigate away from ${url}`);
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
