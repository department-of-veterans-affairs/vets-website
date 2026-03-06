/* eslint-disable no-await-in-loop, no-console, no-continue, no-use-before-define, no-nested-ternary, no-plusplus */
/**
 * Playwright benchmark test for the 21P-0969 Income and Asset Statement form.
 *
 * This form has 11 chapters: 1 standard chapter (8 pages for VETERAN path)
 * and 10 ArrayBuilder chapters, each adding one item.
 * Tests the same flow as the Cypress form-tester spec.
 */

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('path');
const fs = require('fs');

// Load fixtures
const fixturesDir = path.resolve(__dirname, 'fixtures');
const mockUser = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../fixtures/mocks/user.json'),
    'utf8',
  ),
);
const testData = JSON.parse(
  fs.readFileSync(
    path.join(fixturesDir, 'data/test-data-veteran.json'),
    'utf8',
  ),
).data;

const ROOT_URL =
  '/supporting-forms-for-claims/submit-income-and-asset-statement-form-21p-0969';

const SUBMISSION_DATE = new Date().toISOString();

const mockPrefill = {
  formData: {
    veteranSsnLastFour: '7821',
    veteranVaFileNumberLastFour: '7821',
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/form/21P-0969',
  },
};

// URL prefix to testData array property mapping for ArrayBuilder chapters
const ARRAY_URL_MAP = {
  'recurring-income': 'unassociatedIncomes',
  'financial-accounts': 'associatedIncomes',
  'property-and-business': 'ownedAssets',
  royalties: 'royaltiesAndOtherProperties',
  'asset-transfers': 'assetTransfers',
  trusts: 'trusts',
  annuities: 'annuities',
  'unreported-assets': 'unreportedAssets',
  'discontinued-income': 'discontinuedIncomes',
  'waived-income': 'incomeReceiptWaivers',
};

// SIP data: all scalar fields pre-filled, arrays kept from testData
const sipData = {
  metadata: mockPrefill,
  formData: {
    ...testData,
  },
};

const submitResponse = {
  data: {
    id: 'mock-id',
    type: 'saved_income_and_asset_claim',
    attributes: {
      submittedAt: SUBMISSION_DATE,
      regionalOffice: [
        'Attention:  Philadelphia Pension Center',
        'P.O. Box 5206',
        'Janesville, WI 53547-5206',
      ],
      confirmationNumber: '01e77e8d-79bf-4991-a899-4e2defff11e0',
      guid: '01e77e8d-79bf-4991-a899-4e2defff11e0',
      form: '21P-0969',
    },
  },
};

const featureToggles = {
  data: {
    features: [
      { name: 'income_and_assets_form_enabled', value: true },
      { name: 'income_and_assets_browser_monitoring_enabled', value: true },
    ],
  },
};

async function setupMocks(page) {
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
  await page.route('**/v0/in_progress_forms/21P-0969', route => {
    if (route.request().method() === 'PUT') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sipData),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(sipData),
    });
  });
  await page.route('**/income_and_assets/v0/form0969', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(submitResponse),
    }),
  );
  await page.route('**/v0/user', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    }),
  );
  await page.addInitScript(() => {
    window.localStorage.setItem('hasSession', true);
  });
}

async function clickContinue(page) {
  const appRoot = page.locator('#react-root');

  // Try va-button-pair first (some forms use this)
  const vaButtonPair = appRoot.locator('va-button-pair');
  if ((await vaButtonPair.count()) > 0) {
    const continueBtn = vaButtonPair.first().locator('va-button[continue]');
    if ((await continueBtn.count()) > 0) {
      await continueBtn.first().click();
      return;
    }
  }

  // Try va-button inside .form-progress-buttons (matches both continue and submit)
  const vaButton = appRoot.locator(
    '.form-progress-buttons va-button:not([back])',
  );
  if ((await vaButton.count()) > 0) {
    await vaButton.first().click();
    return;
  }

  // Fallback to standard buttons
  await appRoot
    .locator('button.usa-button-primary, button[type="submit"]')
    .first()
    .click();
}

/**
 * Get the data context for the current page. For array item pages,
 * returns the specific array item from testData. For other pages,
 * returns the top-level testData.
 */
