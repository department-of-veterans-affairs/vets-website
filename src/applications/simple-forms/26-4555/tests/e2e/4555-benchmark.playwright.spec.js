/* eslint-disable no-await-in-loop, no-console, no-plusplus, no-continue, no-use-before-define, no-nested-ternary */
/**
 * Playwright benchmark test for the 26-4555 Adapted Housing form.
 *
 * This is a standalone test that navigates through the same form pages
 * as the Cypress form-tester test, using raw Playwright API calls.
 * It does NOT depend on the form-tester infrastructure, making it suitable
 * for a direct performance comparison.
 */

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('path');
const fs = require('fs');

// Load fixtures directly from the filesystem
const fixturesDir = path.resolve(__dirname, 'fixtures');
const mocksDir = path.resolve(__dirname, 'fixtures/mocks');
const sharedMocksDir = path.resolve(
  __dirname,
  '../../../shared/tests/e2e/fixtures/mocks',
);

const user = JSON.parse(
  fs.readFileSync(path.join(mocksDir, 'user.json'), 'utf8'),
);
const sipGet = JSON.parse(
  fs.readFileSync(path.join(mocksDir, 'sip-get.json'), 'utf8'),
);
const sipPut = JSON.parse(
  fs.readFileSync(path.join(mocksDir, 'sip-put.json'), 'utf8'),
);
const featureToggles = JSON.parse(
  fs.readFileSync(path.join(sharedMocksDir, 'feature-toggles.json'), 'utf8'),
);
const mockSubmit = JSON.parse(
  fs.readFileSync(path.join(sharedMocksDir, 'application-submit.json'), 'utf8'),
);
const minimalTestData = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, 'data/minimal-test.json'), 'utf8'),
).data;

const ROOT_URL =
  '/housing-assistance/disability-housing-grants/apply-for-grant-form-26-4555';

