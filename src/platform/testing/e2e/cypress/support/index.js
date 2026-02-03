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

  // Auto-mock all Mapbox API calls to prevent hitting real API (costs money).
  // Single comprehensive intercept with conditional logic for different endpoints.
  cy.intercept('GET', '**/api.mapbox.com/**', req => {
    if (req.url.includes('/geocoding/')) {
      // Geocoding API - returns empty GeoJSON FeatureCollection
      req.reply({
        statusCode: 200,
        body: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    } else if (req.url.includes('/static/')) {
      // Static image API - returns 1x1 transparent PNG
      req.reply({
        statusCode: 200,
        headers: { 'content-type': 'image/png' },
        body: Cypress.Blob.base64StringToBlob(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          'image/png',
        ),
      });
    } else if (
      req.url.includes('/fonts/') ||
      req.url.includes('/glyphs/') ||
      req.url.includes('/tiles/') ||
      req.url.includes('/v4/') ||
      req.url.match(/\.vector\.pbf/)
    ) {
      // Font/glyph and tile APIs - return empty protobuf
      req.reply({
        statusCode: 200,
        headers: { 'content-type': 'application/x-protobuf' },
        body: new ArrayBuffer(0),
      });
    } else if (req.url.includes('/sprite')) {
      // Sprite API - returns empty sprite sheet metadata or image
      const isJson = req.url.includes('.json');
      req.reply({
        statusCode: 200,
        headers: {
          'content-type': isJson ? 'application/json' : 'image/png',
        },
        body: isJson ? {} : new ArrayBuffer(0),
      });
    } else {
      // Fallback for any other Mapbox API endpoints
      req.reply({
        statusCode: 200,
        body: {},
      });
    }
  });
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
