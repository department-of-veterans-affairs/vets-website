/* eslint-disable no-await-in-loop, no-continue, no-use-before-define, no-console, import/no-dynamic-require, prefer-destructuring */
/**
 * Playwright form-tester.
 *
 * Port of cypress/support/form-tester/index.js for Playwright.
 *
 * This is the core form testing engine that recursively walks through
 * a VA.gov form, filling out pages with test data and verifying navigation.
 *
 * Key architectural differences from the Cypress version:
 * - Uses async/await instead of Cypress command chaining
 * - Uses page.locator() with native shadow DOM piercing instead of
 *   .shadow().find() and cy.get()
 * - Uses page.fill() (instant) instead of cy.type() (per keystroke)
 * - Runs axe checks via @axe-core/playwright AxeBuilder
 */

const path = require('path');
const { test, expect } = require('@playwright/test');
const get = require('lodash/get');

const {
  enterWebComponentData,
  selectVaCheckbox,
} = require('../helpers/webComponents');
const { axeCheck, formatViolations } = require('../helpers/axeCheck');
const { fillPatterns } = require('./patterns');
const { resolvePageHooks, fieldKeyToDataPath } = require('./utilities');

const APP_SELECTOR = '#react-root';
const FIELD_SELECTOR = 'input, select, textarea';
const WEB_COMPONENT_SELECTORS =
  'va-text-input, va-select, va-textarea, va-radio-option, va-checkbox, va-combo-box, va-date, va-memorable-date, va-telephone-input, va-file-input, va-file-input-multiple';
const LOADING_SELECTOR = 'va-loading-indicator';
const ERROR_SELECTORS = [
  'fieldset [error]:not([error=""])',
  'fieldset .usa-input-error-message',
];

/**
 * Looks up test data for a field.
 *
 * @param {string} key - The field key (e.g., root_veteran_fullName_first)
 * @param {string} arrayItemPath - Prefix for array item data
 * @param {Object} testData - The test data object
 * @returns {*} The field data or undefined
 */
function findData(key, arrayItemPath, testData) {
  const relativeDataPath = fieldKeyToDataPath(key);
  const resolvedDataPath = arrayItemPath
    ? `${arrayItemPath}.${relativeDataPath}`
    : relativeDataPath;
  return get(testData, resolvedDataPath);
}

/**
 * Checks if the current pathname matches an array page.
 *
 * @param {string} pathname - Current page pathname
 * @param {Array} arrayPages - Array page objects from config
 * @returns {{arrayItemPath: string, index: number}}
 */
function getArrayItemPath(pathname, arrayPages) {
  let index;
  const match = arrayPages.find(({ regex }) => {
    const m = pathname.match(regex);
    if (m) [, index] = m;
    return m;
  });

  const indexNumber = parseInt(index, 10);
  return {
    arrayItemPath: match ? `${match.arrayPath}[${indexNumber}]` : '',
    index: indexNumber,
  };
}

/**
 * Builds a field object from a DOM element handle.
 *
 * @param {import('@playwright/test').Locator} locator
 * @returns {Promise<Object>} Field descriptor
 */
async function createFieldObject(locator) {
  return locator.evaluate(el => {
    const tagName = el.tagName;
    const key = el.getAttribute('name') || el.getAttribute('id') || '';
    let type = el.type || tagName;

    const isDateField = el.parentElement
      ?.getAttribute('class')
      ?.includes('date');
    if (isDateField) {
      type = 'date';
    }

    return {
      key: isDateField ? key.replace(/(Year|Month|Day)$/, '') : key,
      type,
      tagName,
    };
  });
}

/**
 * Enters data into a standard (non-web-component) form field.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} field - Field descriptor with key, type, data
 */
