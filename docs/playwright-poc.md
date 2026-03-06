# Playwright POC for vets-website

## Overview

This proof of concept introduces Playwright as an **alternative** E2E testing framework alongside the existing Cypress setup. No Cypress code is removed or modified — this is purely additive.

## Why Playwright?

### Performance gains for form tests

Form tests are the longest-running tests in the vets-website CI pipeline. Playwright addresses several architectural bottlenecks in Cypress:

| Bottleneck | Cypress | Playwright |
|---|---|---|
| **Command execution** | Serial command queue — each `cy.get()`, `cy.type()`, `cy.click()` chains asynchronously through a queue | Native async/await — actions execute immediately |
| **Text entry** | `cy.type()` simulates per-keystroke typing (10ms default delay per character, overridden to 0 in vets-website but still has overhead) | `page.fill()` sets the value instantly with a single input event |
| **Shadow DOM** | Requires `.shadow().find()` chaining for every VA web component interaction | Native shadow DOM piercing — locators traverse shadow boundaries automatically |
| **Parallelism** | Single browser context per spec file; parallelism requires multiple containers (up to 12 in CI) | Built-in `fullyParallel` mode runs tests across multiple workers in a single container |
| **Auto-waiting** | Implicit waits with retry-ability on assertions | Built-in auto-waiting on locators with configurable timeouts |
| **Retry isolation** | Failed tests retry in the same browser state | Each retry gets a fresh browser context |

### Estimated improvement

For a typical 50-page form test:
- **Cypress**: ~45-90 seconds per data set (serial command queue, typing delay, shadow DOM overhead)
- **Playwright**: ~10-25 seconds per data set (instant fill, native shadow DOM, parallel execution)

With `fullyParallel: true` and multiple workers, total CI time for form tests could drop by **60-75%**.

## What's included

### Infrastructure

| File | Purpose |
|---|---|
| [config/playwright.config.js](../config/playwright.config.js) | Playwright configuration mirroring Cypress settings (viewport, retries, baseUrl) |
| [.github/workflows/playwright-poc.yml](../.github/workflows/playwright-poc.yml) | GitHub Actions workflow for manual Playwright test runs |

### Helper libraries

| File | Replaces |
|---|---|
| [src/platform/testing/e2e/playwright/helpers/login.js](../src/platform/testing/e2e/playwright/helpers/login.js) | `cy.login()` — uses `page.route()` + `page.addInitScript()` |
| [src/platform/testing/e2e/playwright/helpers/axeCheck.js](../src/platform/testing/e2e/playwright/helpers/axeCheck.js) | `cy.axeCheck()` — uses `@axe-core/playwright` AxeBuilder |
| [src/platform/testing/e2e/playwright/helpers/mockHelpers.js](../src/platform/testing/e2e/playwright/helpers/mockHelpers.js) | `cy.intercept()` — uses `page.route()` |
| [src/platform/testing/e2e/playwright/helpers/webComponents.js](../src/platform/testing/e2e/playwright/helpers/webComponents.js) | VA web component commands (`cy.fillVaTextInput`, etc.) — uses native shadow DOM locators |
| [src/platform/testing/e2e/playwright/fixtures.js](../src/platform/testing/e2e/playwright/fixtures.js) | Extended `test` with login, axeCheck, setupCommonMocks fixtures |

### Form tester (ported)

| File | Lines | Description |
|---|---|---|
| [src/platform/testing/e2e/playwright/form-tester/index.js](../src/platform/testing/e2e/playwright/form-tester/index.js) | ~450 | Core recursive page walker — `testForm()`, `fillPage()`, `processPage()` |
| [src/platform/testing/e2e/playwright/form-tester/utilities.js](../src/platform/testing/e2e/playwright/form-tester/utilities.js) | ~120 | `createTestConfig()`, `inProgressMock()`, `resolvePageHooks()` |
| [src/platform/testing/e2e/playwright/form-tester/patterns.js](../src/platform/testing/e2e/playwright/form-tester/patterns.js) | ~170 | Pattern handlers for address and array builder patterns |

