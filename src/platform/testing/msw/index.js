/**
 * MSW (Mock Service Worker) - Unified Mocking Layer
 * 
 * This module provides a single mocking solution for:
 * - Local development (replaces mocker-api)
 * - Unit tests (replaces mockFetch)
 * - Cypress E2E tests (supplements cy.intercept)
 * 
 * @example
 * // Unit test
 * import { server } from '@department-of-veterans-affairs/platform-testing/msw/server';
 * import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';
 * 
 * server.use(...scenarios.medications.withActiveRx());
 * 
 * @example
 * // Cypress test
 * import { scenarios } from '@department-of-veterans-affairs/platform-testing/msw/scenarios';
 * 
 * cy.startMsw();
 * cy.loadMswScenario([...scenarios.medications.withActiveRx()]);
 * 
 * @example
 * // Local dev (in app-entry.jsx)
 * import { worker } from '@department-of-veterans-affairs/platform-testing/msw/browser';
 * 
 * worker.start();
 */

// Export all handlers
export * from './handlers';

// Export all scenarios
export * from './scenarios';

// Export server for unit tests
export { server } from './server';

// Export browser worker for local dev and Cypress
export { worker, startWorker } from './browser';
