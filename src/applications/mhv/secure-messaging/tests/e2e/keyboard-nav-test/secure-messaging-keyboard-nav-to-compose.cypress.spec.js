import SecureMessagingWelcomePage from '../pages/SecureMessagingWelcomePage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging Compose', () => {
  const landingPage = new SecureMessagingWelcomePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it.skip('Keyboard Nav from Welcome Page to Compose', () => {
    cy.tabToElement('[data-testid="compose-message-link"]').type(
      'Cypress.io{enter}',
    );
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="message-body-field"] ').type(
      'Cypress.io{enter}',
    );
  });
  it('Keyboard Nav from Welcome Page to Inbox', () => {
    cy.tabToElement('[data-testid="inbox-sidebar"]');
    // .type(
    //  'Cypress.io{enter}',
    // );
    cy.injectAxe();
    // cy.axeCheck();
    // cy.tabToElement('[data-testid="Save-Draft-Button"]').should('exist');
  });
});
