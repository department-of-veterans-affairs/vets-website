const { get } = require('../../../../platform/utilities/data');
const {
  expectNavigateAwayFrom,
} = require('../../../../platform/testing/e2e/helpers');
const { getUrl } = require('./helpers');

const isDateField = selector =>
  selector.endsWith('Year') ||
  selector.endsWith('Month') ||
  selector.endsWith('Day');

/**
 * Finds the data in testData for a single field.
 */
const findData = (fieldSelector, testData) => {
  const dataPath = fieldSelector.replace(/^root_/, '').replace('_', '.');
  return get(dataPath, testData);
};

/**
 * Enters data into a single field.
 */
const enterData = (client, field, fieldData) => {
  const { type, selector } = field;
  switch (type) {
    case 'select-one': // Select fields register as having a type === 'select-one'
    case 'select':
      client.selectDropdown(selector, fieldData);
      break;
    case 'checkbox':
      // Only click the checkbox if we need to
      client.execute(
        name => document.querySelector(`input[name="${name}"]`).checked,
        [selector],
        isChecked => {
          client.clickIf(
            `input[name="${selector}"]`,
            // If it's already checked and it shouldn't be, click
            // If it's not already checked and it should be, click
            isChecked ? !fieldData : fieldData,
          );
        },
      );
      break;
    case 'text':
      client.fill(`input[name="${selector}"]`, fieldData);
      break;
    case 'radio':
      typeof fieldData === 'boolean'
        ? client.selectYesNo(selector, fieldData)
        : client.selectRadio(selector, fieldData);
      break;
    case 'date':
      client.fillDate(selector, fieldData);
      break;
    default:
      client.assert.fail(`Unknown element type '${type}' for ${selector}`);
      break;
  }
};

/**
 * Navigate through all the pages, filling in the data
 */
const fillPage = (client, testData) => {
  client.execute(
    () => {
      const selectors = new Set();
      return Array.from(document.querySelectorAll('input, select'))
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
        .filter(item => item);
    },
    [],
    fieldList => {
      fieldList.forEach(field =>
        enterData(client, field, findData(field.selector, testData)),
      );
    },
  );
};

const fillForm = (client, testData, testConfig) => {
  client.repeatWhile(
    () => getUrl(client).endsWith('review-and-submit'),
    () => {
      client.axeCheck('.main');
      // If there's a page hook, run that
      const currentUrl = getUrl(client);
      const hook = testConfig.pageHook[currentUrl];
      if (hook) {
        if (typeof hook !== 'function') {
          throw new Error(
            `Bad testConfig: Page hook for ${currentUrl} is not a function`,
          );
        }
        testConfig.pageHook[currentUrl](client, testData, testConfig);
      } else {
        fillPage(client, testData, testConfig);
      }

      // Hit the continue button
      client.click('.form-progress-buttons .usa-button-primary');

      // URL should change if we don't have a validation error
      expectNavigateAwayFrom(client, currentUrl);
    },
  );
};

module.exports = fillForm;
