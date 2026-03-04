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

// Global Mapbox API mocks — prevent real API calls in all E2E tests.
// Individual tests can override with their own cy.intercept() calls.
beforeEach(() => {
  // Static map images
  cy.intercept('GET', '**/styles/v1/mapbox/**', {
    statusCode: 200,
    headers: { 'content-type': 'image/png' },
    body: '',
  });
  // Tile JSON metadata
  cy.intercept('GET', '**/v4/mapbox.*', {});
  cy.intercept('HEAD', '**/v4/mapbox.*', { statusCode: 200 });
  // Vector/raster tiles
  cy.intercept('GET', /\.tiles\.mapbox\.com/, { body: '' });
  // Map fonts
  cy.intercept('GET', '**/fonts/v1/mapbox/**', { body: '' });
  // Map sprites
  cy.intercept('GET', '**/sprites/v1/mapbox/**', { body: '' });
  // Geocoding (default fallback — tests needing specific results should override)
  /* eslint-disable camelcase */
  cy.intercept('GET', '**/geocoding/**', {
    type: 'FeatureCollection',
    query: ['austin'],
    features: [
      {
        id: 'place.1183047979754850',
        type: 'Feature',
        place_type: ['place'],
        relevance: 1,
        properties: {},
        text: 'Austin',
        place_name: 'Austin, Texas, United States',
        bbox: [-98.026, 30.068, -97.542, 30.519],
        center: [-97.7437, 30.2711],
        geometry: { type: 'Point', coordinates: [-97.7437, 30.2711] },
        context: [
          { id: 'region.123', short_code: 'US-TX', text: 'Texas' },
          { id: 'country.456', short_code: 'us', text: 'United States' },
        ],
      },
    ],
  });
  /* eslint-enable camelcase */
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
