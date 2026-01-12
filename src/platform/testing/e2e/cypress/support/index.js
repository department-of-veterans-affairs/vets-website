import '@testing-library/cypress/add-commands';
import 'cypress-axe';
import 'cypress-plugin-tab';
import 'cypress-real-events/support';
import '@cypress/code-coverage/support';
import addContext from 'mochawesome/addContext';
import './commands';

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

  // Hide Foresee overlay and webpack-dev-server-client-overlay.
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML =
    '.__acs { display: none !important; } #webpack-dev-server-client-overlay { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }';
  document.head.appendChild(style);
});

// Use MutationObserver to aggressively remove webpack-dev-server overlay
// This runs after the window loads to catch dynamically added overlays
Cypress.on('window:load', win => {
  const removeOverlay = () => {
    const overlay = win.document.getElementById(
      'webpack-dev-server-client-overlay',
    );
    if (overlay) {
      overlay.remove();
    }
    // Also check for any iframes with high z-index that might be the overlay
    const iframes = win.document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (
        iframe.id === 'webpack-dev-server-client-overlay' ||
        iframe.style.zIndex === '2147483647'
      ) {
        iframe.remove();
      }
    });
  };

  // Remove immediately if it exists
  removeOverlay();

  // Set up observer to catch it if it's added later
  const observer = new MutationObserver(() => {
    removeOverlay();
  });

  // Start observing
  if (win.document.body) {
    observer.observe(win.document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    // Wait for body to be available
    const bodyObserver = new MutationObserver(() => {
      if (win.document.body) {
        observer.observe(win.document.body, {
          childList: true,
          subtree: true,
        });
        bodyObserver.disconnect();
      }
    });
    bodyObserver.observe(win.document.documentElement, {
      childList: true,
    });
  }
});

// Hide webpack-dev-server-client-overlay iframe that can block interactions
// This runs after page load in case the overlay appears dynamically
beforeEach(() => {
  cy.window().then(win => {
    const overlay = win.document.getElementById(
      'webpack-dev-server-client-overlay',
    );
    if (overlay) {
      overlay.remove();
    }
    // Also check for any iframes with high z-index that might be the overlay
    const iframes = win.document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (
        iframe.id === 'webpack-dev-server-client-overlay' ||
        iframe.style.zIndex === '2147483647'
      ) {
        iframe.remove();
      }
    });
  });
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
