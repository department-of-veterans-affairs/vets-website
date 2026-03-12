const { test, expect } = require('@playwright/test');
const h = require('./helpers/playwright-helpers');
const {
  jsonResponse,
  setupVAFacilityMocks,
} = require('./helpers/playwright-mocks');

// Compute downtime windows relative to now (same as Cypress spec using moment)
const beforeNow = new Date(Date.now() - 60 * 1000).toISOString();
const withinHour = new Date(Date.now() + 59 * 60 * 1000).toISOString();
const endTime = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

const selectors = {
  app: '.facility-locator',
  statusDown: '[slot="headline"]',
  statusDownApproachingModal:
    '[data-status="downtimeApproaching"] #downtime-approaching-modal',
};

test.describe('Downtime Notification Test', () => {
  test.beforeEach(async ({ page }) => {
    await h.setupMapboxStubs(page);
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({ data: { type: 'feature_toggles', features: [] } }),
      ),
    );
    await page.route(/maintenance_windows/, route =>
      route.fulfill(jsonResponse({ data: [] })),
    );
    await setupVAFacilityMocks(page);
    await page.goto(h.ROOT_URL);
  });

  test('Shows the facility locator as normal', async ({ page }) => {
    await page.reload();
    await expect(page.locator(selectors.app).last()).toBeVisible({
      timeout: 10000,
    });
  });

  test('Correctly displays that downtime is approaching', async ({ page }) => {
    await page.route(/maintenance_windows/, route =>
      route.fulfill(
        jsonResponse({
          data: [
            {
              id: '139',
              type: 'maintenance_windows',
              attributes: {
                externalService: 'arcgis',
                description: 'My description',
                startTime: withinHour,
                endTime,
              },
            },
          ],
        }),
      ),
    );
    await page.reload();
    await expect(
      page.locator(selectors.statusDownApproachingModal),
    ).toBeVisible({ timeout: 10000 });
  });

  test('Correctly shows that the tool is down for maintenance', async ({
    page,
  }) => {
    await page.route(/maintenance_windows/, route =>
      route.fulfill(
        jsonResponse({
          data: [
            {
              id: '139',
              type: 'maintenance_windows',
              attributes: {
                externalService: 'arcgis',
                description: 'My description',
                startTime: beforeNow,
                endTime,
              },
            },
          ],
        }),
      ),
    );
    await page.reload();
    const el = page.locator(selectors.statusDown);
    await expect(el).toBeVisible({ timeout: 10000 });
    await expect(el).toContainText('This tool is down for maintenance');

    // Clear the downtime
    await page.route(/maintenance_windows/, route =>
      route.fulfill(jsonResponse({ data: [] })),
    );
  });
});
