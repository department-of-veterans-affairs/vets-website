/* eslint-disable no-await-in-loop, no-continue */
/**
 * Playwright form-tester patterns.
 *
 * Port of cypress/support/form-tester/patterns.js for Playwright.
 * Handles .vads-web-component-pattern elements during form autofill.
 */

const { fillAddressWebComponentPattern } = require('../helpers/webComponents');

/**
 * Extract the base field name from the first field within a pattern element.
 *
 * @param {import('@playwright/test').Locator} patternLocator
 * @returns {Promise<string|null>} Base name (e.g., root_address)
 */
async function extractBaseNameFromFirstField(patternLocator) {
  const patternFields = patternLocator.locator(
    '.vads-web-component-pattern-field',
  );
  const count = await patternFields.count();
  if (count === 0) return null;

  const firstField = patternFields.first();
  const fieldName =
    (await firstField.getAttribute('name')) ||
    (await firstField.getAttribute('id'));
  if (!fieldName) return null;

  return fieldName.replace(/_[^_]+$/, '');
}

/**
 * Handles the address pattern by looking up test data and filling the
 * address web component fields.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} patternLocator
 * @param {string} arrayItemPath
 * @param {Function} findData - Function to look up test data by key
 * @returns {Promise<{abortProcessing: boolean}>}
 */
async function addressPattern(page, patternLocator, arrayItemPath, findData) {
  const baseName = await extractBaseNameFromFirstField(patternLocator);
  if (!baseName) return { abortProcessing: false };

  const data = findData(baseName, arrayItemPath);
  if (data === undefined) return { abortProcessing: false };

  const addressFieldName = baseName.replace(/^root_/, '');
  await fillAddressWebComponentPattern(page, addressFieldName, data);
  return { abortProcessing: false };
}

/**
 * Handles the array builder summary pattern by clicking the continue/add button.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} patternLocator
 * @returns {Promise<{abortProcessing: boolean}>}
 */
async function arrayBuilderSummaryPattern(page, patternLocator) {
  // Look for an "Add another" or continue button in the pattern
  const addButton = patternLocator.locator(
    'va-button:has-text("Add"), a:has-text("Add")',
  );
  const continueButton = patternLocator.locator(
    'va-button:has-text("Continue"), button:has-text("Continue")',
  );

  if ((await addButton.count()) > 0) {
    await addButton.first().click();
    return { abortProcessing: true };
  }

  if ((await continueButton.count()) > 0) {
    await continueButton.first().click();
  }

  return { abortProcessing: false };
}

const PATTERN_CLASS_TO_FILL_ACTION = {
  'vads-web-component-pattern-address': addressPattern,
  'wc-pattern-array-builder': arrayBuilderSummaryPattern,
};

/**
 * Marks all fields within a pattern element as processed so they won't
 * be filled again by the regular field fill loop.
 *
 * @param {import('@playwright/test').Locator} patternLocator
 * @param {Set<string>} touchedFields
 */
async function markPatternFieldsAsProcessed(patternLocator, touchedFields) {
  const patternFields = patternLocator.locator(
    '.vads-web-component-pattern-field',
  );
  const count = await patternFields.count();

  for (let i = 0; i < count; i++) {
    const field = patternFields.nth(i);
    const fieldKey =
      (await field.getAttribute('name')) || (await field.getAttribute('id'));
    if (fieldKey) touchedFields.add(fieldKey);
  }

  const elementFieldKey =
    (await patternLocator.getAttribute('name')) ||
    (await patternLocator.getAttribute('id'));
  if (elementFieldKey) touchedFields.add(elementFieldKey);
}

/**
 * Fills pattern elements on the page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} arrayItemPath
 * @param {Set<string>} touchedFields
 * @param {Function} findData - Function to look up test data
 * @returns {Promise<{abortProcessing: boolean}>}
 */
async function fillPatterns(page, arrayItemPath, touchedFields, findData) {
  const appRoot = page.locator('#react-root');
  const patterns = appRoot.locator('.vads-web-component-pattern');
  const patternCount = await patterns.count();

  if (patternCount === 0) return { abortProcessing: false };

  for (let i = 0; i < patternCount; i++) {
    const pattern = patterns.nth(i);

    // Check if already processed by checking a data attribute we set
    const processed = await pattern.getAttribute('data-pattern-processed');
    if (processed) continue;

    // Find which pattern handler matches
    for (const [className, handler] of Object.entries(
      PATTERN_CLASS_TO_FILL_ACTION,
    )) {
      const hasClass = await pattern.evaluate(
        (el, cls) => el.classList.contains(cls),
        className,
      );

      if (hasClass) {
        const result = await handler(page, pattern, arrayItemPath, findData);
        await markPatternFieldsAsProcessed(pattern, touchedFields);
        await pattern.evaluate(el =>
          el.setAttribute('data-pattern-processed', 'true'),
        );

        if (result?.abortProcessing) return { abortProcessing: true };
        break;
      }
    }

    // Even if no handler matched, mark fields as processed
    await markPatternFieldsAsProcessed(pattern, touchedFields);
  }

  return { abortProcessing: false };
}

module.exports = {
  fillPatterns,
  extractBaseNameFromFirstField,
  markPatternFieldsAsProcessed,
  PATTERN_CLASS_TO_FILL_ACTION,
};
