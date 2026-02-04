/**
 * MSW Browser Setup for Facility Locator
 *
 * Enables API mocking in the browser during local development.
 *
 * To enable mocking, start the app with:
 *   USE_MOCKS=true yarn watch --env entry=facilities --env api=http://mock-vets-api.local
 *
 * MSW intercepts all requests to the mock domain - no real server needed.
 */

// eslint-disable-next-line import/no-unresolved
import { rest, setupWorker } from 'msw';
import { api, apiUrl, commonHandlers } from 'platform/mocks/browser';
import facilitiesData from './data/facilities.json';
import geocodingData from './data/geocoding.json';

// ============================================================================
// App-Specific Handlers
// ============================================================================

/**
 * Facility locator handlers using the api helper.
 * The api helper automatically prefixes paths with environment.API_URL.
 */
const facilityHandlers = [
  // Facility search - POST /facilities_api/v2/va
  api.post('/facilities_api/v2/va', (req, res, ctx) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Intercepted facilities search');
    return res(ctx.json(facilitiesData));
  }),

  // Individual facility - GET /facilities_api/v2/va/:id
  api.get('/facilities_api/v2/va/:id', (req, res, ctx) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Intercepted facility by ID:', req.params.id);
    const facility = facilitiesData.data.find(f => f.id === req.params.id);
    if (facility) {
      return res(ctx.json({ data: facility }));
    }
    return res(
      ctx.status(404),
      ctx.json({ errors: [{ status: '404', title: 'Not found' }] }),
    );
  }),
];

/**
 * Third-party handlers (Mapbox).
 * These use rest directly since they're not vets-api endpoints.
 */
const mapboxHandlers = [
  // Mapbox geocoding - used for address autocomplete
  rest.get('https://api.mapbox.com/geocoding/*', (req, res, ctx) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Intercepted Mapbox geocoding request');
    return res(ctx.json(geocodingData));
  }),

  // Mapbox token validation - HEAD request to check if token is valid
  rest.head('https://api.mapbox.com/v4/*', (req, res, ctx) => {
    // eslint-disable-next-line no-console
    console.log('[MSW] Intercepted Mapbox token health check');
    return res(ctx.status(200));
  }),
];

// ============================================================================
// Combine All Handlers
// ============================================================================

const handlers = [
  // App-specific handlers (api.* uses apiUrl automatically)
  ...facilityHandlers,
  // Third-party handlers (explicit URLs)
  ...mapboxHandlers,
  // Platform common handlers (pre-configured with apiUrl)
  ...commonHandlers,
];

const worker = setupWorker(...handlers);

/**
 * Starts the MSW service worker with facility locator handlers.
 * Call this from the app entry point when using the mock API domain.
 */
export async function startMocking() {
  // eslint-disable-next-line no-console
  console.log('[MSW] Starting browser mocking for', apiUrl);
  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    // eslint-disable-next-line no-console
    console.log('[MSW] Browser mocking enabled successfully');
    return worker;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[MSW] Failed to start:', error);
    throw error;
  }
}

export default startMocking;