function getContextData(url) {
  const { pathname } = new URL(url);
  const relative = pathname.replace(ROOT_URL, '');
  // Match array item pages: /{urlPrefix}/{index}/{pageName}
  const match = relative.match(/^\/([^/]+)\/(\d+)\//);
  if (match) {
    const [, prefix, indexStr] = match;
    const arrayName = ARRAY_URL_MAP[prefix];
    if (arrayName && testData[arrayName]) {
      const index = parseInt(indexStr, 10);
      if (testData[arrayName][index]) {
        return testData[arrayName][index];
      }
    }
  }
  return testData;
}

/**
 * Check if current page is an ArrayBuilder summary page and handle it.
 * Returns true if handled, false otherwise.
 */
async function handleArrayBuilderSummary(page) {
  const { pathname } = new URL(page.url());
  const relative = pathname.replace(ROOT_URL, '');
  // Summary pages match: /{prefix}-summary or /{prefix}-summary-{variant}
  const isSummary = /^\/[^/]+-summary(-[^/]+)?$/.test(relative);
  if (!isSummary) return false;

  const appRoot = page.locator('#react-root');

  // Look for "add another" yes/no radio and select "No"
  const radios = appRoot.locator('va-radio');
  for (let i = 0; i < (await radios.count()); i++) {
    const radio = radios.nth(i);
    const noOption = radio.locator('va-radio-option[value="N"]');
    if ((await noOption.count()) > 0) {
      await noOption.first().click();
      return true;
    }
  }

  return true; // Still a summary page, just no radio to handle
}

async function waitForNavigation(page, previousPath) {
  await expect(async () => {
    const currentPath = new URL(page.url()).pathname;
    expect(currentPath).not.toBe(previousPath);
  }).toPass({ timeout: 15000 });
}

/**
 * Runs axe accessibility check on 'main' matching the Cypress axeCheck config.
 */
async function axeCheck(page) {
  const results = await new AxeBuilder({ page })
    .include('main')
    .withTags(['section508', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules(['color-contrast'])
    .analyze();

  if (results.violations.length > 0) {
    const summary = results.violations
      .map(v => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
      .join('\n');
    console.log(
      `[PW] axe violations on ${new URL(page.url()).pathname}:\n${summary}`,
    );
  }
}

async function fillVisibleFields(page, data) {
  const appRoot = page.locator('#react-root');

  // va-text-input (skip nested ones inside va-memorable-date or va-telephone-input)
  const textInputs = appRoot.locator(
    'va-text-input:not(va-memorable-date va-text-input):not(va-telephone-input va-text-input)',
  );
  for (let i = 0; i < (await textInputs.count()); i++) {
    const el = textInputs.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value !== undefined && value !== null) {
      await el.locator('input').fill(value.toString());
    }
  }

  // va-textarea
  const textareas = appRoot.locator('va-textarea');
  for (let i = 0; i < (await textareas.count()); i++) {
    const el = textareas.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value !== undefined && value !== null) {
      await el.locator('textarea').fill(value.toString());
    }
  }

  // va-select
  const selects = appRoot.locator('va-select');
  for (let i = 0; i < (await selects.count()); i++) {
    const el = selects.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value !== undefined && value !== null) {
      try {
        await el.locator('select').selectOption(value.toString());
      } catch {
        // Some selects may not have matching options
      }
    }
  }

  // va-radio
  const radios = appRoot.locator('va-radio');
  for (let i = 0; i < (await radios.count()); i++) {
    const el = radios.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value !== undefined && value !== null) {
      const radioValue =
        typeof value === 'boolean' ? (value ? 'Y' : 'N') : value.toString();
      const option = el.locator(`va-radio-option[value="${radioValue}"]`);
      if ((await option.count()) > 0) {
        await option.first().click();
      }
    }
  }

  // va-checkbox (non-certify/privacy)
  const checkboxes = appRoot.locator('va-checkbox');
  for (let i = 0; i < (await checkboxes.count()); i++) {
    const el = checkboxes.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value === true) {
      await el.locator('input').check({ force: true });
    }
  }

  // va-memorable-date
  const dates = appRoot.locator('va-memorable-date');
  for (let i = 0; i < (await dates.count()); i++) {
    const el = dates.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value && typeof value === 'string' && value.includes('-')) {
      const [year, month, day] = value.split('-');
      const monthSelect = el.locator('select');
      if ((await monthSelect.count()) > 0) {
        await monthSelect.first().selectOption(parseInt(month, 10).toString());
      }
      const dayInput = el.locator(`input[name="${name}Day"]`);
      if ((await dayInput.count()) > 0) {
        await dayInput.fill(parseInt(day, 10).toString());
      }
      const yearInput = el.locator(`input[name="${name}Year"]`);
      if ((await yearInput.count()) > 0) {
        await yearInput.fill(year);
      }
    }
  }

  // va-telephone-input
  const phones = appRoot.locator('va-telephone-input');
  for (let i = 0; i < (await phones.count()); i++) {
    const el = phones.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value !== undefined && value !== null) {
      const input = el.locator('input');
      if ((await input.count()) > 0) {
        await input.first().fill(value.toString());
      }
    }
  }

  // va-number-input
  const numberInputs = appRoot.locator('va-number-input');
  for (let i = 0; i < (await numberInputs.count()); i++) {
    const el = numberInputs.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, data);
    if (value !== undefined && value !== null) {
      await el.locator('input').fill(value.toString());
    }
  }
}