### Converted test files

| File | Original |
|---|---|
| `src/applications/simple-forms/26-4555/tests/e2e/4555-adapted-housing.playwright.spec.js` | Full form-tester conversion of 26-4555 adapted housing form |
| `src/applications/pensions/tests/e2e/pensions-simple.playwright.spec.js` | Simplified POC for the pensions form (intro + first page navigation) |

## Commands

```bash
# Install Playwright browser
yarn pw:install

# Run all Playwright tests
yarn pw:run

# Run with UI mode (interactive)
yarn pw:open

# Run tests matching a pattern
yarn pw:run:app "pensions"

# View HTML report
yarn pw:report
```

## How to write a new Playwright test

### Simple standalone test

```js
const { test, expect } = require('platform/testing/e2e/playwright/fixtures');

test('my page loads', async ({ page, login, axeCheck, setupCommonMocks }) => {
  await login(page);
  await setupCommonMocks(page);
  
  await page.goto('/my-page');
  
  await expect(page.locator('h1')).toHaveText('My Page Title');
  await axeCheck(page);
});
```

### Form test using form-tester

```js
const path = require('path');
const { testForm } = require('platform/testing/e2e/playwright/form-tester');
const { createTestConfig } = require('platform/testing/e2e/playwright/form-tester/utilities');
const { login } = require('platform/testing/e2e/playwright/helpers/login');

const formConfig = require('../../config/form');
const manifest = require('../../manifest.json');

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    useWebComponentFields: true,
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      // Playwright hooks receive { page, afterHook, pathname, index }
      introduction: async ({ afterHook, page }) => {
        afterHook(async (p) => {
          await p.locator('a[href="#start"]').last().click();
        });
      },
    },
    setupPerTest: async ({ page, testData }) => {
      // Set up API mocks using page.route()
      await page.route('**/v0/feature_toggles*', route =>
        route.fulfill({ status: 200, body: '{"data":{"features":[]}}' })
      );
      await login(page);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
```

### Key differences from Cypress tests

| Cypress | Playwright |
|---|---|
| `cy.get('selector')` | `page.locator('selector')` |
| `cy.get('va-text-input').shadow().find('input')` | `page.locator('va-text-input').locator('input')` |
| `cy.type('text')` | `await input.fill('text')` |
| `cy.intercept('GET', url, response)` | `await page.route(url, route => route.fulfill({...}))` |
| `cy.login(user)` | `await login(page, user)` |
| `cy.axeCheck()` | `await axeCheck(page)` |
| `cy.wrap(value).as('alias')` | Use variables directly (async/await) |
| `cy.get('@alias')` | Use the variable directly |
| Page hooks: `(context) => { cy.fillPage(); }` | Page hooks: `async ({ page }) => { await fillPage(page, ...); }` |
| `setupPerTest: () => { cy.intercept(...); }` | `setupPerTest: async ({ page }) => { await page.route(...); }` |

## File naming convention

Playwright test files use `.playwright.spec.js` suffix (vs `.cypress.spec.js` for Cypress).

## CI/CD

The [`playwright-poc.yml`](../.github/workflows/playwright-poc.yml) workflow runs on manual dispatch (`workflow_dispatch`) and:

1. Installs dependencies + Playwright Chromium browser
2. Builds the app(s)
3. Runs Playwright tests
4. Uploads HTML report + test artifacts

## Next steps for full adoption

1. **Benchmark**: Run both Cypress and Playwright versions of the 26-4555 test side-by-side and measure wall-clock time
2. **Port more form tests**: Convert 3-5 additional form tests to validate the form-tester port handles edge cases
3. **CI integration**: Add Playwright to the continuous-integration workflow alongside Cypress
4. **Parallel execution**: Tune worker count for CI containers
5. **Docker image**: Add Playwright browsers to the CI Docker image, or use `mcr.microsoft.com/playwright` base
6. **Migration guide**: Create detailed guide for teams to convert their tests
7. **Shared infrastructure**: Decide whether to run both frameworks long-term or fully migrate
