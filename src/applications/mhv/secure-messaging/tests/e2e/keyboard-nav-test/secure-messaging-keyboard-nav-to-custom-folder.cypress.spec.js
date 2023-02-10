import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging access folder on landing page Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('tab to inbox folder', () => {
    cy.get('.desktop-view-crumb').click();
    cy.get('[data-testid="Inbox"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="keyword-search-input"]').should('exist');
  });
});
