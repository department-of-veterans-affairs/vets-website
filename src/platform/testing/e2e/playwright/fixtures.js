/* eslint-disable no-empty-pattern */
/**
 * Playwright custom test fixtures for VA.gov applications.
 *
 * Extends Playwright's base `test` with reusable fixtures:
 *   - login: Sets up a mocked authenticated session
 *   - axeCheck: Runs axe accessibility checks
 *   - setupCommonMocks: Mocks feature_toggles + maintenance_windows
 *
 * Usage:
 *   const { test, expect } = require('../fixtures');
 *   test('my test', async ({ page, login, axeCheck, setupCommonMocks }) => {
 *     await login(page);
 *     await setupCommonMocks(page);
 *     await page.goto('/my-page');
 *     const violations = await axeCheck(page);
 *     expect(violations).toEqual([]);
 *   });
 */

const { test: base, expect } = require('@playwright/test');
const { login: loginHelper, defaultMockUser } = require('./helpers/login');
const {
  axeCheck: axeCheckHelper,
  formatViolations,
} = require('./helpers/axeCheck');
const {
  setupCommonMocks: setupCommonMocksHelper,
  mockGetApi,
  mockSubmitApi,
  mockInProgressForm,
} = require('./helpers/mockHelpers');

const test = base.extend({
  /**
   * Fixture: login
   * Returns a function that sets up a mock logged-in session.
   *
   * Usage: await login(page) or await login(page, customUserData)
   */
  login: async ({}, use) => {
    await use(async (page, userData) => loginHelper(page, userData));
  },

  /**
   * Fixture: axeCheck
   * Returns a function that runs an accessibility check and asserts no violations.
   *
   * Usage: await axeCheck(page) or await axeCheck(page, 'main', options)
   */
  axeCheck: async ({}, use) => {
    await use(async (page, context, options) => {
      const violations = await axeCheckHelper(page, context, options);
      if (violations.length > 0) {
        throw new Error(
          `Accessibility violations found:\n${formatViolations(violations)}`,
        );
      }
    });
  },

  /**
   * Fixture: setupCommonMocks
   * Returns a function that sets up feature_toggles and maintenance_windows mocks.
   *
   * Usage: await setupCommonMocks(page) or await setupCommonMocks(page, { featureToggles: {...} })
   */
  setupCommonMocks: async ({}, use) => {
    await use(async (page, options) => setupCommonMocksHelper(page, options));
  },
});

module.exports = {
  test,
  expect,
  defaultMockUser,
  mockGetApi,
  mockSubmitApi,
  mockInProgressForm,
};
