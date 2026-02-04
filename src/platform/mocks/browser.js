/**
 * MSW Browser Handlers
 *
 * Pre-built handlers for common VA.gov API endpoints using MSW's browser API.
 * Use these with setupWorker for local development mocking.
 *
 * @example
 * import { setupWorker } from 'msw';
 * import { mockApi, rest, commonHandlers } from 'platform/mocks/browser';
 *
 * // App handlers - mockApi.get/post automatically prefix with API_URL
 * const appHandlers = [
 *   mockApi.post('/facilities_api/v2/va', (req, res, ctx) => res(ctx.json(data))),
 *   mockApi.get('/my_health/v1/records', (req, res, ctx) => res(ctx.json(records))),
 * ];
 *
 * // Third-party handlers - use rest directly with full URL
 * const thirdPartyHandlers = [
 *   rest.get('https://api.mapbox.com/*', (req, res, ctx) => res(ctx.json(...))),
 * ];
 *
 * const worker = setupWorker(...appHandlers, ...thirdPartyHandlers, ...commonHandlers);
 */

// eslint-disable-next-line import/no-unresolved
import { rest } from 'msw';
import environment from 'platform/utilities/environment';

// Re-export rest for third-party handlers
export { rest };

// Import pure data from responses (webpack handles CommonJS -> ES interop)
import responses from './responses';

const {
  mockUser,
  mockUserUnauthenticated,
  mockFeatureToggles,
  mockMaintenanceWindows,
  mockVamcEhr,
  createVamcEhrResponse,
  createUserResponse,
  createFeatureTogglesResponse,
  createMaintenanceWindowsResponse,
} = responses;

// Re-export responses for convenience
export {
  mockUser,
  mockUserUnauthenticated,
  mockFeatureToggles,
  mockMaintenanceWindows,
  mockVamcEhr,
  createVamcEhrResponse,
  createUserResponse,
  createFeatureTogglesResponse,
  createMaintenanceWindowsResponse,
};

// ============================================================================
// API URL Helper
// ============================================================================

/**
 * The base URL for vets-api requests.
 * Comes from environment.API_URL (set via --env api=...)
 */
export const apiUrl = environment.API_URL;

/**
 * MSW rest wrapper that automatically prefixes paths with API_URL.
 * Use this for vets-api endpoints. For third-party APIs, use rest directly.
 *
 * @example
 * mockApi.get('/v0/user', (req, res, ctx) => res(ctx.json(userData)))
 * mockApi.post('/facilities_api/v2/va', (req, res, ctx) => res(ctx.json(facilities)))
 */
export const mockApi = {
  get: (path, handler) => rest.get(`${apiUrl}${path}`, handler),
  post: (path, handler) => rest.post(`${apiUrl}${path}`, handler),
  put: (path, handler) => rest.put(`${apiUrl}${path}`, handler),
  patch: (path, handler) => rest.patch(`${apiUrl}${path}`, handler),
  delete: (path, handler) => rest.delete(`${apiUrl}${path}`, handler),
  head: (path, handler) => rest.head(`${apiUrl}${path}`, handler),
  options: (path, handler) => rest.options(`${apiUrl}${path}`, handler),
};

// ============================================================================
// Handler Factories
// ============================================================================

/**
 * Creates a handler for authenticated user endpoint.
 * @param {string} baseUrl - Base URL for API (e.g., 'http://mock-vets-api.local')
 */
export const createUserHandler = (baseUrl = apiUrl) =>
  rest.get(`${baseUrl}/v0/user`, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  });

/**
 * Creates a handler for unauthenticated user endpoint.
 * @param {string} baseUrl - Base URL for API
 */
export const createUnauthenticatedUserHandler = (baseUrl = apiUrl) =>
  rest.get(`${baseUrl}/v0/user`, (req, res, ctx) =>
    res(ctx.status(401), ctx.json(mockUserUnauthenticated)),
  );

/**
 * Creates a handler for feature toggles endpoint.
 * @param {string} baseUrl - Base URL for API
 */
export const createFeatureTogglesHandler = (baseUrl = apiUrl) =>
  rest.get(`${baseUrl}/v0/feature_toggles*`, (req, res, ctx) => {
    return res(ctx.json(mockFeatureToggles));
  });

/**
 * Creates a handler for maintenance windows endpoint.
 * @param {string} baseUrl - Base URL for API
 */
export const createMaintenanceWindowsHandler = (baseUrl = apiUrl) =>
  rest.get(`${baseUrl}/v0/maintenance_windows`, (req, res, ctx) => {
    return res(ctx.json(mockMaintenanceWindows));
  });

