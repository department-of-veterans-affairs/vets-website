import 'platform/polyfills';
import './sass/facility-locator.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

/**
 * Initialize the application
 */
function initApp() {
  startApp({
    url: manifest.rootUrl,
    reducer,
    routes,
    entryName: manifest.entryName,
  });
}

/**
 * Enable MSW mocking for local development.
 * Start with: USE_MOCKS=true yarn watch --env entry=facilities --env api=http://mock-vets-api.local
 */
if (process.env.USE_MOCKS === 'true') {
  // eslint-disable-next-line no-console
  console.log('[Facility Locator] Starting with mock API');
  import('./mocks/browser')
    .then(({ startMocking }) => startMocking())
    .then(initApp)
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error('[MSW] Failed to load mocks:', error);
      initApp(); // Start app anyway
    });
} else {
  initApp();
}