async function enterData(page, field) {
  switch (field.type) {
    case 'select-one': {
      const select = page.locator(
        `select[name="${field.key}"], select[id="${field.key}"]`,
      );
      await select.selectOption(field.data.toString());
      break;
    }

    case 'checkbox': {
      const checkbox = page.locator(
        `input[type="checkbox"][name="${
          field.key
        }"], input[type="checkbox"][id="${field.key}"]`,
      );
      if (field.data) {
        await checkbox.check({ force: true });
      } else {
        await checkbox.uncheck({ force: true });
      }
      break;
    }

    case 'textarea':
    case 'tel':
    case 'email':
    case 'number':
    case 'text': {
      const input = page
        .locator(
          `[name="${field.key}"]:not([disabled]), [id="${
            field.key
          }"]:not([disabled])`,
        )
        .first();
      await input.clear();
      await input.fill(field.data.toString());
      // Dismiss autocomplete if present
      const role = await input.getAttribute('role');
      if (role === 'combobox') {
        await input.blur();
      }
      break;
    }

    case 'radio': {
      let value = field.data;
      if (typeof value === 'boolean') value = value ? 'Y' : 'N';
      const radio = page.locator(
        `input[name="${field.key}"][value="${value}"]`,
      );
      await radio.check({ force: true });
      break;
    }

    case 'date': {
      const [year, month, day] = field.data.split('-').map(
        c =>
          // eslint-disable-next-line no-restricted-globals
          isFinite(c) ? parseInt(c, 10).toString() : c,
      );

      const escapedKey = CSS.escape(field.key);

      await page.locator(`#${escapedKey}Year`).clear();
      await page.locator(`#${escapedKey}Year`).fill(year);
      await page.locator(`#${escapedKey}Month`).selectOption(month);
      if (day !== 'XX') {
        await page.locator(`#${escapedKey}Day`).selectOption(day);
      }
      break;
    }

    case 'file': {
      const escapedFileKey = CSS.escape(field.key);
      await page
        .locator(`#${escapedFileKey}`)
        .setInputFiles('src/platform/testing/example-upload.png');

      // Wait for upload to complete
      await expect(page.locator('.schemaform-file-uploading')).toHaveCount(0, {
        timeout: 10000,
      });
      break;
    }

    default:
      throw new Error(`Unknown element type '${field.type}' for ${field.key}`);
  }
}

/**
 * Enters data into a field — dispatches to web component helper or standard.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} field - Field descriptor with key, type, data, tagName
 */
async function enterFieldData(page, field) {
  if (field.tagName?.includes('VA-')) {
    await enterWebComponentData(page, field);
  } else {
    await enterData(page, field);
  }
}

/**
 * Captures validation errors on the current page.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string[]>} Array of error descriptions
 */
async function captureValidationErrors(page) {
  const errors = [];

  for (const selector of ERROR_SELECTORS) {
    const elements = page.locator(selector);
    const count = await elements.count();

    for (let i = 0; i < count; i++) {
      const el = elements.nth(i);
      const visible = await el.isVisible();
      if (!visible) continue;

      const tagName = await el.evaluate(e => e.tagName.toLowerCase());
      let text = '';

      if (tagName.startsWith('va-')) {
        text = (await el.getAttribute('error')) || '';
      } else {
        text = (await el.textContent()?.trim()) || '';
        text = text.replace(/^Error\s+/, '');
      }

      if (text) {
        let fieldName =
          (await el.getAttribute('name')) ||
          (await el.getAttribute('id')) ||
          '';
        if (fieldName.endsWith('-error-message')) {
          fieldName = fieldName.replace('-error-message', '');
        }
        const fieldPrefix = fieldName ? `"${fieldName}" ` : '';
        const tagSuffix = tagName.startsWith('va-') ? `(${tagName})` : '';
        errors.push(`  * ${fieldPrefix}${tagSuffix}: "${text}"`);
      }
    }
  }

  return errors;
}

/**
 * Fills all fields on a page, looping until no new fields appear.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} testData - Test data object
 * @param {Array} arrayPages - Array page configs
 * @param {boolean} useWebComponentFields - Whether to fill web component fields
 * @returns {Promise<{abortProcessing: boolean}>}
 */
