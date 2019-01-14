const { parse: parseUrl } = require('url');
const _ = require('lodash/fp');

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
    case 'checkbox':
      // Only click the checkbox if we need to
      await page.click(
        `input[id="${selector}"]${fieldData ? ':not(checked)' : ':checked'}`,
      );
      break;
    case 'text':
      await page.type(`input[name="${selector}"]`, fieldData);
      break;
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
      if (date[2]) {
        await page.select(
          `select[name="${selector}Day"]`,
          parseInt(date[2], 10).toString(),
        );
      }
      await page.type(`input[name="${selector}Year"]`, date[0]);
      log(`Filling year for ${selector}: ${date[0]}`);
      break;
    }
    default:
      throw new Error(`Unknown element type '${type}' for ${selector}`);
  }
};

/**
 * Navigate through all the pages, filling in the data
 */
export const fillPage = async (page, testData, testConfig, log) => {
  const dataEntryPromises = (await page.$$eval('input, select', elements => {
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
    .filter(item => item) // Duplicates are null items
    .filter(item => item.selector.startsWith('root_')); // Only grab form fields

  for (const field of dataEntryPromises) {
    log('looping through fields:', field.selector);
    // We want these data entries to be performed synchronously
    // eslint-disable-next-line no-await-in-loop
    await enterData(page, field, findData(field.selector, testData), log);
  }
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
      await page.click('.form-progress-buttons .usa-button-primary');
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

module.exports = fillForm;
