const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const closedData = require('./details-page/service-message/mocks/closed.message.json');
const limitedData = require('./details-page/service-message/mocks/limited.message.json');
const noticeData = require('./details-page/service-message/mocks/notice.message.json');
const noMessageData = require('./details-page/service-message/mocks/no.message.json');
const { jsonResponse } = require('./helpers/playwright-mocks');
const { setupMapboxStubs } = require('./helpers/playwright-helpers');

const detailUrl = '/find-locations/facility/vc_0304V';

function setupServiceMessageMocks(page, facilityData) {
  return Promise.all([
    setupMapboxStubs(page),
    page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({ data: { type: 'feature_toggles', features: [] } }),
      ),
    ),
    page.route(/maintenance_windows/, route => route.fulfill(jsonResponse([]))),
    page.route(new RegExp('facilities_api/'), route =>
      route.fulfill(jsonResponse(facilityData)),
    ),
  ]);
}

test.describe('Facility VA -- Details page service messages', () => {
  test('renders closed message', async ({ page }) => {
    await setupServiceMessageMocks(page, closedData);
    await page.goto(detailUrl);

    expect(await axeCheck(page)).toHaveLength(0);

    const heading = page.locator('.hydrated > h2');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Facility Closed');

    const desc = page.locator('[data-testid="status-description"] > p');
    await expect(desc).toBeVisible();
    await expect(desc).toContainText('We are closed');
  });

  test('renders limited message', async ({ page }) => {
    await setupServiceMessageMocks(page, limitedData);
    await page.goto(detailUrl);

    expect(await axeCheck(page)).toHaveLength(0);

    const heading = page.locator('.hydrated > h2');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Limited services and hours');

    const desc = page.locator('[data-testid="status-description"] > p');
    await expect(desc).toBeVisible();
    await expect(desc).toContainText(
      "We're currently open for limited in-person service, and",
    );
  });

  test('renders notice message', async ({ page }) => {
    await setupServiceMessageMocks(page, noticeData);
    await page.goto(detailUrl);

    expect(await axeCheck(page)).toHaveLength(0);

    const heading = page.locator('.hydrated > h2');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Facility notice');

    const desc = page.locator('[data-testid="status-description"] > p');
    await expect(desc).toBeVisible();
    await expect(desc).toContainText('Hey! hey look!');
  });

  test('renders no service message when none exists', async ({ page }) => {
    await setupServiceMessageMocks(page, noMessageData);
    await page.goto(detailUrl);

    expect(await axeCheck(page)).toHaveLength(0);

    await expect(page.locator('.hydrated > h2')).toHaveCount(0);
  });
});
