import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-plugin-tab';
import 'cypress-real-events/support';
import '@cypress/code-coverage/support';
import addContext from 'mochawesome/addContext';
import './commands';

// Re-export URL utilities for easy access in tests
// Usage: import { getBaseUrl, getTestUrl } from 'support/index';
export {
  getBaseUrl,
  getTestUrl,
  normalizeTestUrl,
  urlsAreEquivalent,
} from './url-utils';

beforeEach(() => {
  cy.intercept('GET', '/feature_toggles', {
    statusCode: 200,
    body: '',
  }).as('getFeatureToggles');
});

// workaround for 'AssertionError: Timed out retrying after 4000ms: Invalid string length'
// https://github.com/testing-library/cypress-testing-library/issues/241
before(() => {
  cy.configureCypressTestingLibrary({
    getElementError(message, container) {
      const error = new Error(
        [message, container.tagName].filter(Boolean).join('\n\n'),
      );
      error.name = 'TestingLibraryElementError';
      return error;
    },
  });
});

Cypress.on('window:before:load', window => {
  // Workaround to allow Cypress to intercept requests made with the Fetch API.
  // This forces fetch to fall back to the polyfill, which can get intercepted.
  // https://github.com/cypress-io/cypress/issues/95
  delete window.fetch; // eslint-disable-line no-param-reassign

  // Hide Foresee overlay.
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.__acs { display: none !important; }';
  document.head.appendChild(style);
});

// Hack to allow the type command to accept and simulate an input with 0 delay.
// The default command ignores delays under 10 (seconds).
// https://github.com/cypress-io/cypress/issues/566#issuecomment-577763747
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  if (options?.delay === 0) {
    element.val(text);
    // Type and delete a character to trigger change events.
    // Use 0 because it's expected to pass most validations.
    return originalFn(element, '0{backspace}', options);
  }
  let newOptions;
  if (options?.delay) {
    newOptions = options;
  } else {
    // This removes the default 10 ms delay in cy.type().
    newOptions = { ...options, delay: 0 };
  }
  return originalFn(element, text, newOptions);
});

// This removes the default 10 ms delay in cy.clear().
Cypress.Commands.overwrite('clear', (originalFn, element) => {
  return originalFn(element, { delay: 0 });
});

Cypress.on('uncaught:exception', () => {
  return false;
});

// Default responses for common endpoints called by most apps.
// Stubbing these will save a few seconds of loading time in tests.
beforeEach(() => {
  cy.intercept('GET', '/v0/maintenance_windows', {
    data: [],
  });
});

// ==========================================================================
// Global Mapbox API mocks
// Prevents CI from hitting real Mapbox APIs (cost + stability).
// Tests with their own cy.intercept() for Mapbox override these via Cypress
// LIFO (last-in-first-out) — test-level beforeEach runs after support file's,
// so test-specific intercepts always take priority.
// ==========================================================================
beforeEach(() => {
  // Geocoding API — minimal valid response for tests without their own mock
  /* eslint-disable camelcase */
  cy.intercept('GET', '**/geocoding/**', {
    type: 'FeatureCollection',
    query: ['mock'],
    features: [
      {
        id: 'place.1',
        type: 'Feature',
        place_type: ['place'],
        relevance: 1,
        properties: {},
        text: 'Mock City',
        place_name: 'Mock City, State, United States',
        center: [-97.7437, 30.2711],
        geometry: {
          type: 'Point',
          coordinates: [-97.7437, 30.2711],
        },
        context: [
          { id: 'region.1', text: 'State', short_code: 'US-TX' },
          { id: 'country.1', text: 'United States', short_code: 'us' },
        ],
      },
    ],
  });
  /* eslint-enable camelcase */

  // Tile JSON metadata (GET for map init, HEAD for token health check)
  cy.intercept('GET', '**/v4/mapbox.*', {});
  cy.intercept('HEAD', '**/v4/mapbox.*', { statusCode: 200 });

  // Vector/raster tiles from CDN subdomains
  cy.intercept('GET', /\.tiles\.mapbox\.com/, { body: '' });

  // Map fonts (glyphs)
  cy.intercept('GET', '**/fonts/v1/**', { body: '' });

  // Map sprites (icons)
  cy.intercept('GET', '**/sprites/v1/**', { body: '' });

  // Mapbox telemetry
  cy.intercept('POST', '*events.mapbox.com/**', { statusCode: 204 });
});

// Assign the video path to the context property for failed tests
Cypress.on('test:after:run', test => {
  if (test.state === 'failed') {
    const videoPath = `${Cypress.spec.relative.replace('/.js.*', '.js')}.mp4`;
    addContext(
      { test },
      {
        title: 'context',
        value: {
          video: videoPath,
          retries: test.currentRetry,
          testPath: Cypress.spec.relative,
          testTitle: test.title,
        },
      },
    );
  } else {
    addContext(
      { test },
      {
        title: 'context',
        value: {
          retries: test.currentRetry,
          testPath: Cypress.spec.relative,
          testTitle: test.title,
        },
      },
    );
  }
});