async function fillPage(page, testData, arrayPages, useWebComponentFields) {
  const pathname = new URL(page.url()).pathname;
  const { arrayItemPath } = getArrayItemPath(pathname, arrayPages);
  const touchedFields = new Set();

  const fieldSelector = useWebComponentFields
    ? `${FIELD_SELECTOR}, ${WEB_COMPONENT_SELECTORS}`
    : FIELD_SELECTOR;

  const findDataFn = (key, arrPath) => findData(key, arrPath, testData);

  let hasNewFields = true;

  while (hasNewFields) {
    // Fill pattern fields first
    const patternResult = await fillPatterns(
      page,
      arrayItemPath,
      touchedFields,
      findDataFn,
    );
    if (patternResult?.abortProcessing) {
      return { abortProcessing: true };
    }

    const appRoot = page.locator(APP_SELECTOR);
    const fields = appRoot.locator(fieldSelector);
    const fieldCount = await fields.count();
    let filledAny = false;

    for (let i = 0; i < fieldCount; i++) {
      const fieldLocator = fields.nth(i);

      const field = await createFieldObject(fieldLocator);

      // Skip if not eligible
      if (
        !field.key ||
        touchedFields.has(field.key) ||
        !field.key.startsWith('root_')
      ) {
        continue;
      }

      // Check if disabled
      const disabled = await fieldLocator.evaluate(
        el => el.disabled || el.getAttribute('disabled') !== null,
      );
      if (disabled) continue;

      // Check if detached
      const attached = await fieldLocator.evaluate(el => el.isConnected);
      if (!attached) continue;

      const data = findDataFn(field.key, arrayItemPath);
      if (data !== undefined) {
        await enterFieldData(page, { ...field, data });
        filledAny = true;
      }
      touchedFields.add(field.key);
    }

    // Check if new fields appeared
    const newFieldCount = await appRoot.locator(fieldSelector).count();
    hasNewFields = filledAny && newFieldCount !== fieldCount;
  }

  return { abortProcessing: false };
}

/**
 * Provides the default post-hook action for a page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} pathname
 */
async function defaultPostHook(page, pathname) {
  if (pathname.endsWith('/review-and-submit')) {
    // Check privacy agreement box if it exists
    const privacyAgreement = page.locator('[name^="privacyAgreement"]');
    if ((await privacyAgreement.count()) > 0) {
      const tagName = await privacyAgreement.first().evaluate(el => el.tagName);
      if (tagName === 'VA-PRIVACY-AGREEMENT' || tagName === 'VA-CHECKBOX') {
        // Both va-privacy-agreement and va-checkbox use checked + vaChange
        await privacyAgreement.first().evaluate(el => {
          el.checked = true; // eslint-disable-line no-param-reassign
          el.dispatchEvent(
            new CustomEvent('vaChange', {
              detail: { checked: true },
              bubbles: true,
            }),
          );
        });
      } else if (tagName.startsWith('VA-')) {
        const name = await privacyAgreement.first().getAttribute('name');
        await selectVaCheckbox(page, name, true);
      } else {
        await privacyAgreement.first().check({ force: true });
      }
    }
    // Click submit
    await clickFormContinue(page);
    return;
  }

  if (pathname.match(/\/(start|introduction|confirmation)$/)) {
    return;
  }

  // Click continue
  await clickFormContinue(page);
}

/**
 * Clicks the form's Continue/Submit button.
 *
 * @param {import('@playwright/test').Page} page
 */
async function clickFormContinue(page) {
  // Scope to main content area to avoid matching header/footer buttons
  const main = page.locator('main');

  // Try va-button-pair first, then fallback
  const vaButtonPair = main.locator('va-button-pair');
  if ((await vaButtonPair.count()) > 0) {
    const primaryBtn = vaButtonPair
      .first()
      .locator('va-button:not([secondary]):not([back])')
      .first();
    if ((await primaryBtn.count()) > 0) {
      await primaryBtn.click();
      return;
    }
  }

  // Try standard continue/submit buttons
  const continueBtn = main
    .locator(
      'button.usa-button-primary, button[type="submit"], .form-progress-buttons .usa-button-primary',
    )
    .first();
  if ((await continueBtn.count()) > 0) {
    await continueBtn.click();
    return;
  }

  // Fallback: any button with Continue or Submit text
  const textBtn = main
    .locator('button:has-text("Continue"), button:has-text("Submit")')
    .first();
  if ((await textBtn.count()) > 0) {
    await textBtn.click();
  }
}

