/**
 * Cypress commands for MSW integration
 * These commands allow loading MSW handlers/scenarios in Cypress tests
 */

/**
 * Load MSW scenario(s) in the browser
 * @param {Array|Function} handlers - MSW handler(s) to load
 * @example
 * cy.loadMswScenario(scenarios.medications.withActiveRx())
 */
Cypress.Commands.add('loadMswScenario', handlers => {
  const handlerArray = Array.isArray(handlers) ? handlers : [handlers];
  
  cy.window().then(win => {
    if (!win.mswWorker) {
      throw new Error(
        'MSW worker not found. Make sure MSW is initialized in the application.',
      );
    }
    
    // Use MSW worker to add runtime request handlers
    win.mswWorker.use(...handlerArray);
  });
});

/**
 * Start MSW worker in the browser (if not already started)
 * Call this in beforeEach or before visiting the app
 * @example
 * cy.startMsw()
 */
Cypress.Commands.add('startMsw', () => {
  cy.window().then(win => {
    if (win.mswWorker) {
      // Already started
      return;
    }
    
    // Import and start MSW worker
    return cy.wrap(
      import('@department-of-veterans-affairs/platform-testing/msw/browser').then(
        ({ worker }) => {
          win.mswWorker = worker;
          return worker.start({
            onUnhandledRequest: 'warn',
            quiet: false,
          });
        },
      ),
    );
  });
});

/**
 * Reset MSW handlers to defaults
 * Call this in afterEach to clean up test-specific handlers
 * @example
 * cy.resetMsw()
 */
Cypress.Commands.add('resetMsw', () => {
  cy.window().then(win => {
    if (win.mswWorker) {
      win.mswWorker.resetHandlers();
    }
  });
});

/**
 * Stop MSW worker
 * Typically not needed unless you want to test without mocks
 * @example
 * cy.stopMsw()
 */
Cypress.Commands.add('stopMsw', () => {
  cy.window().then(win => {
    if (win.mswWorker) {
      win.mswWorker.stop();
      delete win.mswWorker;
    }
  });
});
