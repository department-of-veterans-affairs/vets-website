beforeEach(() => {
  window.dataLayer = [];
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'loop_pages', value: true }],
    },
  }).as('featureToggle');
});

describe('My First Cypress Test', function() {
  it('is test fine accessible', () => {
    cy.visit('/secure-messages/');
    // .injectAxe()
    //  .axeCheck();

    // class="composeSelect hydrated"
    cy.contains('Compose message').click();
    cy.wait('@featureToggle');
    // cy.get('[class="composeInput hydrated"]').get('[value="Doctor A"]').click();
    cy.get('[class="composeSelect hydrated"]')
      .shadow()
      .find('[id="select"]')
      .select('Doctor A');
    cy.get('[id="categoryCovid"]').click();
    cy.get('[class="composeInput hydrated"]')
      .shadow()
      .find('[id="inputField"]')
      .type('Test Subject');
    cy.get('[id="message"]').type('message Test');
    cy.get('[class="send-button-bottom-text"]')
      .contains('Send')
      .click();
  });
});
