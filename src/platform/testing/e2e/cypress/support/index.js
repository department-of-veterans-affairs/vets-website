import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-plugin-tab';
import 'cypress-real-events/support';
import '@cypress/code-coverage/support';
import addContext from 'mochawesome/addContext';
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