const userLOA3 = {
  ...user,
  data: {
    ...user.data,
    attributes: {
      ...user.data.attributes,
      login: { currentlyLoggedIn: true },
      profile: {
        ...user.data.attributes.profile,
        loa: { current: 3 },
      },
    },
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
  await page.route('**/v0/in_progress_forms/26-4555', route => {
    if (route.request().method() === 'PUT') {
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
  await page.route('**/v0/user', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(userLOA3),
    }),
  );
  await page.addInitScript(() => {
    window.localStorage.setItem('hasSession', true);
  });
}

async function clickContinue(page) {
  // Scope to the form area to avoid matching header search button
  const form = page.locator('#react-root');

  // Try va-button-pair first (newer forms)
  const vaButtonPair = form.locator('va-button-pair');
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
  // Fallback to standard form-system buttons within the form
  await form
    .locator('button.usa-button-primary, button[type="submit"]')
    .first()
    .click();
}

async function waitForNavigation(page, previousPath) {
  await expect(async () => {
    const currentPath = new URL(page.url()).pathname;
    expect(currentPath).not.toBe(previousPath);
  }).toPass({ timeout: 15000 });
}

/**
 * Runs axe accessibility check on 'main' matching the Cypress axeCheck config:
 * Tags: section508, wcag2a, wcag2aa, wcag21a, wcag21aa
 * Disabled: color-contrast
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

test.describe('26-4555 Adapted Housing — Playwright Benchmark', () => {
  test('minimal-test: navigates through entire form', async ({ page }) => {
    const startTime = Date.now();

    await setupMocks(page);
    await page.goto(ROOT_URL);

    // Wait for app to load
    await expect(page.locator('a[href="#start"]').last()).toBeVisible({
      timeout: 15000,
    });
    console.log(`[PW] App loaded: ${Date.now() - startTime}ms`);

    // === Introduction page ===
    await axeCheck(page);
    let currentPath = new URL(page.url()).pathname;
    await page
      .locator('a[href="#start"]')
      .last()
      .click();
    await waitForNavigation(page, currentPath);
    console.log(`[PW] After intro: ${Date.now() - startTime}ms`);

    // === Walk through form pages ===
    let pagesFilled = 0;
    let maxPages = 30;

    while (maxPages > 0) {
      currentPath = new URL(page.url()).pathname;

      if (currentPath.includes('/confirmation')) {
        await axeCheck(page);
        break;
      }

      if (currentPath.includes('/review-and-submit')) {
        console.log(`[PW] Review page: ${Date.now() - startTime}ms`);
        await axeCheck(page);

        // Wait for the StatementOfTruth web component to appear in the DOM
        const sot = page.locator('va-statement-of-truth');
        await sot.waitFor({ state: 'attached', timeout: 15000 });
        await sot.scrollIntoViewIfNeeded();

        // Use retry loop for signature fill — shadow DOM inputs can lag
        await expect(async () => {
          await page.locator('#veteran-signature input').fill('Barnie Rubble');
        }).toPass({ intervals: [500, 1000, 2000], timeout: 10000 });

        // Check certify checkbox
        await expect(async () => {
          await page
            .locator('va-checkbox#veteran-certify input')
            .check({ force: true });
        }).toPass({ intervals: [500, 1000], timeout: 5000 });

        // Submit
        await page.locator('#react-root button.usa-button-primary').click();

        // Wait for confirmation
        await expect(async () => {
          expect(new URL(page.url()).pathname).toContain('/confirmation');
        }).toPass({ timeout: 15000 });
        console.log(`[PW] Submitted: ${Date.now() - startTime}ms`);
        break;
      }

      // Regular form page
      console.log(`[PW] Page: ${currentPath}`);
      // Wait for web components to render their shadow DOM
      await page.waitForTimeout(500);
      await fillVisibleFields(page);
      pagesFilled++;
      await axeCheck(page);
      await page.waitForTimeout(300);
      await clickContinue(page);
      await waitForNavigation(page, currentPath);
      console.log(`[PW] Page ${pagesFilled} done: ${Date.now() - startTime}ms`);
      maxPages--;
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n========================================`);
    console.log(`[PW BENCHMARK] Total time: ${totalTime}ms`);
    console.log(`[PW BENCHMARK] Pages filled: ${pagesFilled}`);
    console.log(`========================================\n`);
  });
});

async function fillVisibleFields(page) {
  const appRoot = page.locator('#react-root');

  // va-text-input (skip those nested inside va-memorable-date or va-telephone-input)
  const textInputs = appRoot.locator(
    'va-text-input:not(va-memorable-date va-text-input):not(va-telephone-input va-text-input)',
  );
  for (let i = 0; i < (await textInputs.count()); i++) {
    const el = textInputs.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, minimalTestData);
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
    const value = resolveFieldData(name, minimalTestData);
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
    const value = resolveFieldData(name, minimalTestData);
    if (value !== undefined && value !== null) {
      await el.locator('select').selectOption(value.toString());
    }
  }

  // va-radio — find parent va-radio, get its name, click matching va-radio-option
  const radios = appRoot.locator('va-radio');
  for (let i = 0; i < (await radios.count()); i++) {
    const el = radios.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, minimalTestData);
    if (value !== undefined && value !== null) {
      const radioValue =
        typeof value === 'boolean' ? (value ? 'Y' : 'N') : value.toString();
      const option = el.locator(`va-radio-option[value="${radioValue}"]`);
      if ((await option.count()) > 0) {
        await option.first().click();
      }
    }
  }

  // va-checkbox
  const checkboxes = appRoot.locator('va-checkbox');
  for (let i = 0; i < (await checkboxes.count()); i++) {
    const el = checkboxes.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, minimalTestData);
    if (value === true) {
      await el.locator('input').check({ force: true });
    }
  }

  // va-memorable-date — uses select for month, input[name$="Day"] for day, input[name$="Year"] for year
  const dates = appRoot.locator('va-memorable-date');
  for (let i = 0; i < (await dates.count()); i++) {
    const el = dates.nth(i);
    const name = await el.getAttribute('name');
    if (!name || !name.startsWith('root_')) continue;
    const value = resolveFieldData(name, minimalTestData);
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
    const value = resolveFieldData(name, minimalTestData);
    if (value !== undefined && value !== null) {
      const input = el.locator('input');
      if ((await input.count()) > 0) {
        await input.first().fill(value.toString());
      }
    }
  }
}

function resolveFieldData(fieldName, data) {
  const parts = fieldName.replace(/^root_/, '').split('_');

  let current = data;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    // Try camelCase joining: if current[part] doesn't exist, try joining
    if (current[part] !== undefined) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}
