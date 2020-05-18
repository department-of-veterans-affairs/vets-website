const { parse: parseUrl } = require('url');
const _ = require('lodash/fp');
const { axe } = require('./util');

const FIELD_SELECTOR = 'input, select, textarea';
const CONTINUE_BUTTON = '.form-progress-buttons .usa-button-primary';
const ARRAY_ITEM_SELECTOR =
  'div[name^="topOfTable_"] ~ div.va-growable-background';

/**
 * Finds the data in testData for a single field.
 */
const findData = (fieldSelector, testData) => {
  const dataPath = fieldSelector
    .replace(/^root_/, '')
    .replace(/_/g, '.')
    .replace(/\._(\d+)\./g, (match, number) => `[${number}]`);
  return _.get(dataPath, testData);
};

const getElementSelector = (field, fieldData) => {
  const inputSelector = `input[name="${field.selector}"]`;
  const selectors = {
    'select-one': `select[name="${field.selector}"]`,
    checkbox: `input[id="${field.selector}"]${
      fieldData ? ':not(checked)' : ':checked'
    }`,
    textarea: `textarea[id="${field.selector}"]`,
    tel: inputSelector,
    text: inputSelector,
    email: inputSelector,
    number: inputSelector,
    radio: `${inputSelector}[value="${
      // Use 'Y' / 'N' because of the yesNo widget
      // eslint-disable-next-line no-nested-ternary
      typeof fieldData === 'boolean' ? (fieldData ? 'Y' : 'N') : fieldData
    }"]`,
    // Date has two or three elements, but should always have a year
    // Return a valid selector so it doesn't get skipped
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
      // Clear the year before typing
      const yearSelector = `input[name="${field.selector}Year"]`;
      await page.evaluate(sel => {
        document.querySelector(sel).value = '';
      }, yearSelector);
      await page.type(yearSelector, date[0]);
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
    divs.map(d => d.getAttribute('name').replace('topOfTable_', '')),
  );

  await Promise.all(
    arrayPaths.map(async path => {
      const lastIndex = await page.$eval(
        `div[name$="${path}"] ~ div:last-of-type > div[name^="table_root_"]`,
        // Grab the number at the very end
        div => parseInt(div.getAttribute('name').match(/\d+$/g), 10),
      );
      // Check the testData to see if it has more data
      const arrayData = findData(path, testData);
      if (arrayData.length - 1 > lastIndex) {
        // If so, poke the appropriate add button
        await page.click(
          `div[name="topOfTable_${path}"] ~ button.va-growable-add-btn`,
        );
      }
    }),
  );
};

const getFieldCount = async page =>
  page.$$eval(FIELD_SELECTOR, elements => elements.length);

const getArrayItemCount = async page =>
  page.$$eval(ARRAY_ITEM_SELECTOR, elements => elements.length);

/**
 * Gets a snapshot of all the relevant pieces of the page.
 * Used to determine whether the form app tester should continue entering data.
 *
 * @typedef {Object} Snapshot
 * @property {Number} fieldCount - The number of fields on the page
 * @property {Number} arrayItemCount - The number of array items on the page
 *
 * @param {Page} page - The page from puppeteer
 * @returns {Snapshot}
 */
const getSnapshot = async page => ({
  fieldCount: await getFieldCount(page),
  arrayItemCount: await getArrayItemCount(page),
});

/**
 * Performs a shallow comparison of two snapshots.
 * @param {Snapshot} original - The original snapshot before data was entered
 * @param {Snapshot} newSnapshot - The new snapshot after data was entered
 * @returns {Boolean} True if the snapshots don't match
 */
const fieldsNeedInput = (original, newSnapshot) =>
  !Object.keys(original).every(key => original[key] === newSnapshot[key]);

/**
 * Returns the arrayPath and index for the current URL.
 * If we have multiple levels of nested array pages, this will probably fail.
 */
const getArrayInfo = (url, arrayPages = []) => {
  const arrayPathObject = arrayPages.find(arrayPage =>
    url.replace(/\d+$/, '').endsWith(arrayPage.path.replace(':index', '')),
  );
  return arrayPathObject
    ? {
        arrayPath: arrayPathObject.arrayPath,
        index: parseInt(url.match(/\d+/g).pop(), 10), // Naively assumes the last number in the url is the index
      }
    : {};
};

const getArrayData = (testData, arrayPageConfig) =>
  findData(`${arrayPageConfig.arrayPath}`, testData)[arrayPageConfig.index];

/**
 * Enters data for each field, looping until no more fields have been expanded and
 *  no more array items are available in the test data.
 */
