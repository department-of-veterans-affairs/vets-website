import '@testing-library/cypress/add-commands';

import './commands';

// Workaround to allow Cypress to intercept requests made with the Fetch API.
// This forces fetch to fall back to the polyfill, which can get intercepted.
// https://github.com/cypress-io/cypress/issues/95
Cypress.on('window:before:load', window => {
  // eslint-disable-next-line no-param-reassign
  delete window.fetch;
});
