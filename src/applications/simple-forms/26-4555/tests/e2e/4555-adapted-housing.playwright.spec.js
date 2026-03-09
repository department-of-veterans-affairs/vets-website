const path = require('path');
const {
  testForm,
} = require('../../../../../platform/testing/e2e/playwright/form-tester');
const {
  createTestConfig,
} = require('../../../../../platform/testing/e2e/playwright/form-tester/utilities');
const {
  login,
} = require('../../../../../platform/testing/e2e/playwright/helpers/login');
const {
  axeCheck,
} = require('../../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const {
  fillAddressWebComponentPattern,
  selectVaCheckbox,
} = require('../../../../../platform/testing/e2e/playwright/helpers/webComponents');

const featureToggles = require('../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json');
const mockSubmit = require('../../../shared/tests/e2e/fixtures/mocks/application-submit.json');
const manifest = require('../../manifest.json');
const user = require('./fixtures/mocks/user.json');
const sipPut = require('./fixtures/mocks/sip-put.json');
const sipGet = require('./fixtures/mocks/sip-get.json');

// mock logged in LOA3 user
const userLOA3 = {
  ...user,
  data: {
    ...user.data,
    attributes: {
      ...user.data.attributes,
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        ...user.data.attributes.profile,
        loa: {
          current: 3,
        },
      },
    },
  },
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    useWebComponentFields: true,
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: async ({ afterHook }) => {
        afterHook(async p => {
          // Click the Start link
          const startLink = p.locator('a[href="#start"]:has-text("Start")');
          await startLink.last().click();
        });
      },
      'contact-information-1': async ({ afterHook, page, testData }) => {
        // Run axe check
        await axeCheck(page);

        afterHook(async p => {
          // Fill the address from test data (matches Cypress behavior)
          await fillAddressWebComponentPattern(
            p,
            'veteran_address',
            testData.veteran.address,
          );
          await axeCheck(p);
          const continueBtn = p
            .locator('main')
            .locator('button:has-text("Continue")');
          await continueBtn.click();
        });
      },
      'review-and-submit': async ({ afterHook, testData }) => {
        afterHook(async p => {
          // Fill signature from test data
          const { fullName } = testData.veteran;
          const sigText = `${fullName.first} ${fullName.last}`;
          const signatureInput = p
            .locator('#veteran-signature')
            .locator('input');
          await signatureInput.fill(sigText);

          // Check privacy/certify checkbox
          const certifyCheckbox = p.locator(
            'va-checkbox[name^="privacyAgreement"], va-checkbox#veteran-certify',
          );
          if ((await certifyCheckbox.count()) > 0) {
            const name = await certifyCheckbox.first().getAttribute('name');
            await selectVaCheckbox(p, name, true);
          }
          await p
            .locator('main')
            .locator('button:has-text("Submit")')
            .click();
        });
      },
    },
    setupPerTest: async ({ page }) => {
      // Set up API mocks
      await page.route('**/v0/api', route =>
        route.fulfill({ status: 200, body: '{}' }),
      );
      await page.route('**/v0/feature_toggles*', route =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(featureToggles),
        }),
      );
      await page.route('**/v0/maintenance_windows', route =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        }),
      );
      await page.route('**/v0/in_progress_forms/26-4555', route => {
        const method = route.request().method();
        if (method === 'PUT') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(sipPut),
          });
        }
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(sipGet),
        });
      });
      await page.route('**/simple_forms_api/v1/simple_forms', route =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockSubmit),
        }),
      );

      // Login
      await login(page, userLOA3);
    },
    skip: false,
  },
  manifest,
);

testForm(testConfig);
