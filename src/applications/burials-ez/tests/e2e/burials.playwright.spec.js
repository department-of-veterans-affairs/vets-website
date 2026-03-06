/* eslint-disable no-await-in-loop, no-console */
/**
 * Playwright form-tester test for burials-ez (21P-530EZ).
 *
 * Port of burials.cypress.spec.js — uses the Playwright form-tester
 * infrastructure with the minimal test data fixture.
 */

const {
  testForm,
} = require('../../../../platform/testing/e2e/playwright/form-tester');
const {
  createTestConfig,
} = require('../../../../platform/testing/e2e/playwright/form-tester/utilities');
const {
  login,
} = require('../../../../platform/testing/e2e/playwright/helpers/login');

const manifest = require('../../manifest.json');
const mockUser = require('../fixtures/mocks/user.json');
const featuresEnabled = require('../fixtures/mocks/featuresEnabled.json');
const minimalFixture = require('../schema/minimal-test.json');

const FORM_ID = '21P-530EZ';
const IN_PROGRESS_URL = `/v0/in_progress_forms/${FORM_ID}`;
const BURIALS_CLAIMS_URL = '/burials/v0/claims';
const CLAIM_ATTACHMENTS_URL = '/v0/claim_attachments';
const SUBMISSION_DATE = new Date().toISOString();
const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

// Page paths (from formConfig.chapters — inlined to avoid webpack dependency)
const pagePaths = {
  mailingAddress: 'claimant-information/mailing-address',
  separationDocuments: 'military-history/separation-documents',
  previousNamesQuestion: 'military-history/previous-names',
  benefitsSelection: 'benefits/selection',
  burialAllowancePartOne: 'benefits/burial-allowance/additional-information',
  burialAllowancePartTwo: 'benefits/burial-allowance/allowance-and-expense',
  finalRestingPlace: 'benefits/final-resting-place',
  cemeteryLocationQuestion: 'benefits/cemetery-location',
  confirmation: 'confirmation',
};

/**
 * Sets up mock API routes.
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

  await page.route(`**${IN_PROGRESS_URL}`, route => {
    const method = route.request().method();
    if (method === 'PUT') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: minimalFixture }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        formData: {},
        metadata: {
          version: 0,
          prefill: true,
          returnUrl: '/applicant/information',
        },
      }),
    });
  });

  await page.route(`**${BURIALS_CLAIMS_URL}`, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: '8',
          type: 'saved_claim',
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

  await page.route(`**${CLAIM_ATTACHMENTS_URL}`, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          attributes: {
            confirmationCode: 'f3111a5f-e86f-4c8d-96c7-9bba6eee13e5',
            name: 'image.png',
            size: 65645,
          },
          id: '11',
          type: 'persistent_attachments',
        },
      }),
    }),
  );
}

/**
 * Playwright page hooks — equivalent to Cypress pageHooks.
 *
 * When a hook runs, autofill is skipped. The default post-hook clicks Continue.
 * Use afterHook only to override the default Continue behavior (e.g.,
 * for introduction where defaultPostHook is a no-op).
 */
const pageHooks = {
  introduction: async ({ afterHook }) => {
    // defaultPostHook is a no-op for introduction, so we override it
    afterHook(async page => {
      const startLink = page.locator(
        'a[href="#start"], va-link-action[href="#start"]',
      );
      await startLink.last().click();
    });
  },
  [pagePaths.separationDocuments]: async ({ page }) => {
    const radioOption = page.locator(
      'va-radio-option[name="root_view:separationDocuments"][value="N"]',
    );
    if ((await radioOption.count()) > 0) {
      await radioOption.click();
    }
  },
  [pagePaths.previousNamesQuestion]: async ({ page }) => {
    const radioOption = page.locator(
      'va-radio-option[name="root_view:servedUnderOtherNames"][value="N"]',
    );
    if ((await radioOption.count()) > 0) {
      await radioOption.click();
    }
  },
  [pagePaths.benefitsSelection]: async ({ page }) => {
    const checkbox = page.locator(
      'va-checkbox[name="root_view:claimedBenefits_burialAllowance"]',
    );
    if ((await checkbox.count()) > 0) {
      const input = checkbox.locator('input');
      await input.check({ force: true });
    }
  },
  [pagePaths.burialAllowancePartOne]: async ({ page }) => {
    const checkbox = page.locator(
      'va-checkbox[name="root_burialAllowanceRequested_service"]',
    );
    if ((await checkbox.count()) > 0) {
      const input = checkbox.locator('input');
      await input.check({ force: true });
    }
  },
  [pagePaths.burialAllowancePartTwo]: async ({ page }) => {
    const expenseRadio = page.locator(
      'va-radio-option[name="root_burialExpenseResponsibility"][value="N"]',
    );
    if ((await expenseRadio.count()) > 0) {
      await expenseRadio.click();
    }
    const prevRadio = page.locator(
      'va-radio-option[name="root_previouslyReceivedAllowance"][value="N"]',
    );
    if ((await prevRadio.count()) > 0) {
      await prevRadio.click();
    }
  },
  [pagePaths.finalRestingPlace]: async ({ page }) => {
    const radioOption = page.locator(
      'va-radio-option[name="root_finalRestingPlace_location"][value="cemetery"]',
    );
    if ((await radioOption.count()) > 0) {
      await radioOption.click();
    }
  },
  [pagePaths.cemeteryLocationQuestion]: async ({ page }) => {
    const radioOption = page.locator(
      'va-radio-option[name="root_cemetaryLocationQuestion"][value="none"]',
    );
    if ((await radioOption.count()) > 0) {
      await radioOption.click();
    }
  },
  [pagePaths.confirmation]: async () => {
    // No-op — just verify we reached confirmation
  },
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Burials EZ',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'minimal', data: minimalFixture }],
    pageHooks,
    setupPerTest: async ({ page }) => {
      await setupMocks(page);
      await login(page, mockUser);
    },
    skip: false,
  },
  manifest,
);

testForm(testConfig);