const fillPage = async (page, testData, testConfig, log = () => {}) => {
  // TODO: Make log use getLogger
  const touchedFields = new Set();
  let pageData = testData;
  const arrayPageConfig = getArrayInfo(page.url(), testConfig.arrayPages);
  if (arrayPageConfig.arrayPath) {
    log('Found arrayPath', arrayPageConfig.arrayPath);
    pageData = getArrayData(testData, arrayPageConfig);
  }

  // Continue to fill out the fields until there are new fields shown
  let originalSnapshot;
  /* eslint-disable no-await-in-loop */
  do {
    originalSnapshot = await getSnapshot(page);
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
          // We only have one date field in the test data, but we fill two or three
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
      await enterData(page, field, findData(field.selector, pageData), log);
    }

    // If we have newly-expanded fields, they may be array fields.
    // Add a new array item as needed only after we have no more expanded fields.
    if (!fieldsNeedInput(originalSnapshot, await getSnapshot(page))) {
      await addNewArrayItem(page, testData);
    }
  } while (fieldsNeedInput(originalSnapshot, await getSnapshot(page)));
  /* eslint-enable no-await-in-loop */
};

/**
 * Waits until the URL changes or the timeout is reached before returning the current URL.
 *
 * @param {Page} page - The page from puppeteer
 * @param {object} options
 * @param {number} options.timeout - The maximum number of milliseconds to wait before returning
 * @param {string} options.previousUrl - The previous URL; used to bypass the loop if the URL already changed
 * @return {string} The current URL
 */
const nextUrl = async (page, options = {}) => {
  const opts = Object.assign(
    { previousUrl: page.url(), timeout: 500 },
    options,
  );

  if (page.url() !== opts.previousUrl) return page.url();

  try {
    await page.waitForNavigation({ timeout: opts.timeout });
    return page.url();
  } catch (e) {
    return page.url();
  }
};

/**
 * This is the main entry point. After all the setup has been performed, this function
 *  loops through the pages, filling in all the data it can until it gets to the review
 *  page.
 */
const fillForm = async (page, testData, testConfig, log) => {
  const runHook = async hook => {
    if (typeof hook !== 'function') {
      throw new Error(
        `Bad testConfig: Page hook for ${page.url()} is not a function`,
      );
    }
    return hook(page, testData, testConfig, log);
  };

  // We want these actions to be performed synchronously, so the await
  //  statements in the loop make sense.
  /* eslint-disable no-await-in-loop */
  while (!page.url().endsWith('review-and-submit')) {
    log(page.url());

    // If there's a page hook, run that
    const url = page.url();
    const hook = _.get(`pageHooks.${parseUrl(url).path}`, testConfig);
    if (hook) {
      await runHook(hook);

      // Check axe after running the hook
      await axe.expandAndCheck(page, log);
    } else {
      await fillPage(page, testData, testConfig, log);

      // Check axe after filling in the page
      await axe.expandAndCheck(page, log);

      // Hit the continue button
      log('Clicking continue');
      await page.click(CONTINUE_BUTTON);

      // If we're still on the page, it may be because an element was expanded
      //  and we tried to enter data too fast; try again
      // NOTE: This won't trigger if the field we missed isn't required!
      if ((await nextUrl(page, { previousUrl: url })) === url) {
        await fillPage(page, testData, testConfig, log);
        log('Clicking continue again');
        await page.click(CONTINUE_BUTTON);
      }
    }

    if ((await nextUrl(page, { previousUrl: url, timeout: 1000 })) === url) {
      const messages = await page.$$eval('.usa-input-error-message', errors =>
        errors.map(error => [error.getAttribute('id'), error.innerText]),
      );
      messages.forEach(([id, message]) => {
        // eslint-disable-next-line no-console
        console.error(`${id}: ${message}`);
      });
      throw new Error(`Expected to navigate away from ${url}`);
    }
  }
  /* eslint-enable no-await-in-loop */

  // Run the review page hook if available
  const reviewHook = _.get(
    `pageHooks.${parseUrl(page.url()).path}`,
    testConfig,
  );
  if (reviewHook) {
    await runHook(reviewHook);
  }

  // Expand review & submit accordions
  await axe.expandAndCheck(page, log);

  // Submit the form
  log('Submitting the form');
  await page.click('input[name="privacyAgreementAccepted"]');

  await page.click('button.usa-button-primary');

  // We should be on the confirmation page if all goes well
  if (!(await nextUrl(page)).endsWith('confirmation')) {
    // If we can tell what the problem probably is, provide a more helpful error message
    try {
      const message = await page.$eval(
        '.usa-alert-body',
        node => node.innerText,
      );
      if (message.includes('an error connecting to')) {
        throw new Error('Error submitting the form. Is the submission mocked?');
      }
    } catch (e) {
      throw new Error(
        `Error submitting the form. Expected to be on the confirmation page, instead got ${page.url()}`,
      );
    }
  }

  // Run the confirmation hook if available
  const confirmationHook = _.get(
    `pageHooks.${parseUrl(page.url()).path}`,
    testConfig,
  );
  if (confirmationHook) {
    await runHook(confirmationHook);
  }

  await axe.check(page, log);

  if (axe.getViolations().size > 0) {
    const message = axe.formatViolations();
    throw new Error(`Axe violations:${message}`);
  }
  axe.clear();
};

module.exports = {
  enterData,
  fillPage,
  fillForm,
};