/**
 * Executes a page hook if one exists for the current pathname.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} pathname
 * @param {Object} pageHooks - Map of pathname to hook functions
 * @param {Array} arrayPages - Array page configs
 * @returns {Promise<{hookExecuted: boolean, postHook: Function|null}>}
 */
async function execHook(page, pathname, pageHooks, arrayPages, testData) {
  const REGEXP_PATH_INDEX = /\/\d+(?:\/|$)/;
  const REGEXP_REMOVE_END_SLASH = /\/$/;

  const { index } = getArrayItemPath(pathname, arrayPages);

  const pathnameKey = REGEXP_PATH_INDEX.test(pathname)
    ? pathname
        .split(REGEXP_PATH_INDEX)
        .join('/:index/')
        .replace(REGEXP_REMOVE_END_SLASH, '')
    : pathname;

  const hook = pageHooks?.[pathname] || pageHooks?.[pathnameKey];

  if (!hook) {
    return {
      hookExecuted: false,
      postHook: p => defaultPostHook(p, pathname),
    };
  }

  if (typeof hook !== 'function') {
    throw new Error(`Page hook for ${pathnameKey} is not a function`);
  }

  let customPostHook = null;
  const overridePostHook = fn => {
    if (typeof fn !== 'function') {
      throw new Error(`Post hook for ${pathnameKey} is not a function`);
    }
    customPostHook = fn;
  };

  const context = {
    afterHook: overridePostHook,
    pathname: pathnameKey,
    index,
    page, // Give hooks access to the page object
    testData, // Give hooks access to the test data
  };

  await hook(context);

  return {
    hookExecuted: true,
    postHook: customPostHook || (p => defaultPostHook(p, pathname)),
  };
}

/**
 * Performs all actions on a form page:
 * 1. Run the page hook if one exists
 * 2. Autofill if no hook ran and page is not special
 * 3. Run axe accessibility check
 * 4. Run the post hook (continue/submit)
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} pathname
 * @param {Object} config - Test configuration
 */
async function performPageActions(page, pathname, config) {
  const {
    pageHooks,
    arrayPages,
    testData,
    useWebComponentFields,
    _13647Exception,
  } = config;

  const { hookExecuted, postHook } = await execHook(
    page,
    pathname,
    pageHooks,
    arrayPages,
    testData,
  );

  const shouldAutofill = !pathname.match(
    /\/(start|introduction|confirmation|review-and-submit)$/,
  );

  const continuePageProcessing = async () => {
    // Expand accordions (scoped to main to avoid footer accordions)
    const accordions = page.locator(
      'main va-accordion-item:not([open]), main .usa-accordion button[aria-expanded="false"]',
    );
    const accordionCount = await accordions.count();
    for (let i = 0; i < accordionCount; i++) {
      await accordions.nth(i).click();
    }

    // Run accessibility check
    const violations = await axeCheck(page, 'main', { _13647Exception });
    if (violations.length > 0) {
      console.warn(
        `Accessibility violations on ${pathname}:\n${formatViolations(
          violations,
        )}`,
      );
    }

    // Run post hook
    await postHook(page);
  };

  if (!hookExecuted && shouldAutofill) {
    const { abortProcessing } = await fillPage(
      page,
      testData,
      arrayPages,
      useWebComponentFields,
    );
    if (!abortProcessing) {
      await continuePageProcessing();
    }
  } else {
    await continuePageProcessing();
  }
}

/**
 * Recursive page processor. Walks through the form page by page until
 * it reaches the confirmation page or the stop path.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} config - Test configuration
 */
