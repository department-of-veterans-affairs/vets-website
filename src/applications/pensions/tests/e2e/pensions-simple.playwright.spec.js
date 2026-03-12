/**
 * Playwright POC: Pensions simple form test.
 *
 * This is a simplified Playwright port of the pensions-simple Cypress test.
 * It demonstrates how the form-tester works with Playwright for a complex
 * multi-page form with many page hooks.
 *
 * NOTE: This is a proof-of-concept. A full port would require converting
 * all the pensions-specific page hook helpers in helpers/index.js.
 */

const { test, expect } = require('@playwright/test');
const {
  login,
} = require('../../../../platform/testing/e2e/playwright/helpers/login');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');

const mockUser = require('../fixtures/mocks/loggedInUser.json');
const featuresEnabled = require('../fixtures/mocks/featuresEnabled.json');
const mockPrefill = require('../fixtures/mocks/prefill.json');
const inProgressForms = require('../fixtures/mocks/in-progress-forms.json');
const mockVamc = require('../fixtures/mocks/vamc-ehr.json');

const FORM_ID = '21P-527EZ';
const TEST_URL =
  '/pension/apply-for-veteran-pension-form-21p-527ez/introduction';
const IN_PROGRESS_URL = `/v0/in_progress_forms/${FORM_ID}`;
const PENSIONS_CLAIMS_URL = 'pensions/v0/claims';

const SUBMISSION_DATE = new Date().toISOString();
const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

/**
 * Sets up mock API routes for the pensions form.
 *
 * @param {import('@playwright/test').Page} page
 */
async function setupMocks(page) {
  await page.route('**/v0/feature_toggles*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(featuresEnabled),
    }),
  );

  await page.route('**/v0/maintenance_windows', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    }),
  );

  await page.route('**/data/cms/vamc-ehr.json', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockVamc),
    }),
  );

  await page.route(`**${IN_PROGRESS_URL}`, route => {
    const method = route.request().method();
    if (method === 'PUT') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(inProgressForms),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPrefill),
    });
  });

  await page.route(`**/${PENSIONS_CLAIMS_URL}`, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: '8',
          type: 'saved_claim_pensions',
          attributes: {
            submittedAt: SUBMISSION_DATE,
            regionalOffice: [
              'Attention:  Philadelphia Pension Center',
              'P.O. Box 5206',
              'Janesville, WI 53547-5206',
            ],
            confirmationNumber: SUBMISSION_CONFIRMATION_NUMBER,
            guid: SUBMISSION_CONFIRMATION_NUMBER,
            form: FORM_ID,
          },
        },
      }),
    }),
  );

  await login(page, mockUser);
}

test.describe('Pensions 21P-527EZ (Playwright POC)', () => {
  test('loads the introduction page and verifies basic navigation', async ({
    page,
  }) => {
    await setupMocks(page);
    await page.goto(TEST_URL);

    // Wait for loading to complete
    await expect(page.locator('va-loading-indicator')).toHaveCount(0, {
      timeout: 15000,
    });

    // Verify we're on the introduction page
    await expect(page.locator('h1')).toBeVisible();

    // Run accessibility check on intro page
    const violations = await axeCheck(page);
    expect(violations.length).toBe(0);

    // Click "Start the pension application"
    const startButton = page.locator(
      'a[href="#start"], va-button:has-text("Start"), button:has-text("Start")',
    );
    if ((await startButton.count()) > 0) {
      await startButton.first().click();
    }

    // Verify navigation happened (away from introduction)
    await expect(async () => {
      const url = page.url();
      expect(url).not.toContain('/introduction');
    }).toPass({ timeout: 10000 });

    // Run accessibility check on the first form page
    const formViolations = await axeCheck(page);
    expect(formViolations.length).toBe(0);
  });
});
