const {
  expectNavigateAwayFrom,
} = require('../../../../platform/testing/e2e/helpers');
const { getUrl } = require('./helpers');

const isDateField = selector =>
  selector.endsWith('Year') ||
  selector.endsWith('Month') ||
  selector.endsWith('Day');

// eslint-disable-next-line
const findData = (field, testData) => {};

// NOTE: If the type is `select-one`, it's really a select element :mindblown:
// eslint-disable-next-line
const enterData = (client, field, fieldData) => {};

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
        enterData(client, field, findData(field, testData)),
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