async function processPage(page, config) {
  const { stopTestAfterPath } = config;
  const pathname = new URL(page.url()).pathname;

  if (stopTestAfterPath && pathname.endsWith(stopTestAfterPath)) {
    return;
  }

  await performPageActions(page, pathname, config);

  if (!pathname.endsWith('/confirmation')) {
    // Wait for navigation
    await expect(async () => {
      const newPathname = new URL(page.url()).pathname;
      if (pathname === newPathname) {
        const pageErrors = await captureValidationErrors(page);
        let errorMessage = `Expected to navigate away from ${pathname}`;
        if (pageErrors.length > 0) {
          errorMessage += `\n\nPage contains validation errors:\n${pageErrors.join(
            '\n',
          )}\n\nThis suggests required fields may be missing or invalid.`;
        }
        throw new Error(errorMessage);
      }
    }).toPass({ timeout: 10000 });

    await processPage(page, config);
  }
}

/**
 * Tests a form flow with the provided test data.
 * Creates Playwright test cases that walk through the form.
 *
 * @param {Object} testConfig - Configuration for the form test
 * @param {string} testConfig.appName - Name of the app
 * @param {Array} [testConfig.arrayPages=[]] - Array page configs
 * @param {string} [testConfig.dataPrefix] - Path prefix for nested test data
 * @param {string} [testConfig.dataDir] - Path to test data directory
 * @param {Array} testConfig.dataSets - Test data sets (strings or {title, data})
 * @param {Object} [testConfig.pageHooks={}] - Page-specific hook functions
 * @param {string} testConfig.rootUrl - The form's URL
 * @param {Function} [testConfig.setup] - One-time setup before all tests
 * @param {Function} [testConfig.setupPerTest] - Setup before each test
 * @param {boolean|string[]} [testConfig.skip] - Skip tests
 * @param {string} [testConfig.stopTestAfterPath=null] - Stop at this path
 * @param {boolean} [testConfig._13647Exception=false] - Axe exception flag
 * @param {boolean} [testConfig.useWebComponentFields=true] - Fill WC fields
 */
function testForm(testConfig) {
  const {
    appName,
    arrayPages = [],
    dataPrefix,
    dataDir,
    dataSets,
    pageHooks = {},
    rootUrl,
    setup = () => {},
    setupPerTest = async () => {},
    skip,
    stopTestAfterPath = null,
    _13647Exception = false,
    useWebComponentFields = true,
  } = testConfig;

  const skippedTests = Array.isArray(skip) && new Set(skip);
  const describeFn = skip && !skippedTests ? test.describe.skip : test.describe;

  const resolvedPageHooks = resolvePageHooks(pageHooks, rootUrl);

  const getTestTitle = testKey =>
    typeof testKey === 'object' ? testKey.title : testKey;

  const getTestData = testKey => {
    if (typeof testKey === 'object') return testKey.data;
    // Load from fixture file
    const fixturePath = path.resolve(dataDir, `${testKey}.json`);
    return require(fixturePath);
  };

  const extractTestData = data =>
    dataPrefix ? get(data, dataPrefix, data) : data;

  describeFn(appName, () => {
    test.beforeAll(async () => {
      if (!dataDir && !dataSets.some(d => typeof d === 'object')) {
        throw new Error('Required data directory is undefined.');
      }
      await setup();
    });

    dataSets.forEach(testKey => {
      const title = getTestTitle(testKey);
      const shouldSkip = skippedTests && skippedTests.has(title);

      const testFn = shouldSkip ? test.skip : test;

      testFn(`fills the form: ${title}`, async ({ page }) => {
        const rawTestData = getTestData(testKey);
        const testData = extractTestData(rawTestData);

        // Run per-test setup (mock API routes, login, etc.)
        await setupPerTest({ page, testData });

        // Navigate to the form
        await page.goto(rootUrl);

        // Wait for loading indicators to disappear
        await expect(page.locator(LOADING_SELECTOR)).toHaveCount(0, {
          timeout: 15000,
        });

        // Begin recursive page processing
        await processPage(page, {
          pageHooks: resolvedPageHooks,
          arrayPages,
          testData,
          useWebComponentFields,
          _13647Exception,
          stopTestAfterPath,
        });
      });
    });
  });
}

module.exports = {
  testForm,
  fillPage,
  processPage,
  enterFieldData,
  findData,
  clickFormContinue,
};
