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
  cy.intercept('GET', '/data/cms/vamc-ehr.json', {
    data: {
      nodeQuery: { count: 0, entities: [] },
    },
  });
});

// Global Mapbox API mocks — prevent real API calls in all E2E tests.
// Individual tests can override with their own cy.intercept() calls.
beforeEach(() => {
  // Style definition JSON — return minimal valid Mapbox GL style so the map
  // initializes. Matches /styles/v1/mapbox/outdoors-v11?access_token=... but
  // NOT static image URLs which have /static/ after the style name.
  cy.intercept('GET', /styles\/v1\/mapbox\/[^/]+(\?|$)/, {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: { version: 8, name: 'Mock', sources: {}, layers: [] },
  });
  // Static map images — 1x1 PNG so naturalWidth > 0 in tests
  cy.intercept('GET', '**/styles/v1/mapbox/*/static/**', {
    statusCode: 200,
    headers: { 'content-type': 'image/png' },
    body: Uint8Array.from(
      atob(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      ),
      c => c.charCodeAt(0),
    ).buffer,
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
  // Mapbox telemetry
  cy.intercept('POST', '*events.mapbox.com/**', { statusCode: 204 });
  // Geocoding fallback — placeholder tokens can't call the real Mapbox API.
  // Returns coordinates from a lookup table when available, otherwise echoes
  // the query with generic coords. Tests needing enriched place names
  // (e.g., zip 27606 → "Raleigh, NC 27606") should override with their own
  // cy.intercept('GET', '/geocoding/**/*', specificData).
  /* eslint-disable camelcase */
  // Coordinates reverse-engineered from facility-locator mock data bbox URLs
  // so that haversine distances match the expected values in mobile E2E tests.
  const cityCoords = {
    atlanta: [-84.389854, 33.7508],
    austin: [-97.7437, 30.2711],
    tampa: [-82.4571, 27.947973],
    norfolk: [-76.29294, 36.848183],
    seattle: [-122.3321, 47.6035],
    reno: [-119.81292, 39.52578],
    tulsa: [-95.989395, 36.15286],
    honolulu: [-157.86154, 21.308498],
    chicago: [-87.63236, 41.881954],
    juneau: [-134.4197, 58.3005],
    'los angeles': [-118.2439, 34.0544],
    alexandria: [-77.0469, 38.8048],
    raleigh: [-78.6382, 35.7796],
  };
  cy.intercept('GET', '**/geocoding/**', req => {
    const match = req.url.match(/mapbox\.places\/(.+?)\.json/);
    const query = match ? decodeURIComponent(match[1]) : 'unknown';
    const normalized = query
      .toLowerCase()
      .replace(/,.*$/, '')
      .trim();
    const coords = cityCoords[normalized] || [-97.7437, 30.2711];
    req.reply({
      type: 'FeatureCollection',
      query: query.split(/[\s,]+/).filter(Boolean),
      features: [
        {
          id: 'place.mock',
          type: 'Feature',
          place_type: ['place'],
          relevance: 1,
          properties: {},
          text: query,
          place_name: query,
          center: coords,
          geometry: { type: 'Point', coordinates: coords },
          context: [
            { id: 'region.mock', short_code: 'US-TX', text: 'Texas' },
            { id: 'country.mock', short_code: 'us', text: 'United States' },
          ],
        },
      ],
    });
  });
  /* eslint-enable camelcase */
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
