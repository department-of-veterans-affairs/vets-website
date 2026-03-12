/**
 * Migration stubs for Cypress helpers that have better native Playwright
 * equivalents. Each function throws an error explaining the Playwright-native
 * approach to use instead.
 *
 * Import these in migrated tests to get clear guidance when a Cypress pattern
 * is used incorrectly:
 *
 *   const { assertUrl } = require('./cypress-migration');
 *   // throws: "assertUrl is not needed in Playwright. Use: ..."
 */

function assertUrl() {
  throw new Error(
    'assertUrl() is not needed in Playwright.\n' +
      'Use the native assertion instead:\n\n' +
      "  await expect(page).toHaveURL('/expected/path');\n" +
      '  await expect(page).toHaveURL(/partial/);\n',
  );
}

function assertUrlIncludes() {
  throw new Error(
    'assertUrlIncludes() is not needed in Playwright.\n' +
      'Use the native assertion instead:\n\n' +
      '  await expect(page).toHaveURL(/substring/);\n',
  );
}

function getMany() {
  throw new Error(
    'getMany() is not needed in Playwright.\n' +
      'Playwright locators handle multiple elements natively:\n\n' +
      "  const items = page.locator('.my-class');\n" +
      '  await expect(items).toHaveCount(3);\n' +
      '  const first = items.nth(0);\n',
  );
}

function hasCount() {
  throw new Error(
    'hasCount() is not needed in Playwright.\n' +
      'Use the native assertion instead:\n\n' +
      "  await expect(page.locator('selector')).toHaveCount(n);\n",
  );
}

function hasFocusableCount() {
  throw new Error(
    'hasFocusableCount() is not needed in Playwright.\n' +
      'Use the native assertion instead:\n\n' +
      "  await expect(page.locator('selector')).toHaveCount(n);\n",
  );
}

function upload() {
  throw new Error(
    'upload() is not needed in Playwright.\n' +
      'Use the native file input method instead:\n\n' +
      "  await page.locator('input[type=\"file\"]').setInputFiles('path/to/file');\n" +
      '  // or for VA web components, use fillVaFileInput() from webComponents.js\n',
  );
}

function keys() {
  throw new Error(
    'keys() is not needed in Playwright.\n' +
      'Use the native keyboard API instead:\n\n' +
      "  await page.keyboard.press('Tab');\n" +
      "  await page.keyboard.press('Enter');\n" +
      "  // Multiple keys: for (const key of ['Tab', 'Enter']) await page.keyboard.press(key);\n",
  );
}

function repeatKey() {
  throw new Error(
    'repeatKey() is not needed in Playwright.\n' +
      'Use a simple loop with the native keyboard API:\n\n' +
      "  for (let i = 0; i < count; i++) await page.keyboard.press('Tab');\n",
  );
}

function injectAxe() {
  throw new Error(
    'injectAxe() is not needed in Playwright.\n' +
      'Playwright uses @axe-core/playwright which does not require manual injection:\n\n' +
      "  const { AxeBuilder } = require('@axe-core/playwright');\n" +
      '  const results = await new AxeBuilder({ page }).analyze();\n' +
      '  // or use the axeCheck helper from helpers/axeCheck.js\n',
  );
}

function injectAxeThenAxeCheck() {
  throw new Error(
    'injectAxeThenAxeCheck() is not needed in Playwright.\n' +
      'Use the axeCheck helper directly (no injection step required):\n\n' +
      "  const { axeCheck } = require('./axeCheck');\n" +
      '  await axeCheck(page);\n',
  );
}

function assertChildText() {
  throw new Error(
    'assertChildText() is not needed in Playwright.\n' +
      'Use native locator chaining and assertions:\n\n' +
      "  await expect(page.locator('.parent .child')).toContainText('expected');\n",
  );
}

function initClaimDetailMocks() {
  throw new Error(
    'initClaimDetailMocks() was never used in any Cypress spec and has no Playwright equivalent.\n' +
      'Build claim mock data directly in your test setup.\n',
  );
}

function testStatus() {
  throw new Error(
    'testStatus() was never used in any Cypress spec and has no Playwright equivalent.\n' +
      'Write application-status assertions directly in your test.\n',
  );
}

module.exports = {
  assertUrl,
  assertUrlIncludes,
  getMany,
  hasCount,
  hasFocusableCount,
  upload,
  keys,
  repeatKey,
  injectAxe,
  injectAxeThenAxeCheck,
  assertChildText,
  initClaimDetailMocks,
  testStatus,
};
