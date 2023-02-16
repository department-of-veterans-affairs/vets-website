import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging access folder on landing page Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('tab to inbox folder', () => {
    cy.get('[data-testid="inbox-sidebar"]').realClick();
    cy.tabToElement('[data-testid="keyword-search-input"]').should('exist');
  });
});
