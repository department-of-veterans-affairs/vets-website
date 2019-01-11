/* eslint-disable no-unreachable */
const { parse: parseUrl } = require('url');
const _ = require('lodash/fp');
const { expect } = require('chai');

const isDateField = selector =>
  selector.endsWith('Year') ||
  selector.endsWith('Month') ||
  selector.endsWith('Day');

/**
 * Finds the data in testData for a single field.
 */
const findData = (fieldSelector, testData) => {
  const dataPath = fieldSelector.replace(/^root_/, '').replace('_', '.');
  return _.get(dataPath, testData);
};

/**
 * Enters data into a single field.
 */
const enterData = (page, field, fieldData) => {
  const { type, selector } = field;
  return;

  switch (type) {
    case 'select-one': // Select fields register as having a type === 'select-one'
    case 'select':
      page.selectDropdown(selector, fieldData);
      break;
    case 'checkbox':
      // Only click the checkbox if we need to
      page.execute(
        name => document.querySelector(`input[name="${name}"]`).checked,
        [selector],
        isChecked => {
          page.clickIf(
            `input[name="${selector}"]`,
            // If it's already checked and it shouldn't be, click
            // If it's not already checked and it should be, click
            isChecked ? !fieldData : fieldData,
          );
        },
      );
      break;
    case 'text':
      page.fill(`input[name="${selector}"]`, fieldData);
      break;
    case 'radio':
      typeof fieldData === 'boolean'
        ? page.selectYesNo(selector, fieldData)
        : page.selectRadio(selector, fieldData);
      break;
    case 'date':
      page.fillDate(selector, fieldData);
      break;
    default:
      page.assert.fail(`Unknown element type '${type}' for ${selector}`);
      break;
  }
};

/**
 * Navigate through all the pages, filling in the data
 */
const fillPage = async (page, testData) => {
  const selectors = new Set();

  const elements = await page.$$('input, select');
  elements
    .map(element => {
      // <select> elements have neither a type nor a name
      let type = element.type || element.tagName;
      let selector = element.name || element.id;

      // Date fields have one piece of data for two or three fields,
      //  so we only want the base selector to both find the data
      //  and use with our custom .fillDate() nightwatch command.
      if (isDateField(selector)) {
        type = 'date';
        // The fillDate nightwatch command takes the shortened version
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
    }, {})
    .filter(item => item)
    .forEach(field =>
      enterData(page, field, findData(field.selector, testData)),
    );
};

const fillForm = async (page, testData, testConfig) => {
  // We want these actions to be performed synchronously, so the await
  //  statements in the loop make sense.
  /* eslint-disable no-await-in-loop */
  while (!page.url().endsWith('review-and-submit')) {
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
      await fillPage(page, testData, testConfig);

      // Hit the continue button
      await page.click('.form-progress-buttons .usa-button-primary');
      await page.waitForNavigation();

      // URL should change if we don't have a validation error
      expect(page.url()).not.to.equal(url);
    }
  }
  /* eslint-enable no-await-in-loop */
};

module.exports = fillForm;
