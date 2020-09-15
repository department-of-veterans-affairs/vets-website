import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-plugin-tab';

import './commands';

export const APP_SELECTOR = '#react-root';
export const ARRAY_ITEM_SELECTOR =
  'div[name^="topOfTable_"] ~ div.va-growable-background';
export const FIELD_SELECTOR = 'input, select, textarea';
export const LOADING_SELECTOR = '.loading-indicator';

// Force interactions on elements, skipping the default checks for the
// "user interactive" state of an element, potentially saving some time.
// More importantly, this ensures the interaction will target the actual
// selected element, which overrides the default behavior that simulates
// how a real user might try to interact with a target element that has moved.
// https://github.com/cypress-io/cypress/issues/6165
export const FORCE_OPTION = { force: true };

// Cypress does not officially support typing without delay.
// See the main support file for more details.
export const NO_DELAY_OPTION = { delay: 0 };

// Suppress logs for most commands, particularly calls to wrap and get
// that are mainly there to support more specific operations.
export const NO_LOG_OPTION = { log: false };

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

  return originalFn(element, text, options);
});

// Default responses for common endpoints called by most apps.
// Stubbing these will save a few seconds of loading time in tests.
beforeEach(() => {
  cy.server();

  cy.route('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [],
    },
  });

  cy.route('GET', '/v0/maintenance_windows', {
    data: [],
  });
});