// Pre-configured handlers using environment.API_URL
export const userHandler = createUserHandler();
export const unauthenticatedUserHandler = createUnauthenticatedUserHandler();
export const featureTogglesHandler = createFeatureTogglesHandler();
export const maintenanceWindowsHandler = createMaintenanceWindowsHandler();

// ============================================================================
// VAMC EHR Handlers
// ============================================================================

/**
 * Creates a handler for VAMC EHR CMS data endpoint.
 * Returns empty data by default, or custom mock data if provided.
 *
 * @param {Object|Array} mockData - Mock data: array of facilities or full response object
 * @param {string} baseUrl - Base URL for API (defaults to environment.API_URL)
 * @returns {Function} MSW request handler
 *
 * @example
 * // With array of facilities
 * createVamcEhrHandler([{ id: 'vha_663', title: 'Seattle VA', system: 'cerner' }])
 *
 * // With full response object
 * createVamcEhrHandler(myVamcFixture)
 */
export function createVamcEhrHandler(mockData = null, baseUrl = apiUrl) {
  // Convert array to full response format, or use as-is if object
  let data;
  if (!mockData) {
    data = createVamcEhrResponse([]);
  } else if (Array.isArray(mockData)) {
    data = createVamcEhrResponse(mockData);
  } else {
    data = mockData;
  }

  return rest.get(`${baseUrl}/data/cms/vamc-ehr.json`, (req, res, ctx) => {
    return res(ctx.json(data));
  });
}

// Cache for proxied VAMC EHR requests
let vamcEhrCache = null;

/**
 * Creates a handler for VAMC EHR CMS data that proxies to va.gov and caches.
 * @param {string} baseUrl - Base URL for API (e.g., 'http://mock-vets-api.local')
 * @returns {Function} MSW request handler
 */
export function createVamcEhrProxyHandler(baseUrl = apiUrl) {
  return rest.get(
    `${baseUrl}/data/cms/vamc-ehr.json`,
    async (req, res, ctx) => {
      // Return cached data if available
      if (vamcEhrCache) {
        return res(ctx.json(vamcEhrCache));
      }

      try {
        // Use native fetch to get real data (MSW won't intercept va.gov)
        const response = await fetch(
          'https://www.va.gov/data/cms/vamc-ehr.json',
        );
        const data = await response.json();

        // Cache the response
        vamcEhrCache = data;

        return res(ctx.json(data));
      } catch (error) {
        // Return empty response on failure
        return res(ctx.json(createVamcEhrResponse([])));
      }
    },
  );
}

// Pre-configured handlers using apiUrl
export const vamcEhrHandler = createVamcEhrHandler();
export const vamcEhrProxyHandler = createVamcEhrProxyHandler();

// ============================================================================
// Handler Collections
// ============================================================================

/**
 * Creates common handlers for authenticated user scenarios.
 * @param {string} baseUrl - Base URL for API (defaults to environment.API_URL)
 * @returns {Array} Array of MSW handlers
 *
 * @example
 * // Use default API_URL (recommended)
 * const worker = setupWorker(...commonHandlers, ...appHandlers);
 *
 * // Or create with custom base URL
 * const handlers = createCommonHandlers('http://custom-api.local');
 */
export function createCommonHandlers(baseUrl = apiUrl) {
  return [
    createUserHandler(baseUrl),
    createFeatureTogglesHandler(baseUrl),
    createMaintenanceWindowsHandler(baseUrl),
    createVamcEhrProxyHandler(baseUrl),
  ];
}

/**
 * Creates common handlers for unauthenticated user scenarios.
 * @param {string} baseUrl - Base URL for API (defaults to environment.API_URL)
 * @returns {Array} Array of MSW handlers
 */
export function createCommonHandlersUnauthenticated(baseUrl = apiUrl) {
  return [
    createUnauthenticatedUserHandler(baseUrl),
    createFeatureTogglesHandler(baseUrl),
    createMaintenanceWindowsHandler(baseUrl),
    createVamcEhrProxyHandler(baseUrl),
  ];
}

/**
 * Pre-configured common handlers using environment.API_URL.
 * Use these directly in most cases - no need to call factory functions.
 *
 * @example
 * import { setupWorker } from 'msw';
 * import { commonHandlers } from 'platform/mocks/browser';
 *
 * const worker = setupWorker(...commonHandlers, ...myAppHandlers);
 */
export const commonHandlers = createCommonHandlers();
export const commonHandlersUnauthenticated = createCommonHandlersUnauthenticated();
