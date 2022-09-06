import mockMessage from './fixtures/message-response.json';

beforeEach(() => {
  window.dataLayer = [];
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'loop_pages', value: true }],
    },
  }).as('featureToggle');
});

describe('Compose Message Test', function() {
  it('is test fine accessible', () => {
    cy.visit('my-health/secure-messages/');
    cy.injectAxe().axeCheck();
    cy.intercept('/v0/messaging/health/messages/*', mockMessage).as('message');
    cy.wait('@featureToggle');
    // https://staging-api.va.gov/v0/messaging/health/messages/2339331
    // class="composeSelect hydrated"
    cy.contains('General Inquiry').click();
    cy.wait('@message');

    // cy.wait('@message');
    // cy.get('[class="composeInput hydrated"]').get('[value="Doctor A"]').click();
  });
});
