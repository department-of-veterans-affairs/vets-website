/**
 * MSW Browser Setup for AskVA
 *
 * Enables API mocking in the browser during local development.
 *
 * To enable mocking, start the app with:
 *   USE_MOCKS=true yarn watch --env entry=auth,login-page,static-pages,terms-of-use,verify,ask-va --env api=http://mock-vets-api.local
 *
 * MSW intercepts all requests to the mock domain - no real server needed.
 */

// eslint-disable-next-line import/no-unresolved
import { setupWorker } from 'msw';
import {
  mockApi,
  commonHandlers,
} from '@department-of-veterans-affairs/platform-mocks/browser';
import { mockHealthFacilityResponse, mockInquiries, mockInquiryResponse, mockReplyResponse, mockSubmitResponse, mockAnnouncementsResponse, mockAttachmentResponse } from '../utils/mockData';

// ============================================================================
// App-Specific Handlers
// ============================================================================

/**
 * AskVA locator handlers using the mockApi helper.
 * The mockApi helper automatically prefixes paths with environment.API_URL.
 */
const askVAHandlers = [
  // Facility search - POST /facilities_api/v2/va
  mockApi.post('/facilities_api/v2/va', (req, res, ctx) => {
    return res(ctx.json(facilitiesData));
  }),

  // Mock Attachment - GET /ask_va_api/v0/download_attachment?id=4ec11cee-2ebe-ef11-b8e9-001dd809b958
  mockApi.get('/ask_va_api/v0/download_attachment?:id', (req, res, ctx) => {
    const mockData = mockAttachmentResponse.data
    if (mockData) {
      return res(ctx.json({ data: mockData }));
    }
    return res(
      ctx.status(404),
      ctx.json({ errors: [{ status: '404', title: 'Not found' }] }),
    );
  }),
];

/**
 * Third-party handlers.
 * These use rest directly since they're not vets-api endpoints.
 */

/* None at this time */

// ============================================================================
// Combine All Handlers
// ============================================================================

const handlers = [
  // App-specific handlers (api.* uses apiUrl automatically)
  ...askVAHandlers,
  // Third-party handlers (explicit URLs)
  // None
  // Platform common handlers (pre-configured with apiUrl)
  ...commonHandlers,
];

const worker = setupWorker(...handlers);

/**
 * Starts the MSW service worker with facility locator handlers.
 * Call this from the app entry point when using the mock API domain.
 */
export async function startMocking() {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
  return worker;
}

export default startMocking;