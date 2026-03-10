/**
 * Playwright mock/route helpers.
 *
 * Provides helpers for common API mocking patterns, replacing Cypress's
 * cy.intercept() usage with Playwright's page.route().
 */

/**
 * Sets up default API mocks that most VA.gov apps expect:
 * - /v0/feature_toggles
 * - /v0/maintenance_windows
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} [options]
 * @param {Object} [options.featureToggles] - Custom feature toggles response
 */
async function setupCommonMocks(page, options = {}) {
  const { featureToggles } = options;

  await page.route('**/v0/feature_toggles*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(featureToggles || { data: { features: [] } }),
    }),
  );

  await page.route('**/v0/maintenance_windows', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    }),
  );
}

/**
 * Mocks a GET endpoint with a JSON response.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPattern - URL pattern (glob or regex)
 * @param {Object} response - JSON response body
 * @param {number} [status=200] - HTTP status code
 */
async function mockGetApi(page, urlPattern, response, status = 200) {
  await page.route(urlPattern, route => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    }
    return route.fallback();
  });
}

/**
 * Mocks a POST/PUT/PATCH endpoint with a JSON response.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPattern - URL pattern (glob or regex)
 * @param {Object} response - JSON response body
 * @param {string} [method='POST'] - HTTP method to match
 * @param {number} [status=200] - HTTP status code
 */
async function mockSubmitApi(
  page,
  urlPattern,
  response,
  method = 'POST',
  status = 200,
) {
  await page.route(urlPattern, route => {
    if (route.request().method() === method) {
      return route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    }
    return route.fallback();
  });
}

/**
 * Mocks an in-progress form endpoint (GET and PUT).
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} formId - The VA form ID (e.g., '26-4555')
 * @param {Object} sipGetResponse - Response for GET /v0/in_progress_forms/:id
 * @param {Object} sipPutResponse - Response for PUT /v0/in_progress_forms/:id
 */
async function mockInProgressForm(
  page,
  formId,
  sipGetResponse,
  sipPutResponse,
) {
  await page.route(`**/v0/in_progress_forms/${formId}`, route => {
    const method = route.request().method();
    if (method === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sipGetResponse),
      });
    }
    if (method === 'PUT') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sipPutResponse),
      });
    }
    return route.fallback();
  });
}

module.exports = {
  setupCommonMocks,
  mockGetApi,
  mockSubmitApi,
  mockInProgressForm,
};
