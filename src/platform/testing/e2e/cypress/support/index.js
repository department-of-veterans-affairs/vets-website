import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-plugin-tab';

import './commands';

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
  cy.intercept('GET', '/v0/maintenance_windows', {
    data: [],
  });
});
