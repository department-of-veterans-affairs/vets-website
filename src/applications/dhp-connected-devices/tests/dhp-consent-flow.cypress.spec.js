import manifest from '../manifest.json';

describe(manifest.appName, () => {
  beforeEach(() => {
    const featureToggles = {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'dhp_connected_devices_fitbit',
            value: true,
          },
        ],
      },
    };
    const backendStatuses = {
      data: {
        type: 'pagerduty_external_services_responses',
        attributes: { statuses: [] },
      },
    };
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.intercept('GET', '/v0/backend_statuses', backendStatuses);
    cy.visit(manifest.rootUrl);
    cy.injectAxe();
  });

  it("displays login modal after clicking 'Sign in or create an account' for veteran NOT logged in", () => {
    cy.axeCheck(); // checks page a11y
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/connected-devices/',
    );

    cy.findAllByText('Sign in or create an account').click({
      waitForAnimations: true,
    });
    // Tests that login modal appears after clicking
    cy.get('#signin-signup-modal').should('be.visible');
    cy.axeCheck(); // checks sign in modal a11y

    cy.get('#signin-signup-modal .va-modal-close').click({
      waitForAnimations: true,
    });
    cy.get('#signin-signup-modal').should('not.exist');
  });
});
