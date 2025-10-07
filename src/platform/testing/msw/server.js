/**
 * MSW server for Node.js (unit tests)
 * This runs in Node and intercepts all fetch/xhr requests during tests
 */
import { setupServer } from 'msw/node';
import { defaultHandlers } from './handlers';

export const server = setupServer(...defaultHandlers);

// Establish API mocking before all tests
before(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

// Reset any request handlers that are declared as a part of individual tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after tests are complete
after(() => {
  server.close();
});
