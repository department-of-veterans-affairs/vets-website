const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const mapboxMockData = require('./autosuggest-data/mapbox.json');
const h = require('./helpers/playwright-helpers');
const { jsonResponse } = require('./helpers/playwright-mocks');

test.describe('Facility Locator Address Autosuggest', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/geocoding/**', route =>
      route.fulfill(jsonResponse(mapboxMockData)),
    );
    await page.route('**/v0/maintenance_windows', route =>
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

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toHaveLength(0);

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

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toHaveLength(0);

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

    const axeResults2 = await new AxeBuilder({ page }).analyze();
    expect(axeResults2.violations).toHaveLength(0);

    await expect(input).toHaveValue('Port Hueneme, California, United States');

    const axeResults3 = await new AxeBuilder({ page }).analyze();
    expect(axeResults3.violations).toHaveLength(0);

    // Clear
    await page.locator('#clear-street-city-state-zip').click();

    const axeResults4 = await new AxeBuilder({ page }).analyze();
    expect(axeResults4.violations).toHaveLength(0);

    await expect(input).toHaveValue('');
    await expect(
      page.locator('#street-city-state-zip-autosuggest-container'),
    ).toHaveClass(/usa-input-error/);

    const axeResults5 = await new AxeBuilder({ page }).analyze();
    expect(axeResults5.violations).toHaveLength(0);
  });
});
