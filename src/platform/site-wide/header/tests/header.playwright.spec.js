const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../testing/e2e/playwright/helpers/axeCheck');

const features = require('../../../utilities/tests/header-footer/mocks/features');

test.describe('global header', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill({ json: features }),
    );
    await page.route('**/v0/maintenance_windows', route =>
      route.fulfill({ json: { data: [] } }),
    );
    await page.route('**/www.google-analytics.com/**', route =>
      route.fulfill({ status: 204 }),
    );
  });

  test.describe('desktop header', () => {
    test('should correctly load all of the header elements', async ({
      page,
    }) => {
      await page.goto('/');
      await axeCheck(page);

      const header = page.locator('.header');
      await expect(header).toBeVisible();

      await expect(header.locator('.va-crisis-line')).toBeVisible();
      await expect(header.locator('.va-notice--banner')).toBeVisible();
      await expect(header.locator('.va-header-logo-wrapper')).toBeVisible();
      await expect(
        header.locator(
          '[alt="VA logo and Seal, U.S. Department of Veterans Affairs"]',
        ),
      ).toBeVisible();
      await expect(
        header.locator('.sitewide-search-drop-down-panel-button'),
      ).toBeVisible();

      const contactLink = page.locator('a').nth(1);
      await expect(contactLink).toBeVisible();
      await expect(contactLink).toContainText('Contact us');
      await expect(contactLink).toHaveAttribute('href', /\/contact-us/);

      await expect(header.locator('.sign-in-links')).toBeVisible();
    });
  });

  test.describe('mobile header', () => {
    test.use({ viewport: { width: 320, height: 480 } });

    test('should correctly load all of the header elements', async ({
      page,
    }) => {
      await page.goto('/');
      await axeCheck(page);

      const header = page.locator('.header');
      await expect(header).toBeVisible();

      await expect(header.locator('#header-crisis-line')).toBeVisible();
      await expect(header.locator('.header-logo-row svg')).toBeVisible();
      await expect(header.locator('.sign-in-links')).toBeVisible();

      const menuButton = header.locator('.header-menu-button');
      await expect(menuButton).toBeVisible();
      await expect(menuButton).toContainText('Menu');

      await menuButton.click();
      await expect(menuButton).toContainText('Close');

      await expect(
        page.locator('[for="search-header-dropdown-input-field"]'),
      ).toContainText('Search');

      const searchContainer = page.locator('#search-header-dropdown-component');
      await expect(searchContainer).toBeVisible();
      await expect(searchContainer.locator('input')).toBeVisible();
      await expect(searchContainer.locator('button')).toBeVisible();

      await menuButton.click();
      await expect(menuButton).toContainText('Menu');
    });
  });
});
