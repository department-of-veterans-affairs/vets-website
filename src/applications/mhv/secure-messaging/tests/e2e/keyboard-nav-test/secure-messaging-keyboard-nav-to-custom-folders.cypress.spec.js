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
    cy.get('[data-testid="inbox-sidebar"]').realClick();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="keyword-search-input"]').should('exist');
  });
  it('tab to draft folder', () => {
    cy.get('[data-testid="drafts-sidebar"]').realClick();
    cy.injectAxe();
    cy.axeCheck();
    // cy.tabToElement('[data-testid="drafts-sidebar"]').should('exist');
  });
  it('tab to sent folder', () => {
    cy.get('[data-testid="sent-sidebar"]').realClick();
    cy.injectAxe();
    cy.axeCheck();
    // cy.tabToElement('[data-testid="drafts-sidebar"]').should('exist');
  });
});