function resolveFieldData(fieldName, data) {
  const parts = fieldName.replace(/^root_/, '').split('_');
  let current = data;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    if (current[part] !== undefined) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

test.describe(
  '21P-0969 Income and Asset Statement — Playwright Benchmark',
  () => {
    test('veteran test: navigates through entire form', async ({ page }) => {
      const startTime = Date.now();

      await setupMocks(page);
      await page.goto(ROOT_URL);

      // Wait for app to load
      await expect(
        page.locator('a[href="#start"], va-link-action[href="#start"]').last(),
      ).toBeVisible({ timeout: 15000 });
      console.log(`[PW] App loaded: ${Date.now() - startTime}ms`);

      // === Introduction page ===
      await axeCheck(page);
      let currentPath = new URL(page.url()).pathname;
      // Click start — could be a link or va-link-action
      const startLink = page.locator(
        'a[href="#start"], va-link-action[href="#start"]',
      );
      await startLink.last().click();
      await waitForNavigation(page, currentPath);
      console.log(`[PW] After intro: ${Date.now() - startTime}ms`);

      // === Walk through all form pages ===
      let pagesFilled = 0;
      let maxPages = 200; // 0969 has ~139 possible pages

      while (maxPages > 0) {
        currentPath = new URL(page.url()).pathname;

        if (currentPath.includes('/confirmation')) {
          await axeCheck(page);
          break;
        }

        if (currentPath.includes('/review-and-submit')) {
          console.log(`[PW] Review page: ${Date.now() - startTime}ms`);
          await axeCheck(page);

          // VETERAN claimant uses VaPrivacyAgreement (checkbox only)
          const privacyAgreement = page.locator(
            'va-privacy-agreement[name="statementOfTruthCertified"]',
          );
          await expect(async () => {
            await privacyAgreement
              .locator('input[type="checkbox"]')
              .check({ force: true });
          }).toPass({ intervals: [500, 1000, 2000], timeout: 10000 });

          // Submit
          await clickContinue(page);

          // Wait for confirmation
          await expect(async () => {
            expect(new URL(page.url()).pathname).toContain('/confirmation');
          }).toPass({ timeout: 15000 });
          console.log(`[PW] Submitted: ${Date.now() - startTime}ms`);
          break;
        }

        // Regular form page
        console.log(`[PW] Page: ${currentPath}`);
        await page.waitForTimeout(400);

        // Handle ArrayBuilder summary pages (select "No" to add another)
        const isSummary = await handleArrayBuilderSummary(page);

        if (!isSummary) {
          // Fill fields using context-appropriate data
          const contextData = getContextData(page.url());
          await fillVisibleFields(page, contextData);
        }
        pagesFilled++;
        await axeCheck(page);
        await page.waitForTimeout(200);
        await clickContinue(page);
        await waitForNavigation(page, currentPath);
        console.log(
          `[PW] Page ${pagesFilled} done: ${Date.now() - startTime}ms`,
        );
        maxPages--;
      }

      const totalTime = Date.now() - startTime;
      console.log(`\n========================================`);
      console.log(`[PW BENCHMARK] Total time: ${totalTime}ms`);
      console.log(`[PW BENCHMARK] Pages filled: ${pagesFilled}`);
      console.log(`========================================\n`);
    });
  },
);
