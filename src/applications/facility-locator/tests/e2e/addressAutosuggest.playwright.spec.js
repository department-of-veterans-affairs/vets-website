const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const mapboxMockData = require('./autosuggest-data/mapbox.json');
const h = require('./helpers/playwright-helpers');
const { jsonResponse } = require('./helpers/playwright-mocks');

test.describe('Facility Locator Address Autosuggest', () => {
  test.beforeEach(async ({ page }) => {
    await h.setupMapboxStubs(page);
    await page.route(new RegExp('geocoding/'), route =>
      route.fulfill(jsonResponse(mapboxMockData)),
    );
    await page.route(/maintenance_windows/, route =>
      route.fulfill(jsonResponse([])),
    );
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({ data: { type: 'feature_toggles', features: [] } }),
      ),
    );
  });

  test('does not show dropdown results when fewer than 3 characters are typed', async ({
    page,
  }) => {
    await page.goto('/find-locations');

    expect(await axeCheck(page)).toHaveLength(0);

    const input = page.locator(h.AUTOSUGGEST_ADDRESS_INPUT);

    // Type 2 characters — dropdown should NOT open
    await input.fill('Po');
    await expect(input).toHaveAttribute('aria-expanded', 'false');

    // Type 3rd character — should trigger
    await input.fill('Por');
    await expect(input).toHaveAttribute('aria-expanded', 'true', {
      timeout: 5000,
    });
  });

  test('Search results in 5 results with keyboard navigation', async ({
    page,
  }) => {
    await page.goto('/find-locations');

    expect(await axeCheck(page)).toHaveLength(0);

    const input = page.locator('#street-city-state-zip');
    await input.fill('Port');

    // Wait for results
    await expect(
      page
        .locator(h.AUTOSUGGEST_ADDRESS_CONTAINER)
        .locator(h.AUTOSUGGEST_ADDRESS_OPTIONS),
    ).toBeVisible({ timeout: 5000 });

    // Should have 5 options
    await expect(
      page
        .locator(h.AUTOSUGGEST_ADDRESS_CONTAINER)
        .locator(h.AUTOSUGGEST_ADDRESS_OPTIONS)
        .locator('> *'),
    ).toHaveCount(5);

    // Keyboard navigation
    await input.press('ArrowDown');
    await input.press('ArrowDown');

    await expect(
      page
        .locator(h.AUTOSUGGEST_ADDRESS_OPTIONS)
        .locator('.dropdown-option')
        .nth(1),
    ).toHaveClass(/selected/);

    await input.press('Enter');

    expect(await axeCheck(page)).toHaveLength(0);

    await expect(input).toHaveValue('Port Hueneme, California, United States');

    expect(await axeCheck(page)).toHaveLength(0);

    // Clear
    await page.locator('#clear-street-city-state-zip').click();

    expect(await axeCheck(page)).toHaveLength(0);

    await expect(input).toHaveValue('');
    await expect(
      page.locator('#street-city-state-zip-autosuggest-container'),
    ).toHaveClass(/usa-input-error/);

    expect(await axeCheck(page)).toHaveLength(0);
  });
});
